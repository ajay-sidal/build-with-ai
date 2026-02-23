import Stripe from 'stripe'

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function requireEnv(name: string): string {
  const val = (process.env[name] || '').trim()
  if (!val) throw new Error(`Missing ${name}`)
  return val
}

function getEnv(name: string, fallback: string) {
  const val = (process.env[name] || '').trim()
  return val || fallback
}

function extractCheckoutSessionId(url: string): string | null {
  const m = url.match(/cs_(test|live)_[A-Za-z0-9]+/)
  return m?.[0] || null
}

async function fetchText(url: string, init?: RequestInit, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init)
      const text = await res.text()
      return { res, text }
    } catch (err) {
      if (attempt === retries) throw err
      await sleep(delay)
    }
  }
  throw new Error('fetchText failed after retries')
}

async function fetchJson(url: string, init?: RequestInit, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, init)
      const json = (await res.json().catch(() => null)) as any
      return { res, json }
    } catch (err) {
      if (attempt === retries) throw err
      await sleep(delay)
    }
  }
  throw new Error('fetchJson failed after retries')
}

async function runWorker(baseUrl: string) {
  const secret = (process.env.CRON_SECRET || process.env.JOB_SECRET || '').trim()
  if (!secret) {
    console.log('Worker run skipped (missing CRON_SECRET/JOB_SECRET)')
    return
  }

  const { res, json } = await fetchJson(`${baseUrl}/api/jobs/process`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Worker run failed: ${res.status} ${JSON.stringify(json)}`)
  }

  console.log(`OK worker invoked (claimed=${json?.claimed ?? 'n/a'})`)
}

async function main() {
  const baseUrl = getEnv('E2E_BASE_URL', 'http://localhost:3000').replace(/\/$/, '')
  const domainName = getEnv('E2E_DOMAIN', 'www.buildwithai.digital').trim()

  // These are required by the webhook route and/or downstream OpenProvider calls.
  const stripeSecretKey = requireEnv('STRIPE_SECRET_KEY')
  const stripeWebhookSecret = requireEnv('STRIPE_WEBHOOK_SECRET')

  // Quick sanity check (do not print secrets)
  if (!stripeSecretKey.startsWith('sk_test_')) {
    throw new Error(
      `STRIPE_SECRET_KEY must be a test key (sk_test_...) for this local e2e run; got prefix=${stripeSecretKey.slice(0, 7)}`,
    )
  }
  if (!stripeWebhookSecret.startsWith('whsec_')) {
    throw new Error(`STRIPE_WEBHOOK_SECRET must look like whsec_...; got prefix=${stripeWebhookSecret.slice(0, 6)}`)
  }

  console.log(`E2E baseUrl=${baseUrl}`)
  console.log(`E2E domain=${domainName}`)

  // Step 1: Domain checkout success → upsell card should appear.
  {
    const { res, text } = await fetchText(`${baseUrl}/?checkout=success&domain=${encodeURIComponent(domainName)}`, {
      headers: { Accept: 'text/html' },
    })
    if (!res.ok) throw new Error(`Home page failed: ${res.status}`)

    const hasUpsell = text.includes('AI‑Native Hosting') || text.includes('AI-Native Hosting')
    if (!hasUpsell) throw new Error('Upsell card not detected on homepage HTML')

    console.log('OK upsell card renders')
  }

  // Step 2: Quote endpoint should work.
  let quote: { item: string; currency: string; resellerAmount: number; customerAmount: number }
  {
    const { res, json } = await fetchJson(`${baseUrl}/api/licenses/plesk/quote`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) throw new Error(`Quote failed: ${res.status} ${JSON.stringify(json)}`)
    if (!json?.quote) throw new Error(`Quote missing payload: ${JSON.stringify(json)}`)

    quote = json.quote
    console.log(`OK quote ${quote.item} ${quote.currency} ${quote.customerAmount}/mo`) // safe to print
  }

  // Step 3: License checkout endpoint should return a Stripe Checkout URL.
  let checkoutUrl: string
  let sessionId: string
  {
    const { res, json } = await fetchJson(`${baseUrl}/api/checkout/license`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ domain_name: domainName, item: quote.item }),
    })

    if (!res.ok) throw new Error(`Checkout failed: ${res.status} ${JSON.stringify(json)}`)
    checkoutUrl = String(json?.url || '')
    if (!checkoutUrl.startsWith('https://checkout.stripe.com/')) {
      throw new Error(`Unexpected checkout URL: ${checkoutUrl || '(empty)'}`)
    }

    const parsed = extractCheckoutSessionId(checkoutUrl)
    if (!parsed) throw new Error('Could not parse Checkout Session ID from returned URL')
    sessionId = parsed

    if (!sessionId.startsWith('cs_test_')) {
      throw new Error(`Expected cs_test_ session in local run; got ${sessionId}`)
    }

    console.log(`OK checkout session created (${sessionId})`)
    console.log(`Checkout URL: ${checkoutUrl}`)
  }

  // Step 4: Simulate Stripe webhook delivery with a real signature.
  {
    const stripe = new Stripe(stripeSecretKey)

    const eventId = `evt_e2e_${Date.now()}`
    const payloadObj = {
      id: eventId,
      object: 'event',
      api_version: '2024-06-20',
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      type: 'checkout.session.completed',
      data: {
        object: {
          id: sessionId,
          object: 'checkout.session',
          mode: 'subscription',
          payment_status: 'paid',
          metadata: {
            payment_type: 'LICENSE_PURCHASE',
            kind: 'license',
            domain_name: domainName,
            item: quote.item,
            currency: quote.currency,
            reseller_amount: String(quote.resellerAmount),
            customer_amount: String(quote.customerAmount),
          },
        },
      },
    }

    const payload = JSON.stringify(payloadObj)
    const signature = stripe.webhooks.generateTestHeaderString({
      payload,
      secret: stripeWebhookSecret,
      timestamp: Math.floor(Date.now() / 1000),
    })

    const { res, json } = await fetchJson(`${baseUrl}/api/webhooks/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': signature,
        Accept: 'application/json',
      },
      body: payload,
    })

    if (!res.ok) throw new Error(`Webhook POST failed: ${res.status} ${JSON.stringify(json)}`)
    console.log('OK webhook accepted')
  }

  // Step 4b: Process queued provisioning jobs (local runs won't have Vercel Cron).
  await runWorker(baseUrl)

  // Step 5: Verify license shows up on Infrastructure dashboard.
  {
    const url = `${baseUrl}/dashboard/infrastructure?domain=${encodeURIComponent(domainName)}`

    let lastText = ''
    for (let attempt = 1; attempt <= 6; attempt++) {
      const { res, text } = await fetchText(url, { headers: { Accept: 'text/html' }, cache: 'no-store' })
      if (!res.ok) throw new Error(`Infrastructure page failed: ${res.status}`)

      lastText = text

      const hasDomain = text.toLowerCase().includes(domainName.toLowerCase())
      const hasNoLicenses = text.includes('No licenses found.')

      if (hasDomain && !hasNoLicenses) {
        console.log('OK license visible on infrastructure page')
        return
      }

      console.log(`Waiting for license to appear... attempt ${attempt}/6`)
      await sleep(2500)
    }

    throw new Error(
      `License not visible on infrastructure page after retries. Last page contained "No licenses found"=${lastText.includes(
        'No licenses found.',
      )}`,
    )
  }
}

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err)
  console.error(`E2E LICENSE FLOW FAILED: ${msg}`)
  process.exit(1)
})
