import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { calculateCustomerPrice } from '../../../../utils/pricing'
import { AFFILIATE_COOKIE_NAME, parseCookieHeader } from '../../../../utils/affiliate'

export const runtime = 'nodejs'

type RequestBody = {
  domain_name: string
  item?: string
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function toStripeUnitAmount(currency: string, amount: number) {
  const unitAmount = Math.round(amount * 100)
  if (!Number.isFinite(unitAmount) || unitAmount <= 0) throw new Error('Invalid amount')
  return unitAmount
}

function getDefaultConfig() {
  const item = (process.env.PLESK_DEFAULT_ITEM || 'PLESK-12-VPS-WEB-HOST-1M').trim()
  const currency = (process.env.PLESK_DEFAULT_CURRENCY || 'USD').trim().toUpperCase()
  const resellerAmount = Number((process.env.PLESK_DEFAULT_RESELLER_PRICE || '').trim())

  if (!Number.isFinite(resellerAmount) || resellerAmount <= 0) {
    throw new Error('Missing/invalid PLESK_DEFAULT_RESELLER_PRICE')
  }

  return { item, currency, resellerAmount }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RequestBody | null
  const domainName = (body?.domain_name || '').trim()
  if (!domainName) return NextResponse.json({ error: 'Missing domain_name' }, { status: 400 })

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })

  const stripe = new Stripe(secretKey)

  try {
    const origin = req.headers.get('origin') || 'http://localhost:3000'
    const cookies = parseCookieHeader(req.headers.get('cookie'))
    const partnerId = cookies[AFFILIATE_COOKIE_NAME] || ''

    const cfg = getDefaultConfig()
    const item = (body?.item || cfg.item).trim() || cfg.item

    const finalAmount = round2(calculateCustomerPrice(cfg.resellerAmount, 'LICENSE'))
    const resellerAmount = round2(cfg.resellerAmount)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      success_url: `${origin}/dashboard/infrastructure?license=success&domain=${encodeURIComponent(domainName)}`,
      cancel_url: `${origin}/?license=cancelled&domain=${encodeURIComponent(domainName)}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: cfg.currency.toLowerCase(),
            unit_amount: toStripeUnitAmount(cfg.currency, finalAmount),
            recurring: { interval: 'month' },
            product_data: {
              name: `Plesk Web Host Edition (Monthly) — ${domainName}`,
            },
          },
        },
      ],
      metadata: {
        payment_type: 'LICENSE_PURCHASE',
        kind: 'license',
        domain_name: domainName,
        item,
        partner_id: partnerId,
        currency: cfg.currency,
        reseller_amount: String(resellerAmount),
        customer_amount: String(finalAmount),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
