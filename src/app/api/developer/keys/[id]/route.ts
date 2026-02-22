import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { dbRateLimit, dbAudit } from '../../../../../lib/opsStore'
import { revokeDeveloperKey } from '../../../../../lib/developerStore'

export const runtime = 'nodejs'

function json(resBody: any, init?: { status?: number; requestId: string }) {
  return NextResponse.json(resBody, {
    status: init?.status,
    headers: {
      'x-request-id': init?.requestId || randomUUID(),
    },
  })
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const requestId = randomUUID()

  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown'
    const rl = await dbRateLimit({ key: `devkeys-revoke:${ip}`, limit: 20, windowSeconds: 60 })
    if (!rl.allowed) return json({ error: 'Too many requests', requestId }, { status: 429, requestId })
  } catch {
    // ignore
  }

  const url = new URL(req.url)
  const userId = (url.searchParams.get('userId') || '').trim()
  const { id } = await ctx.params

  if (!userId) return json({ error: 'Missing userId', requestId }, { status: 400, requestId })
  if (!id) return json({ error: 'Missing id', requestId }, { status: 400, requestId })

  try {
    const ok = await revokeDeveloperKey({ userId, id })

    try {
      await dbAudit({
        actorType: 'user',
        actorId: userId,
        action: 'developer_key_revoked',
        resource: 'developer_key',
        resourceId: id,
      })
    } catch {
      // ignore
    }

    return json({ ok, requestId }, { requestId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to revoke key'
    return json({ error: message, requestId }, { status: 500, requestId })
  }
}
