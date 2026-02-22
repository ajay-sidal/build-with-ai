import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { dbRateLimit } from './opsStore'
import { findDeveloperKeyByApiKey, logApiUsage } from './developerStore'

export type DeveloperAuthContext = {
  requestId: string
  keyId: string
  userId: string
}

export async function requireDeveloperKey(req: Request): Promise<{ ok: true; ctx: DeveloperAuthContext } | { ok: false; res: NextResponse }> {
  const requestId = randomUUID()

  const apiKey = (req.headers.get('x-api-key') || '').trim()
  if (!apiKey) {
    return {
      ok: false,
      res: NextResponse.json(
        { error: 'Missing x-api-key', requestId },
        { status: 401, headers: { 'x-request-id': requestId, powered_by: 'BuildWithAI.digital' } },
      ),
    }
  }

  let key: { id: string; userId: string } | null = null
  try {
    key = await findDeveloperKeyByApiKey(apiKey)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Auth failed'
    return {
      ok: false,
      res: NextResponse.json(
        { error: message, requestId },
        { status: 500, headers: { 'x-request-id': requestId, powered_by: 'BuildWithAI.digital' } },
      ),
    }
  }

  if (!key) {
    return {
      ok: false,
      res: NextResponse.json(
        { error: 'Invalid API key', requestId },
        { status: 403, headers: { 'x-request-id': requestId, powered_by: 'BuildWithAI.digital' } },
      ),
    }
  }

  // Rate limit (best effort). If rate limiter fails, fail open.
  try {
    const rl = await dbRateLimit({ key: `devapi:${key.id}`, limit: 60, windowSeconds: 60 })
    if (!rl.allowed) {
      return {
        ok: false,
        res: NextResponse.json(
          { error: 'Rate limit exceeded', requestId, remaining: rl.remaining },
          { status: 429, headers: { 'x-request-id': requestId, powered_by: 'BuildWithAI.digital' } },
        ),
      }
    }
  } catch {
    // ignore
  }

  // Log usage (best effort)
  try {
    const url = new URL(req.url)
    await logApiUsage({ keyId: key.id, userId: key.userId, endpoint: url.pathname, method: req.method })
  } catch {
    // ignore
  }

  return { ok: true, ctx: { requestId, keyId: key.id, userId: key.userId } }
}
