import type Stripe from 'stripe'
import { getPostgresPool } from './postgres'

export type DbStripeSession = {
  stripe_session_id: string
  payment_type: string
  status: 'STARTED' | 'COMPLETED'
  event_id: string | null
  metadata: any
}

export async function dbHasStripeSession(stripeSessionId: string): Promise<DbStripeSession | null> {
  const pool = getPostgresPool()
  const { rows } = await pool.query<DbStripeSession>(
    'SELECT stripe_session_id, payment_type, status, event_id, metadata FROM public.stripe_sessions WHERE stripe_session_id = $1',
    [stripeSessionId],
  )
  return rows[0] || null
}

export async function dbMarkStripeSession(args: {
  stripeSessionId: string
  paymentType: string
  status: 'STARTED' | 'COMPLETED'
  eventId?: string
  metadata?: Record<string, any>
}): Promise<void> {
  const pool = getPostgresPool()
  await pool.query(
    `INSERT INTO public.stripe_sessions (stripe_session_id, payment_type, status, event_id, metadata)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (stripe_session_id)
     DO UPDATE SET status = EXCLUDED.status,
                   payment_type = EXCLUDED.payment_type,
                   event_id = COALESCE(EXCLUDED.event_id, public.stripe_sessions.event_id),
                   metadata = COALESCE(EXCLUDED.metadata, public.stripe_sessions.metadata),
                   updated_at = now(),
                   completed_at = CASE WHEN EXCLUDED.status = 'COMPLETED' THEN now() ELSE public.stripe_sessions.completed_at END`,
    [args.stripeSessionId, args.paymentType, args.status, args.eventId || null, args.metadata ? JSON.stringify(args.metadata) : null],
  )
}

export async function dbEnqueueProvisioningJob(args: {
  kind: 'DOMAIN' | 'LICENSE'
  stripeSessionId: string
  payload: Record<string, any>
}): Promise<void> {
  const pool = getPostgresPool()
  await pool.query(
    `INSERT INTO public.provisioning_jobs (kind, stripe_session_id, payload)
     VALUES ($1,$2,$3)
     ON CONFLICT (stripe_session_id) DO NOTHING`,
    [args.kind, args.stripeSessionId, JSON.stringify(args.payload)],
  )
}

export async function dbRecordAffiliateSale(args: {
  session: Stripe.Checkout.Session
  metadata: Record<string, string>
  eventId: string
}): Promise<void> {
  const partnerId = (args.metadata.partner_id || '').toString().trim()
  if (!partnerId) return

  const customerAmount = Number(args.metadata.customer_amount || NaN)
  const resellerAmount = Number(args.metadata.reseller_amount || NaN)
  const markupAmount = Number(args.metadata.markup_amount || (Number.isFinite(customerAmount) && Number.isFinite(resellerAmount) ? Math.max(0, customerAmount - resellerAmount) : 0))
  const commissionAmount = Math.round(Math.max(0, markupAmount) * 0.05 * 100) / 100

  const pool = getPostgresPool()
  await pool.query(
    `INSERT INTO public.affiliate_sales (event_id, partner_id, stripe_session_id, kind, currency, customer_amount, reseller_amount, markup_amount, commission_amount, metadata)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     ON CONFLICT (partner_id, stripe_session_id) DO NOTHING`,
    [
      args.eventId,
      partnerId,
      args.session.id,
      (args.metadata.kind || args.metadata.payment_type || 'unknown').toString(),
      (args.metadata.currency || args.session.currency || '').toString().toUpperCase() || null,
      Number.isFinite(customerAmount) ? customerAmount : null,
      Number.isFinite(resellerAmount) ? resellerAmount : null,
      Number.isFinite(markupAmount) ? markupAmount : null,
      Number.isFinite(commissionAmount) ? commissionAmount : null,
      JSON.stringify({
        fqdn: args.metadata.fqdn || null,
        sku: args.metadata.sku || null,
        proposal_slug: args.metadata.proposal_slug || null,
        discount_code: args.metadata.discount_code || null,
      }),
    ],
  )
}

export async function dbAudit(args: {
  actorType?: string
  actorId?: string
  action: string
  resource?: string
  resourceId?: string
  metadata?: Record<string, any>
}) {
  const pool = getPostgresPool()
  await pool.query(
    `INSERT INTO public.audit_logs (actor_type, actor_id, action, resource, resource_id, metadata)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [args.actorType || null, args.actorId || null, args.action, args.resource || null, args.resourceId || null, args.metadata ? JSON.stringify(args.metadata) : null],
  )
}

export async function dbRateLimit(args: {
  key: string
  limit: number
  windowSeconds: number
}): Promise<{ allowed: boolean; remaining: number }> {
  const pool = getPostgresPool()
  const now = new Date()
  const windowStart = new Date(Math.floor(now.getTime() / (args.windowSeconds * 1000)) * args.windowSeconds * 1000)

  const { rows } = await pool.query<{ count: number }>(
    `INSERT INTO public.rate_limits (key, window_start, count)
     VALUES ($1, $2, 1)
     ON CONFLICT (key)
     DO UPDATE SET
       window_start = CASE WHEN public.rate_limits.window_start = EXCLUDED.window_start THEN public.rate_limits.window_start ELSE EXCLUDED.window_start END,
       count = CASE WHEN public.rate_limits.window_start = EXCLUDED.window_start THEN public.rate_limits.count + 1 ELSE 1 END
     RETURNING count`,
    [args.key, windowStart.toISOString()],
  )

  const count = Number(rows?.[0]?.count || 0)
  const remaining = Math.max(0, args.limit - count)
  return { allowed: count <= args.limit, remaining }
}
