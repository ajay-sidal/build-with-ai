import { NextResponse } from 'next/server'
import { appendFile, mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { AFFILIATE_COOKIE_NAME, parseCookieHeader } from '../../../../utils/affiliate'

export const runtime = 'nodejs'

const LIMIT = 1000

function normalizeEmail(input: string) {
  return input.trim().toLowerCase()
}

function isValidEmail(email: string) {
  // Simple pragmatic check; avoids obvious garbage without being overly strict.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function readLines(path: string): Promise<string[]> {
  const text = await readFile(path, { encoding: 'utf8' }).catch((err: any) => {
    if (err?.code === 'ENOENT') return ''
    throw err
  })
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
}

async function getAlphaStats(dataDir: string) {
  const path = join(dataDir, 'alpha_list.jsonl')
  const lines = await readLines(path)
  const count = lines.length
  const remaining = Math.max(0, LIMIT - count)
  return { count, remaining, limit: LIMIT }
}

export async function GET() {
  try {
    const dataDir = join(process.cwd(), 'data')
    await mkdir(dataDir, { recursive: true })
    const stats = await getAlphaStats(dataDir)
    return NextResponse.json(stats)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load alpha stats'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

type Body = { email?: string }

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null
    const email = normalizeEmail(body?.email || '')
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    if (!isValidEmail(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })

    const cookies = parseCookieHeader(req.headers.get('cookie'))
    const partnerId = (cookies[AFFILIATE_COOKIE_NAME] || '').toString().trim()

    const dataDir = join(process.cwd(), 'data')
    await mkdir(dataDir, { recursive: true })

    const path = join(dataDir, 'alpha_list.jsonl')

    const lines = await readLines(path)
    const existing = new Set(
      lines
        .map((l) => {
          try {
            const rec = JSON.parse(l) as { email?: string }
            return normalizeEmail(rec.email || '')
          } catch {
            return ''
          }
        })
        .filter(Boolean),
    )

    const count = lines.length
    if (count >= LIMIT && !existing.has(email)) {
      return NextResponse.json({ error: 'Alpha list is full', count, remaining: 0, limit: LIMIT }, { status: 403 })
    }

    const already = existing.has(email)
    if (!already) {
      const record = {
        createdAt: new Date().toISOString(),
        email,
        partnerId: partnerId || undefined,
        ua: req.headers.get('user-agent') || undefined,
      }
      await appendFile(path, JSON.stringify(record) + '\n', { encoding: 'utf8' })
    }

    const stats = await getAlphaStats(dataDir)
    return NextResponse.json({ ok: true, already, ...stats })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signup failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
