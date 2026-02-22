import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'
import { prisma } from './prisma'
import { normalizeUserTier, type UserTier } from '../utils/membership'

export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  const id = (session?.user as any)?.id
  return typeof id === 'string' && id.trim() ? id.trim() : null
}

export async function getCurrentUserTier(): Promise<UserTier> {
  const userId = await getSessionUserId()
  if (!userId) return 'AI_EXPLORER'

  try {
    const sub = await prisma.subscription.findUnique({ where: { userId } })
    return normalizeUserTier(sub?.tier)
  } catch {
    // If DB is unavailable, default to the safest tier (highest markup).
    return 'AI_EXPLORER'
  }
}
