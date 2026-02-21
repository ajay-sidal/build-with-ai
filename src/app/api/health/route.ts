import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

export const runtime = 'nodejs'

function hasEnv(name: string) {
  return Boolean((process.env[name] || '').trim())
}

export async function GET(req: Request) {
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
    CRON_SECRET: hasEnv('CRON_SECRET') || hasEnv('JOB_SECRET'),
    ADMIN_SECRET: hasEnv('ADMIN_SECRET'),
  }

  const requiredMissing = Object.entries({
    OPENPROVIDER_USERNAME: checks.OPENPROVIDER_USERNAME,
    OPENPROVIDER_PASSWORD: checks.OPENPROVIDER_PASSWORD,
    STRIPE_SECRET_KEY: checks.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: checks.STRIPE_WEBHOOK_SECRET,
    DATABASE_URL: checks.DATABASE_URL,
    CRON_SECRET: checks.CRON_SECRET,
  })
    .filter(([, ok]) => !ok)
    .map(([k]) => k)

  const status = requiredMissing.length === 0 ? 200 : 500

  return NextResponse.json(
    {
      ok: status === 200,
      requiredMissing,
      checks,
      region: process.env.VERCEL_REGION || null,
      now: new Date().toISOString(),
    },
    { status, headers: { 'x-request-id': requestId } },
  )
}
