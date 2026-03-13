import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { dbAudit } from '../../../../lib/opsStore'
import { getDataDir } from '../../../../lib/dataDir'

export const runtime = 'nodejs'

type ClientErrorRecord = {
  createdAt?: string
  message?: string
  stack?: string
  url?: string
  userAgent?: string
}

export async function GET(req: Request) {
  const requestId = randomUUID()
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return NextResponse.json({ error: 'Missing ADMIN_SECRET on server' }, { status: 500, headers: { 'x-request-id': requestId } })

  const headerSecret = req.headers.get('x-admin-secret') || req.headers.get('authorization')
  if (!headerSecret || headerSecret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'x-request-id': requestId } })
  }

  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown'
    await dbAudit({
      actorType: 'admin',
      actorId: 'admin',
      action: 'admin_client_errors_list',
      resource: 'client_error',
      resourceId: 'list',
      metadata: { ip },
    })
  } catch {
    // ignore
  }

  const file = join(getDataDir(), 'client_errors.jsonl')
  const text = await readFile(file, { encoding: 'utf8' }).catch((err: any) => {
    if (err?.code === 'ENOENT') return ''
    throw err
  })

  const results: ClientErrorRecord[] = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as ClientErrorRecord
      } catch {
        return null
      }
    })
    .filter((x): x is ClientErrorRecord => Boolean(x))
    .sort((a, b) => String(a.createdAt || '') < String(b.createdAt || '') ? 1 : -1)

  return NextResponse.json({ results }, { headers: { 'x-request-id': requestId } })
}
