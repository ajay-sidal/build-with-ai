import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { opClient } from '../../../../lib/openprovider'
import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { processCheckoutSessionCompleted } from '../../../../lib/stripeProvisioning'
import { getDataDir } from '../../../../lib/dataDir'

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

  const dataDir = getDataDir()
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

    await processCheckoutSessionCompleted({
      session,
      metadata: md as any,
      eventId: event.id,
      opClient: opClient as any,
    })
  }

  return NextResponse.json({ received: true })
}
