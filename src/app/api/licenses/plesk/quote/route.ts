import { NextResponse } from 'next/server'
import { calculateCustomerPrice } from '../../../../../utils/pricing'

export const runtime = 'nodejs'

type Quote = {
  item: string
  currency: string
  resellerAmount: number
  customerAmount: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

export async function GET() {
  try {
    const item = (process.env.PLESK_DEFAULT_ITEM || 'PLESK-12-VPS-WEB-HOST-1M').trim()
    const currency = (process.env.PLESK_DEFAULT_CURRENCY || 'USD').trim().toUpperCase()
    const resellerAmount = Number((process.env.PLESK_DEFAULT_RESELLER_PRICE || '').trim())

    if (!Number.isFinite(resellerAmount) || resellerAmount <= 0) {
      return NextResponse.json({ error: 'Missing/invalid PLESK_DEFAULT_RESELLER_PRICE' }, { status: 500 })
    }

    const customerAmount = calculateCustomerPrice(resellerAmount, 'LICENSE')

    const quote: Quote = {
      item,
      currency,
      resellerAmount: round2(resellerAmount),
      customerAmount: round2(customerAmount),
    }

    return NextResponse.json({ quote })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to compute quote'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
