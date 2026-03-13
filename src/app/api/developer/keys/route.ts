import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { dbRateLimit, dbAudit } from '../../../../lib/opsStore'
import { createDeveloperKey, getApiUsageCount, listDeveloperKeys } from '../../../../lib/developerStore'

export const runtime = 'nodejs'

function json(resBody: any, init?: { status?: number; requestId: string }) {
  return NextResponse.json(resBody, {
    status: init?.status,
    headers: {
      'x-request-id': init?.requestId || randomUUID(),
    },
  })
}

export async function GET(req: Request) {
  const requestId = randomUUID()

  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown'
    const rl = await dbRateLimit({ key: `devkeys:${ip}`, limit: 60, windowSeconds: 60 })
    if (!rl.allowed) return json({ error: 'Too many requests', requestId }, { status: 429, requestId })
  } catch {
    // ignore
  }

  const url = new URL(req.url)
  const userId = (url.searchParams.get('userId') || '').trim()
  if (!userId) return json({ error: 'Missing userId', requestId }, { status: 400, requestId })

  try {
    const keys = await listDeveloperKeys({ userId })
    const usage24h = await getApiUsageCount({ userId, windowHours: 24 })
    return json({ keys, usage: { windowHours: 24, count: usage24h }, requestId }, { requestId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load keys'
    return json({ error: message, requestId }, { status: 500, requestId })
  }
}

export async function POST(req: Request) {
  const requestId = randomUUID()

  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown'
    const rl = await dbRateLimit({ key: `devkeys-create:${ip}`, limit: 10, windowSeconds: 60 })
    if (!rl.allowed) return json({ error: 'Too many requests', requestId }, { status: 429, requestId })
  } catch {
    // ignore
  }

  const body = (await req.json().catch(() => null)) as { userId?: string } | null
  const userId = (body?.userId || '').trim()
  if (!userId) return json({ error: 'Missing userId', requestId }, { status: 400, requestId })

  try {
    const created = await createDeveloperKey({ userId })

    try {
      await dbAudit({
        actorType: 'user',
        actorId: userId,
        action: 'developer_key_created',
        resource: 'developer_key',
        resourceId: created.id,
      })
    } catch {
      // ignore
    }

    // IMPORTANT: apiKey is returned only once.
    return json({ key: created, requestId }, { requestId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create key'
    return json({ error: message, requestId }, { status: 500, requestId })
  }
}
