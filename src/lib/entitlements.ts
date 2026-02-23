import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth'
import { normalizeUserTier, type UserTier } from '../utils/membership'

export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  const id = (session?.user as any)?.id
  return typeof id === 'string' && id.trim() ? id.trim() : null
}

export async function getCurrentUserTier(): Promise<UserTier> {
  const userId = await getSessionUserId()
  if (!userId) return 'AI_EXPLORER'

  // Subscription model not available - default to free tier
  return 'AI_EXPLORER'
}
