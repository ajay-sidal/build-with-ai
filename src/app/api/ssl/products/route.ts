import { NextResponse } from 'next/server'
import { opClient } from '../../../../lib/openprovider'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const products = await opClient.listSslProducts()
    return NextResponse.json({ results: products })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load SSL products'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
