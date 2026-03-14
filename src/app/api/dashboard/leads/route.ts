import { NextResponse } from 'next/server'

import { getDashboardLeadsData } from '../../../../lib/dashboardLeads'
import { getViewerContext } from '../../../../lib/viewerContext'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const viewer = await getViewerContext()
    if (!viewer.isMasterAdmin && !viewer.userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const data = await getDashboardLeadsData({
      userId: viewer.userId,
      includeAll: viewer.isMasterAdmin,
    })
    return NextResponse.json({
      ...data,
      scope: viewer.isMasterAdmin ? 'global' : 'user',
      viewer: {
        userId: viewer.userId,
        isMasterAdmin: viewer.isMasterAdmin,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load dashboard leads'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}