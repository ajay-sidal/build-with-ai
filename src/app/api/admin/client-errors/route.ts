import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'

type ClientErrorRecord = {
  createdAt?: string
  message?: string
  stack?: string
  url?: string
  userAgent?: string
}

export async function GET(req: Request) {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return NextResponse.json({ error: 'Missing ADMIN_SECRET on server' }, { status: 500 })

  const headerSecret = req.headers.get('x-admin-secret') || req.headers.get('authorization')
  if (!headerSecret || headerSecret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const file = join(process.cwd(), 'data', 'client_errors.jsonl')
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

  return NextResponse.json({ results })
}
