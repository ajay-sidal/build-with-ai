import { NextResponse } from 'next/server'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getDataDir } from '../../../../../lib/dataDir'
import { randomUUID } from 'node:crypto'
import { dbAudit } from '../../../../../lib/opsStore'

export const runtime = 'nodejs'

type RequestBody = {
  requestId: string
}

type PayoutRequestRecord = {
  requestId?: string
  createdAt?: string
  partnerId?: string
  status?: 'PENDING' | 'COMPLETED' | 'REJECTED'
  amount?: number
  method?: string
  completedAt?: string
}

export async function PATCH(req: Request) {
  const traceId = randomUUID()
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) {
    return NextResponse.json(
      { error: 'Missing ADMIN_SECRET on server' },
      { status: 500, headers: { 'x-request-id': traceId } },
    )
  }

  const headerSecret = req.headers.get('x-admin-secret') || req.headers.get('authorization')
  if (!headerSecret || headerSecret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'x-request-id': traceId } })
  }

  const body = (await req.json().catch(() => null)) as RequestBody | null
  const requestId = body?.requestId?.trim() || ''
  if (!requestId) {
    return NextResponse.json({ error: 'Missing requestId' }, { status: 400, headers: { 'x-request-id': traceId } })
  }

  try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown'
    await dbAudit({
      actorType: 'admin',
      actorId: 'admin',
      action: 'admin_payout_mark_paid',
      resource: 'payout_request',
      resourceId: requestId,
      metadata: { ip },
    })
  } catch {
    // ignore
  }

  const dataDir = getDataDir()
  await mkdir(dataDir, { recursive: true })
  const payoutPath = join(dataDir, 'payout_requests.jsonl')

  const text = await readFile(payoutPath, { encoding: 'utf8' }).catch((err: any) => {
    if (err?.code === 'ENOENT') return ''
    throw err
  })

  const lines = text.split(/\r?\n/).filter(Boolean)
  let updated = false

  const nextLines: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    let rec: PayoutRequestRecord | null = null
    try {
      rec = JSON.parse(line) as PayoutRequestRecord
    } catch {
      nextLines.push(line)
      continue
    }

    const partnerId = String(rec.partnerId || '')
    const fallbackId = `${rec.createdAt || ''}:${partnerId}:${i}`
    const id = String(rec.requestId || fallbackId)

    if (id !== requestId) {
      nextLines.push(line)
      continue
    }

    if ((rec.status || 'PENDING') !== 'PENDING') {
      nextLines.push(line)
      continue
    }

    const patched: PayoutRequestRecord = {
      ...rec,
      requestId: rec.requestId || requestId,
      status: 'COMPLETED',
      completedAt: new Date().toISOString(),
    }

    nextLines.push(JSON.stringify(patched))
    updated = true
  }

  if (!updated) {
    return NextResponse.json(
      { error: 'Payout request not found or not pending' },
      { status: 404, headers: { 'x-request-id': traceId } },
    )
  }

  await writeFile(payoutPath, nextLines.join('\n') + '\n', { encoding: 'utf8' })

  return NextResponse.json({ ok: true }, { headers: { 'x-request-id': traceId } })
}
