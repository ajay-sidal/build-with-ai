import { NextResponse } from 'next/server'

import { getDashboardLeadsData } from '@/lib/dashboardLeads'
import { getMarzDashboardData } from '@/lib/marzStore'
import { getOpenProviderHealth } from '@/lib/openproviderHealth'
import { requireMasterAdmin } from '@/lib/viewerContext'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const viewer = await requireMasterAdmin()
    const [leads, marz, reseller] = await Promise.all([
      getDashboardLeadsData({ includeAll: true }),
      getMarzDashboardData(null),
      getOpenProviderHealth(),
    ])

    return NextResponse.json({
      viewer: {
        userId: viewer.userId,
        email: viewer.email,
        isMasterAdmin: true,
      },
      leads,
      marz,
      reseller,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load founder dashboard'
    const status = message === 'Unauthorized' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}