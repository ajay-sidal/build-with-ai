import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getDataDir } from '../../../../lib/dataDir'
import { randomUUID } from 'node:crypto'
import { dbAudit } from '../../../../lib/opsStore'

export const runtime = 'nodejs'

type PayoutRequestRecord = {
  requestId?: string
  createdAt?: string
  partnerId?: string
  status?: 'PENDING' | 'COMPLETED' | 'REJECTED'
  amount?: number
  method?: string
  completedAt?: string
}

function round2(n: number) {
  return Math.round(n * 100) / 100
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
      action: 'admin_payouts_list',
      resource: 'payout_request',
      resourceId: 'list',
      metadata: { ip },
    })
  } catch {
    // ignore
  }

  const dataDir = getDataDir()
  const payoutPath = join(dataDir, 'payout_requests.jsonl')
  const text = await readFile(payoutPath, { encoding: 'utf8' }).catch((err: any) => {
    if (err?.code === 'ENOENT') return ''
    throw err
  })

  const results: Array<{
    requestId: string
    createdAt: string
    partnerId: string
    status: 'PENDING' | 'COMPLETED' | 'REJECTED'
    amount: number
    method: string
    completedAt: string | null
  }> = []

  const lines = text.split(/\r?\n/).filter(Boolean)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    let rec: PayoutRequestRecord | null = null
    try {
      rec = JSON.parse(line) as PayoutRequestRecord
    } catch {
      continue
    }

    const status = (rec.status || 'PENDING') as 'PENDING' | 'COMPLETED' | 'REJECTED'
    if (status !== 'PENDING') continue

    const partnerId = String(rec.partnerId || '')
    if (!partnerId) continue

    results.push({
      requestId: String(rec.requestId || `${rec.createdAt || ''}:${partnerId}:${i}`),
      createdAt: String(rec.createdAt || ''),
      partnerId,
      status,
      amount: round2(Number(rec.amount || 0)),
      method: String(rec.method || 'STRIPE_CONNECT'),
      completedAt: rec.completedAt ? String(rec.completedAt) : null,
    })
  }

  results.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  return NextResponse.json({ results }, { headers: { 'x-request-id': requestId } })
}
