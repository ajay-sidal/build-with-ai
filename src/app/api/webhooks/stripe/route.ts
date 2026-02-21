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
import { getPostgresPool } from '../../../../lib/postgres'
import { opClient } from '../../../../lib/openprovider'

export const runtime = 'nodejs'

function parseNum(value: unknown): number | null {
  if (value == null) return null
  const n = typeof value === 'number' ? value : Number(String(value))
  return Number.isFinite(n) ? n : null
}

// Affiliate + idempotency are now durable in Postgres via opsStore.

function backoffSeconds(attempts: number) {
  const base = Math.min(60 * 30, Math.max(10, Math.pow(2, Math.min(10, attempts))))
  const jitter = Math.floor(Math.random() * 5)
  return base + jitter
}

async function tryProcessJobForSession(args: {
  stripeSessionId: string
  workerId: string
}) {
  const pool = getPostgresPool()
  const client = await pool.connect()
  try {
    let job:
      | { id: number; kind: 'DOMAIN' | 'LICENSE'; stripe_session_id: string; payload: any; attempts: number }
      | null = null

    await client.query('BEGIN')
    const res = await client.query(
      `SELECT id, kind, stripe_session_id, payload, attempts
       FROM public.provisioning_jobs
       WHERE stripe_session_id = $1
         AND status IN ('PENDING','RETRY')
         AND run_at <= now()
       ORDER BY run_at ASC
       LIMIT 1
       FOR UPDATE SKIP LOCKED`,
      [args.stripeSessionId],
    )

    const row = res.rows[0]
    if (row) {
      job = {
        id: Number(row.id),
        kind: String(row.kind) as any,
        stripe_session_id: String(row.stripe_session_id),
        payload: row.payload,
        attempts: Number(row.attempts || 0),
      }

      await client.query(
        `UPDATE public.provisioning_jobs
         SET status='RUNNING', locked_at=now(), locked_by=$2, updated_at=now()
         WHERE id=$1`,
        [job.id, args.workerId],
      )
    }

    await client.query('COMMIT')
    if (!job) return { processed: false as const, reason: 'no_job' as const }

    try {
      if (job.kind === 'LICENSE') {
        const domainName = String(job.payload?.domain_name || '').trim()
        const item = String(job.payload?.item || 'PLESK-12-VPS-WEB-HOST-1M').trim()
        if (!domainName) throw new Error('Missing domain_name')

        await opClient.createPleskLicense({ domain_name: domainName, period: 1, items: [item] })
      } else {
        const name = String(job.payload?.domain_name || '').trim()
        const tld = String(job.payload?.tld || '').trim()
        const ownerHandle = String(job.payload?.owner_handle || '').trim()
        const fqdn = String(job.payload?.fqdn || (name && tld ? `${name}.${tld}` : '')).trim()

        if (!name || !tld || !ownerHandle) throw new Error('Missing domain payload')

        await opClient.createDomain(
          {
            domain: { name, extension: tld },
            owner_handle: ownerHandle,
            admin_handle: ownerHandle,
            tech_handle: ownerHandle,
            billing_handle: ownerHandle,
            period: 1,
          },
          { provisionDnsZone: false },
        )

        if (fqdn) {
          await opClient.createDnsZone({ domain: fqdn, type: 'master' } as any)
        }
      }

      await client.query(
        `UPDATE public.provisioning_jobs
         SET status='COMPLETED', updated_at=now(), last_error=NULL
         WHERE id=$1`,
        [job.id],
      )

      await dbMarkStripeSession({
        stripeSessionId: job.stripe_session_id,
        paymentType: job.kind,
        status: 'COMPLETED',
      })

      await dbAudit({
        actorType: 'stripe',
        actorId: args.workerId,
        action: 'job_completed_inline',
        resource: 'provisioning_job',
        resourceId: String(job.id),
        metadata: { kind: job.kind, stripeSessionId: job.stripe_session_id },
      })

      return { processed: true as const, status: 'COMPLETED' as const }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      const nextAttempts = job.attempts + 1
      const delay = backoffSeconds(nextAttempts)
      const nextStatus = nextAttempts >= 10 ? 'FAILED' : 'RETRY'

      await client.query(
        `UPDATE public.provisioning_jobs
         SET status=$2, attempts=$3, last_error=$4, run_at=now() + ($5 || ' seconds')::interval, updated_at=now()
         WHERE id=$1`,
        [job.id, nextStatus, nextAttempts, message, String(delay)],
      )

      await dbAudit({
        actorType: 'stripe',
        actorId: args.workerId,
        action: 'job_failed_inline',
        resource: 'provisioning_job',
        resourceId: String(job.id),
        metadata: { kind: job.kind, stripeSessionId: job.stripe_session_id, attempts: nextAttempts, message },
      })

      return { processed: true as const, status: nextStatus, error: message }
    }
  } finally {
    client.release()
  }
}

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

    // Hobby-safe processing: attempt to process the just-enqueued job inline.
    // (Cron jobs on Hobby can only run once/day.)
    try {
      await tryProcessJobForSession({ stripeSessionId: session.id, workerId: `webhook_${event.id}` })
    } catch {
      // ignore; the daily cron / manual worker call can pick it up later
    }
  }

  return NextResponse.json({ received: true }, { headers: { 'x-request-id': requestId } })
}
