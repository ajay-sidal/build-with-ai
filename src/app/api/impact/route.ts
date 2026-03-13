import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { getImpactStats } from '../../../lib/impactStore'

export const runtime = 'nodejs'

export async function GET() {
  const requestId = randomUUID()
  try {
    const stats = await getImpactStats()
    return NextResponse.json(stats, { headers: { 'x-request-id': requestId } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load impact stats'
    return NextResponse.json({ error: message }, { status: 500, headers: { 'x-request-id': requestId } })
  }
}
