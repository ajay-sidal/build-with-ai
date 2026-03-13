import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  // Deprecated: tiers are server-authoritative and must be sourced from Stripe subscription state.
  // This endpoint is intentionally disabled to prevent client-settable entitlements.
  return NextResponse.json(
    { error: 'Tier management is no longer available via this endpoint.' },
    { status: 410 },
  )
}
