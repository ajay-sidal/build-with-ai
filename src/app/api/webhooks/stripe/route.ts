import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { opClient } from '../../../../lib/openprovider'
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'

function parseNum(value: unknown): number | null {
  if (value == null) return null
  const n = typeof value === 'number' ? value : Number(String(value))
  return Number.isFinite(n) ? n : null
}

async function recordAffiliateSale(args: {
  session: Stripe.Checkout.Session
  metadata: Record<string, string>
  eventId: string
}) {
  const partnerId = (args.metadata.partner_id || '').toString().trim()
  if (!partnerId) return

  const currency = (args.metadata.currency || args.session.currency || '').toString().toUpperCase()

  const customerAmount = parseNum(args.metadata.customer_amount)
  const resellerAmount = parseNum(args.metadata.reseller_amount)
  const explicitMarkup = parseNum(args.metadata.markup_amount)

  const markupAmount =
    explicitMarkup ??
    (customerAmount != null && resellerAmount != null ? Math.max(0, customerAmount - resellerAmount) : null)

  const commissionAmount = markupAmount != null ? Math.round(markupAmount * 0.05 * 100) / 100 : 0

  const record = {
    createdAt: new Date().toISOString(),
    eventId: args.eventId,
    partnerId,
    kind: (args.metadata.kind || args.metadata.payment_type || 'unknown').toString(),
    stripe: {
      sessionId: args.session.id,
      paymentStatus: args.session.payment_status,
      amountTotal: args.session.amount_total,
      currency: args.session.currency,
    },
    meta: {
      currency,
      customerAmount,
      resellerAmount,
      markupAmount,
      commissionAmount,
      fqdn: args.metadata.fqdn || undefined,
      sku: args.metadata.sku || undefined,
      proposalSlug: args.metadata.proposal_slug || undefined,
    },
  }

  const dataDir = join(process.cwd(), 'data')
  await mkdir(dataDir, { recursive: true })
  const outFile = join(dataDir, 'affiliate_sales.jsonl')

  await appendFile(outFile, JSON.stringify(record) + '\n', { encoding: 'utf8' })
}

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey) return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500 })
  if (!webhookSecret) return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 500 })

  const stripe = new Stripe(secretKey)

  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid webhook signature'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const md = session.metadata || {}

    // Best-effort affiliate attribution (does not affect provisioning flow)
    try {
      await recordAffiliateSale({ session, metadata: md as any, eventId: event.id })
    } catch {
      // ignore
    }

    if (md.payment_type === 'LICENSE_PURCHASE') {
      const domainName = (md.domain_name || '').toString().trim()
      const item = (md.item || 'PLESK-12-VPS-WEB-HOST-1M').toString().trim()

      if (domainName) {
        // Provision the Plesk license via OpenProvider
        await opClient.createPleskLicense({
          domain_name: domainName,
          period: 1,
          items: [item],
        })
      }

      return NextResponse.json({ received: true })
    }

    if (md.payment_type === 'SERVICE_DEPOSIT') {
      const slug = (md.proposal_slug || 'unknown').toString()
      const email = (md.lead_email || '').toString().trim().toLowerCase()
      const name = (md.lead_name || '').toString()

      const dataDir = join(process.cwd(), 'data')
      await mkdir(dataDir, { recursive: true })

      // Project folder
      const projectDir = join(dataDir, 'projects', slug)
      await mkdir(projectDir, { recursive: true })
      await writeFile(
        join(projectDir, 'project.json'),
        JSON.stringify(
          {
            slug,
            lead: { name, email },
            stripe: { sessionId: session.id, paymentStatus: session.payment_status },
            createdAt: new Date().toISOString(),
          },
          null,
          2,
        ),
        { encoding: 'utf8' },
      )

      // Mark lead as Closed in CRM (persisted)
      if (email) {
        const statusFile = join(dataDir, 'lead-statuses.json')
        const statusText = await readFile(statusFile, { encoding: 'utf8' }).catch((err: any) => {
          if (err?.code === 'ENOENT') return '{}'
          throw err
        })
        const map = (() => {
          try {
            return JSON.parse(statusText) as Record<string, 'New' | 'Contacted' | 'Closed'>
          } catch {
            return {} as Record<string, 'New' | 'Contacted' | 'Closed'>
          }
        })()
        map[email] = 'Closed'
        await writeFile(statusFile, JSON.stringify(map, null, 2), { encoding: 'utf8' })
      }

      return NextResponse.json({ received: true })
    }

    const domainName = md.domain_name
    const tld = md.tld
    const ownerHandle = md.owner_handle

    if (domainName && tld && ownerHandle) {
      const fqdn = md.fqdn || `${domainName}.${tld}`

      // Requirement: call createDomain() AND createDnsZone() using metadata.
      // Disable auto-DNS on createDomain to avoid double provisioning.
      await opClient.createDomain(
        {
          domain: { name: domainName, extension: tld },
          owner_handle: ownerHandle,
          admin_handle: ownerHandle,
          tech_handle: ownerHandle,
          billing_handle: ownerHandle,
          period: 1,
        },
        { provisionDnsZone: false },
      )

      await opClient.createDnsZone({ domain: fqdn, type: 'master' })
    }
  }

  return NextResponse.json({ received: true })
}
