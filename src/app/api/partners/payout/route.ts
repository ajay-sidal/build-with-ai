import { NextResponse } from 'next/server'
import { mkdir, readFile, appendFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { getDataDir } from '../../../../lib/dataDir'

export const runtime = 'nodejs'

type RequestBody = {
  partnerId: string
  method?: string
}

type SaleRecord = {
  createdAt?: string
  partnerId?: string
  meta?: {
    commissionAmount?: number
  }
}

type PayoutRequestRecord = {
  requestId: string
  createdAt: string
  partnerId: string
  status: 'PENDING' | 'COMPLETED' | 'REJECTED'
  amount: number
  method: string
  completedAt?: string
}

const HOLD_DAYS = 14
const PAYOUT_THRESHOLD = 50

function parseIsoDate(value: unknown): number | null {
  if (!value) return null
  const ms = Date.parse(String(value))
  return Number.isFinite(ms) ? ms : null
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as RequestBody | null
  const partnerId = body?.partnerId?.trim() || ''
  const method = (body?.method || 'STRIPE_CONNECT').trim() || 'STRIPE_CONNECT'

  if (!partnerId) return NextResponse.json({ error: 'Missing partnerId' }, { status: 400 })

  const dataDir = getDataDir()
  await mkdir(dataDir, { recursive: true })

  const salesPath = join(dataDir, 'affiliate_sales.jsonl')
  const payoutPath = join(dataDir, 'payout_requests.jsonl')

  const [salesText, payoutText] = await Promise.all([
    readFile(salesPath, { encoding: 'utf8' }).catch((err: any) => {
      if (err?.code === 'ENOENT') return ''
      throw err
    }),
    readFile(payoutPath, { encoding: 'utf8' }).catch((err: any) => {
      if (err?.code === 'ENOENT') return ''
      throw err
    }),
  ])

  const now = Date.now()
  const holdMs = HOLD_DAYS * 24 * 60 * 60 * 1000

  let commissionEligible = 0
  for (const line of salesText.split(/\r?\n/).filter(Boolean)) {
    let rec: SaleRecord | null = null
    try {
      rec = JSON.parse(line) as SaleRecord
    } catch {
      continue
    }
    if (!rec || rec.partnerId !== partnerId) continue

    const createdMs = parseIsoDate(rec.createdAt)
    if (createdMs == null || now - createdMs < holdMs) continue

    commissionEligible += Number(rec.meta?.commissionAmount || 0)
  }
  commissionEligible = round2(commissionEligible)

  let pendingTotal = 0
  let completedTotal = 0
  let hasPending = false

  for (const line of payoutText.split(/\r?\n/).filter(Boolean)) {
    let rec: PayoutRequestRecord | null = null
    try {
      rec = JSON.parse(line) as PayoutRequestRecord
    } catch {
      continue
    }
    if (!rec || rec.partnerId !== partnerId) continue

    if (rec.status === 'PENDING') {
      hasPending = true
      pendingTotal += Number(rec.amount || 0)
    } else if (rec.status === 'COMPLETED') {
      completedTotal += Number(rec.amount || 0)
    }
  }

  pendingTotal = round2(pendingTotal)
  completedTotal = round2(completedTotal)

  if (hasPending) {
    return NextResponse.json({ error: 'A payout request is already pending' }, { status: 409 })
  }

  const availableNow = round2(Math.max(0, commissionEligible - pendingTotal - completedTotal))
  if (availableNow < PAYOUT_THRESHOLD) {
    return NextResponse.json(
      {
        error: `Payout threshold not met. Available: ${availableNow}`,
        availableNow,
        threshold: PAYOUT_THRESHOLD,
      },
      { status: 400 },
    )
  }

  const record: PayoutRequestRecord = {
    requestId: randomUUID(),
    createdAt: new Date().toISOString(),
    partnerId,
    status: 'PENDING',
    amount: availableNow,
    method,
  }

  await appendFile(payoutPath, JSON.stringify(record) + '\n', { encoding: 'utf8' })

  return NextResponse.json({ ok: true, request: record })
}
