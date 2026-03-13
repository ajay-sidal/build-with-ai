import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getDataDir } from '../../../../lib/dataDir'

export const runtime = 'nodejs'

type SaleRecord = {
  createdAt?: string
  partnerId?: string
  meta?: {
    commissionAmount?: number
    markupAmount?: number
    currency?: string
  }
  kind?: string
  stripe?: {
    sessionId?: string
    paymentStatus?: string
  }
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

export async function GET(req: Request) {
  const url = new URL(req.url)
  const partnerId = (url.searchParams.get('partnerId') || '').trim()
  if (!partnerId) return NextResponse.json({ error: 'Missing partnerId' }, { status: 400 })

  const dataDir = getDataDir()
  const path = join(dataDir, 'affiliate_sales.jsonl')
  const text = await readFile(path, { encoding: 'utf8' }).catch((err: any) => {
    if (err?.code === 'ENOENT') return ''
    throw err
  })

  const payoutPath = join(dataDir, 'payout_requests.jsonl')
  const payoutText = await readFile(payoutPath, { encoding: 'utf8' }).catch((err: any) => {
    if (err?.code === 'ENOENT') return ''
    throw err
  })

  const lines = text.split(/\r?\n/).filter(Boolean)

  const payoutLines = payoutText.split(/\r?\n/).filter(Boolean)

  let commissionTotal = 0
  let commissionEligible = 0
  let markupTotal = 0
  let salesCount = 0
  let lastSaleAt: string | null = null

  const now = Date.now()
  const holdMs = HOLD_DAYS * 24 * 60 * 60 * 1000

  const recent: Array<{
    createdAt: string
    kind: string
    commissionAmount: number
    markupAmount: number
    currency: string
    sessionId: string
    paymentStatus: string
  }> = []

  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i]!
    let rec: SaleRecord | null = null
    try {
      rec = JSON.parse(line) as SaleRecord
    } catch {
      continue
    }

    if (!rec || rec.partnerId !== partnerId) continue

    salesCount++
    const commission = Number(rec.meta?.commissionAmount || 0)
    const markup = Number(rec.meta?.markupAmount || 0)
    commissionTotal += commission
    markupTotal += markup

    const createdAt = rec.createdAt || ''
    const createdMs = parseIsoDate(createdAt)
    if (createdMs != null && now - createdMs >= holdMs) {
      commissionEligible += commission
    }
    if (!lastSaleAt && createdAt) lastSaleAt = createdAt

    if (recent.length < 10) {
      recent.push({
        createdAt: createdAt || '',
        kind: String(rec.kind || 'unknown'),
        commissionAmount: commission,
        markupAmount: markup,
        currency: String(rec.meta?.currency || ''),
        sessionId: String(rec.stripe?.sessionId || ''),
        paymentStatus: String(rec.stripe?.paymentStatus || ''),
      })
    }
  }

  let pendingPayoutsTotal = 0
  let completedPayoutsTotal = 0
  let hasPending = false

  const payoutHistory: Array<{
    requestId: string
    createdAt: string
    status: 'PENDING' | 'COMPLETED' | 'REJECTED'
    amount: number
    method: string
    completedAt: string | null
  }> = []

  for (let i = payoutLines.length - 1; i >= 0; i--) {
    const line = payoutLines[i]!
    let rec: PayoutRequestRecord | null = null
    try {
      rec = JSON.parse(line) as PayoutRequestRecord
    } catch {
      continue
    }
    if (!rec || rec.partnerId !== partnerId) continue
    const amt = Number(rec.amount || 0)

    const requestId = String(rec.requestId || `${rec.createdAt || ''}:${partnerId}:${i}`)
    const createdAt = String(rec.createdAt || '')
    const status = (rec.status || 'PENDING') as 'PENDING' | 'COMPLETED' | 'REJECTED'
    const method = String(rec.method || 'STRIPE_CONNECT')
    const completedAt = rec.completedAt ? String(rec.completedAt) : null

    payoutHistory.push({
      requestId,
      createdAt,
      status,
      amount: round2(amt),
      method,
      completedAt,
    })

    if (rec.status === 'PENDING') {
      pendingPayoutsTotal += amt
      hasPending = true
    } else if (rec.status === 'COMPLETED') {
      completedPayoutsTotal += amt
    }
  }

  payoutHistory.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  commissionTotal = round2(commissionTotal)
  commissionEligible = round2(commissionEligible)
  markupTotal = round2(markupTotal)
  pendingPayoutsTotal = round2(pendingPayoutsTotal)
  completedPayoutsTotal = round2(completedPayoutsTotal)

  const availableNow = round2(Math.max(0, commissionEligible - pendingPayoutsTotal - completedPayoutsTotal))
  const canRequestPayout = availableNow >= PAYOUT_THRESHOLD && !hasPending

  return NextResponse.json({
    partnerId,
    totals: {
      salesCount,
      commissionTotal,
      commissionEligible,
      pendingPayoutsTotal,
      completedPayoutsTotal,
      availableNow,
      canRequestPayout,
      markupTotal,
      lastSaleAt,
    },
    recent,
    payouts: payoutHistory.slice(0, 50),
  })
}
