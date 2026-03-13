import { NextResponse } from 'next/server'
import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { getDataDir } from '../../../../lib/dataDir'

export const runtime = 'nodejs'

type RequestBody = {
  message?: string
  stack?: string
  url?: string
  userAgent?: string
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RequestBody | null

  const record = {
    createdAt: new Date().toISOString(),
    message: String(body?.message || ''),
    stack: body?.stack ? String(body.stack) : undefined,
    url: body?.url ? String(body.url) : undefined,
    userAgent: body?.userAgent ? String(body.userAgent) : req.headers.get('user-agent') || undefined,
  }

  try {
    const dataDir = getDataDir()
    await mkdir(dataDir, { recursive: true })
    const path = join(dataDir, 'client_errors.jsonl')
    await appendFile(path, JSON.stringify(record) + '\n', { encoding: 'utf8' })
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to log error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
