import { NextResponse } from 'next/server'

import { createMarzIdentity, getMarzDashboardData } from '../../../../lib/marzStore'
import { getViewerContext } from '../../../../lib/viewerContext'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const viewer = await getViewerContext()
    if (!viewer.isMasterAdmin && !viewer.userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const ownerHandle = viewer.isMasterAdmin ? null : viewer.userId
    const data = await getMarzDashboardData(ownerHandle)
    return NextResponse.json({
      ...data,
      scope: viewer.isMasterAdmin ? 'global' : 'user',
      viewer: {
        userId: viewer.userId,
        isMasterAdmin: viewer.isMasterAdmin,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load MARZ dashboard'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as { identity?: string } | null
    const identity = (body?.identity || '').trim().toLowerCase()
    if (!identity || !/^[a-z0-9-]{2,32}$/.test(identity)) {
      return NextResponse.json({ error: 'Invalid identity name' }, { status: 400 })
    }

    const viewer = await getViewerContext()
    if (!viewer.userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const ownerHandle = viewer.userId
    const gasSponsoredUsd = Number((process.env.MARZ_GAS_SPONSORED_USD || '0').trim()) || 0
    const minted = await createMarzIdentity({ identity, ownerHandle, gasSponsoredUsd })
    const data = await getMarzDashboardData(viewer.isMasterAdmin ? null : ownerHandle)

    return NextResponse.json({
      minted,
      ...data,
      scope: viewer.isMasterAdmin ? 'global' : 'user',
      viewer: {
        userId: viewer.userId,
        isMasterAdmin: viewer.isMasterAdmin,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to mint identity'
    const status = message === 'Identity already minted' ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
}