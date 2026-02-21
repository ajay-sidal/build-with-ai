import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { getPostgresPool } from '../../../../lib/postgres'
import { opClient } from '../../../../lib/openprovider'
import { dbAudit, dbMarkStripeSession, dbRateLimit } from '../../../../lib/opsStore'

export const runtime = 'nodejs'

function getSecret(req: Request) {
  const header = req.headers.get('authorization') || req.headers.get('x-job-secret') || ''
  if (header.toLowerCase().startsWith('bearer ')) return header.slice(7).trim()
  return header.trim()
}

function backoffSeconds(attempts: number) {
  const base = Math.min(60 * 30, Math.max(10, Math.pow(2, Math.min(10, attempts)) ))
  const jitter = Math.floor(Math.random() * 5)
  return base + jitter
}

async function handle(req: Request) {
  const requestId = randomUUID()
  const expected = (process.env.CRON_SECRET || process.env.JOB_SECRET || '').trim()
  if (!expected) {
    return NextResponse.json(
      { error: 'Missing CRON_SECRET/JOB_SECRET' },
      { status: 500, headers: { 'x-request-id': requestId } },
    )
  }
  if (getSecret(req) !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'x-request-id': requestId } })
  }

  // Rate limit to avoid runaway cron / abuse. Fail open if DB is unavailable.
  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown'
    const rl = await dbRateLimit({ key: `jobs_process:${ip}`, limit: 120, windowSeconds: 60 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'x-request-id': requestId } },
      )
    }
  } catch {
    // ignore
  }

  const workerId = `worker_${process.env.VERCEL_REGION || 'local'}_${randomUUID()}`
  const pool = getPostgresPool()

  const client = await pool.connect()
  try {
    const claimed: Array<{ id: number; kind: string; stripe_session_id: string; payload: any; attempts: number }> = []

    await client.query('BEGIN')
    const res = await client.query(
      `SELECT id, kind, stripe_session_id, payload, attempts
       FROM public.provisioning_jobs
       WHERE status IN ('PENDING','RETRY') AND run_at <= now()
       ORDER BY run_at ASC
       LIMIT 5
       FOR UPDATE SKIP LOCKED`,
    )

    for (const row of res.rows) {
      claimed.push({
        id: Number(row.id),
        kind: String(row.kind),
        stripe_session_id: String(row.stripe_session_id),
        payload: row.payload,
        attempts: Number(row.attempts || 0),
      })
    }

    if (claimed.length > 0) {
      await client.query(
        `UPDATE public.provisioning_jobs
         SET status='RUNNING', locked_at=now(), locked_by=$1, updated_at=now()
         WHERE id = ANY($2::bigint[])`,
        [workerId, claimed.map((j) => j.id)],
      )
    }

    await client.query('COMMIT')

    const results: any[] = []

    for (const job of claimed) {
      try {
        if (job.kind === 'LICENSE') {
          const domainName = String(job.payload?.domain_name || '').trim()
          const item = String(job.payload?.item || 'PLESK-12-VPS-WEB-HOST-1M').trim()
          if (!domainName) throw new Error('Missing domain_name')

          await opClient.createPleskLicense({ domain_name: domainName, period: 1, items: [item] })
        } else if (job.kind === 'DOMAIN') {
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
          actorType: 'worker',
          actorId: workerId,
          action: 'job_completed',
          resource: 'provisioning_job',
          resourceId: String(job.id),
          metadata: { kind: job.kind, stripeSessionId: job.stripe_session_id },
        })

        results.push({ id: job.id, status: 'COMPLETED' })
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
          actorType: 'worker',
          actorId: workerId,
          action: 'job_failed',
          resource: 'provisioning_job',
          resourceId: String(job.id),
          metadata: { kind: job.kind, stripeSessionId: job.stripe_session_id, attempts: nextAttempts, message },
        })

        results.push({ id: job.id, status: nextStatus, error: message })
      }
    }

    return NextResponse.json(
      { ok: true, workerId, claimed: claimed.length, results },
      { headers: { 'x-request-id': requestId } },
    )
  } finally {
    client.release()
  }
}

export async function GET(req: Request) {
  return handle(req)
}

export async function POST(req: Request) {
  return handle(req)
}
