import { NextResponse } from 'next/server'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

export const runtime = 'nodejs'

type LeadStatus = 'New' | 'Contacted' | 'Closed'

type RequestBody = {
  email: string
  status: LeadStatus
}

export async function PATCH(req: Request) {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return NextResponse.json({ error: 'Missing ADMIN_SECRET on server' }, { status: 500 })

  const headerSecret = req.headers.get('x-admin-secret') || req.headers.get('authorization')
  if (!headerSecret || headerSecret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await req.json().catch(() => null)) as RequestBody | null
  const email = body?.email?.trim().toLowerCase() || ''
  const status = body?.status

  if (!email || (status !== 'New' && status !== 'Contacted' && status !== 'Closed')) {
    return NextResponse.json({ error: 'Missing email or invalid status' }, { status: 400 })
  }

  try {
    const dataDir = join(process.cwd(), 'data')
    await mkdir(dataDir, { recursive: true })

    const statusFile = join(dataDir, 'lead-statuses.json')
    const statusText = await readFile(statusFile, { encoding: 'utf8' }).catch((err: any) => {
      if (err?.code === 'ENOENT') return '{}'
      throw err
    })

    const map = (() => {
      try {
        return JSON.parse(statusText) as Record<string, LeadStatus>
      } catch {
        return {} as Record<string, LeadStatus>
      }
    })()

    map[email] = status
    await writeFile(statusFile, JSON.stringify(map, null, 2), { encoding: 'utf8' })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to persist status'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
