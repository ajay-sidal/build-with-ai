import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { dbRateLimit, dbAudit } from '../../../../lib/opsStore'
import { normalizeUserTier, USER_ID_COOKIE, USER_TIER_COOKIE } from '../../../../utils/membership'
import { upsertUserTier } from '../../../../lib/userStore'

export const runtime = 'nodejs'

type Body = {
  tier?: string
  email?: string
}

function getCookie(req: Request, name: string): string | null {
  const raw = req.headers.get('cookie') || ''
  const parts = raw.split(';').map((p) => p.trim())
  for (const p of parts) {
    const i = p.indexOf('=')
    if (i <= 0) continue
    const k = p.slice(0, i).trim()
    if (k !== name) continue
    return decodeURIComponent(p.slice(i + 1))
  }
  return null
}

export async function POST(req: Request) {
  const requestId = randomUUID()

  // rate limit (fail open)
  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown'
    const rl = await dbRateLimit({ key: `membership:${ip}`, limit: 20, windowSeconds: 60 })
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: { 'x-request-id': requestId } })
    }
  } catch {
    // ignore
  }

  const body = (await req.json().catch(() => null)) as Body | null
  const tier = normalizeUserTier(body?.tier)
  const email = (body?.email || '').trim() || null

  const existingUserId = getCookie(req, USER_ID_COOKIE)
  const userId = existingUserId || randomUUID()

  // Placeholder renewal date: 30 days from now for paid tiers.
  const renewalDate = tier === 'AI_EXPLORER' ? null : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()

  try {
    await upsertUserTier({ userId, tier, email, renewalDate })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save tier'
    return NextResponse.json({ error: message }, { status: 500, headers: { 'x-request-id': requestId } })
  }

  try {
    await dbAudit({
      actorType: 'user',
      actorId: userId,
      action: 'membership_set_tier',
      resource: 'user',
      resourceId: userId,
      metadata: { tier },
    })
  } catch {
    // ignore
  }

  const res = NextResponse.json({ ok: true, userId, tier, renewalDate }, { headers: { 'x-request-id': requestId } })
  res.headers.append('Set-Cookie', `${USER_ID_COOKIE}=${encodeURIComponent(userId)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`)
  res.headers.append('Set-Cookie', `${USER_TIER_COOKIE}=${encodeURIComponent(tier)}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`)
  return res
}
