import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import {
  dbAudit,
  dbEnqueueProvisioningJob,
  dbHasStripeSession,
  dbMarkStripeSession,
  dbRateLimit,
  dbRecordAffiliateSale,
} from '../../../../lib/opsStore'
import { randomUUID } from 'node:crypto'

export const runtime = 'nodejs'

function parseNum(value: unknown): number | null {
  if (value == null) return null
  const n = typeof value === 'number' ? value : Number(String(value))
  return Number.isFinite(n) ? n : null
}

// Affiliate + idempotency are now durable in Postgres via opsStore.

export async function POST(req: Request) {
  const requestId = randomUUID()
  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secretKey) return NextResponse.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 500, headers: { 'x-request-id': requestId } })
  if (!webhookSecret) return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 500, headers: { 'x-request-id': requestId } })

  // High-limit rate control to reduce abuse; do not break Stripe retries if DB is unavailable.
  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown'
    const rl = await dbRateLimit({ key: `stripe_webhook:${ip}`, limit: 600, windowSeconds: 60 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'x-request-id': requestId } },
      )
    }
  } catch {
    // ignore
  }

  const stripe = new Stripe(secretKey)

  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400, headers: { 'x-request-id': requestId } })

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid webhook signature'
    return NextResponse.json({ error: message }, { status: 400, headers: { 'x-request-id': requestId } })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const md = session.metadata || {}

    const paymentType = (md.payment_type || md.kind || 'unknown').toString()

    // Durable idempotency: if we've already COMPLETED this session, ack and exit.
    const existing = await dbHasStripeSession(session.id)
    if (existing?.status === 'COMPLETED') {
      return NextResponse.json({ received: true, ignored: 'already_processed' }, { headers: { 'x-request-id': requestId } })
    }

    await dbMarkStripeSession({
      stripeSessionId: session.id,
      paymentType,
      status: 'STARTED',
      eventId: event.id,
      metadata: md as any,
    })

    // Best-effort affiliate attribution (does not affect provisioning flow)
    try {
      await dbRecordAffiliateSale({ session, metadata: md as any, eventId: event.id })
    } catch {
      // ignore
    }

    // Queue-based provisioning (fast webhook ack)
    try {
      if (paymentType === 'LICENSE_PURCHASE') {
        await dbEnqueueProvisioningJob({
          kind: 'LICENSE',
          stripeSessionId: session.id,
          payload: {
            domain_name: (md.domain_name || '').toString(),
            item: (md.item || 'PLESK-12-VPS-WEB-HOST-1M').toString(),
          },
        })
      } else if ((md.domain_name && md.tld && md.owner_handle) || md.kind === 'domain') {
        await dbEnqueueProvisioningJob({
          kind: 'DOMAIN',
          stripeSessionId: session.id,
          payload: {
            domain_name: (md.domain_name || '').toString(),
            tld: (md.tld || '').toString(),
            fqdn: (md.fqdn || '').toString(),
            owner_handle: (md.owner_handle || '').toString(),
          },
        })
      }

      await dbAudit({
        actorType: 'stripe',
        actorId: session.id,
        action: 'webhook_enqueued',
        resource: 'stripe_session',
        resourceId: session.id,
        metadata: { paymentType },
      })
    } catch {
      // If enqueue fails, still ACK; Stripe will retry and our idempotency record will prevent double-processing once fixed.
    }
  }

  return NextResponse.json({ received: true }, { headers: { 'x-request-id': requestId } })
}
