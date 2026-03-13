import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { logger } from '@/lib/logger'
import { startSpan } from '@/lib/tracing'
import { initSentry, captureException } from '@/lib/sentry'

export const runtime = 'nodejs'

function hasEnv(name: string) {
  return Boolean((process.env[name] || '').trim())
}

export async function GET(req: Request) {
  initSentry()
  const span = startSpan('health.check')
  const requestId = randomUUID()

  const adminSecret = (process.env.ADMIN_SECRET || '').trim()
  if (adminSecret) {
    const headerSecret = req.headers.get('x-admin-secret') || req.headers.get('authorization')
    if (!headerSecret || headerSecret !== adminSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'x-request-id': requestId } })
    }
  }

  const checks = {
    OPENPROVIDER_USERNAME: hasEnv('OPENPROVIDER_USERNAME'),
    OPENPROVIDER_PASSWORD: hasEnv('OPENPROVIDER_PASSWORD'),
    STRIPE_SECRET_KEY: hasEnv('STRIPE_SECRET_KEY'),
    STRIPE_WEBHOOK_SECRET: hasEnv('STRIPE_WEBHOOK_SECRET'),
    DATABASE_URL: hasEnv('DATABASE_URL'),
    NEXTAUTH_SECRET: hasEnv('NEXTAUTH_SECRET'),
    NEXTAUTH_URL: hasEnv('NEXTAUTH_URL'),
    NEXT_PUBLIC_SITE_URL: hasEnv('NEXT_PUBLIC_SITE_URL'),
    CRON_SECRET: hasEnv('CRON_SECRET') || hasEnv('JOB_SECRET'),
    ADMIN_SECRET: hasEnv('ADMIN_SECRET'),
    REDIS_URL: hasEnv('REDIS_URL'),
  }

  const requiredMissing = Object.entries({
    OPENPROVIDER_USERNAME: checks.OPENPROVIDER_USERNAME,
    OPENPROVIDER_PASSWORD: checks.OPENPROVIDER_PASSWORD,
    STRIPE_SECRET_KEY: checks.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: checks.STRIPE_WEBHOOK_SECRET,
    DATABASE_URL: checks.DATABASE_URL,
    NEXTAUTH_SECRET: checks.NEXTAUTH_SECRET,
    NEXTAUTH_URL: checks.NEXTAUTH_URL,
    CRON_SECRET: checks.CRON_SECRET,
  })
    .filter(([, ok]) => !ok)
    .map(([k]) => k)

  const optionalMissing = Object.entries({
    REDIS_URL: checks.REDIS_URL,
    NEXT_PUBLIC_SITE_URL: checks.NEXT_PUBLIC_SITE_URL,
  })
    .filter(([, ok]) => !ok)
    .map(([k]) => k)

  const status = requiredMissing.length === 0 ? 200 : 503

  const payload = {
    ok: status === 200,
    status: status === 200 ? 'healthy' : 'degraded',
    requiredMissing,
    optionalMissing,
    checks,
    region: process.env.VERCEL_REGION || null,
    nodeVersion: process.version,
    now: new Date().toISOString(),
  }

  try {
    logger.info('Health check', { ok: payload.ok, missing: requiredMissing.length, optional: optionalMissing.length })
  } catch (e) {
    // ignore logging errors
    // eslint-disable-next-line no-console
    console.warn('Health logger failed', e)
  }

  span.end({ status })

  if (status !== 200) {
    try {
      captureException(new Error(`Health check failed: ${requiredMissing.join(', ')}`), { missing: requiredMissing })
    } catch (e) {
      // swallow
    }
  }

  return NextResponse.json(payload, { status, headers: { 'x-request-id': requestId } })
}
