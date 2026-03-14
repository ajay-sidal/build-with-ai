import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

import { prisma } from '../../../../lib/prisma'
import { getSessionUserId } from '../../../../lib/entitlements'
import { getUser } from '../../../../lib/userStore'
import { tierLabel, USER_ID_COOKIE } from '../../../../utils/membership'

export const runtime = 'nodejs'

type SnapshotService = {
  name: string
  status: 'Active' | 'Inactive'
}

function inferSecurityServices(itemNames: string[]): SnapshotService[] {
  const labels = itemNames.map((item) => item.toLowerCase())
  const hasSsl = labels.some((item) => item.includes('ssl') || item.includes('plesk'))
  const hasDns = labels.some((item) => item.includes('dns') || item.includes('domain'))

  return [
    { name: 'SSL Sanctuary', status: hasSsl ? 'Active' : 'Inactive' },
    { name: 'Premium DNS', status: hasDns ? 'Active' : 'Inactive' },
  ]
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const cookieUserId = cookieStore.get(USER_ID_COOKIE)?.value || null
    const sessionUserId = await getSessionUserId()
    const candidateUserId = sessionUserId || cookieUserId

    const profile = candidateUserId ? await getUser(candidateUserId) : null
    const membershipTier = profile ? tierLabel(profile.subscription_tier) : 'No linked profile'

    let services: SnapshotService[] = [
      { name: 'SSL Sanctuary', status: 'Inactive' },
      { name: 'Premium DNS', status: 'Inactive' },
    ]

    if (profile?.email) {
      const appUser = await prisma.user.findUnique({
        where: { email: profile.email },
        include: {
          orders: {
            include: { items: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      if (appUser) {
        const itemNames = appUser.orders.flatMap((order) => order.items.map((item) => item.name))
        services = inferSecurityServices(itemNames)
      }
    }

    return NextResponse.json({
      membershipTier,
      securityServices: services,
      profile: profile
        ? {
            userId: profile.user_id,
            email: profile.email,
            renewalDate: profile.renewal_date,
          }
        : null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load dashboard snapshot'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}