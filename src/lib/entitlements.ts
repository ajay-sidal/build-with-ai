import { getServerSession } from 'next-auth/next'
import { cookies } from 'next/headers'
import { authOptions } from './auth'
import { normalizeUserTier, type UserTier } from '../utils/membership'
import { getUser } from './userStore'
import { USER_ID_COOKIE } from '../utils/membership'

export async function getSessionUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  const id = (session?.user as any)?.id
  return typeof id === 'string' && id.trim() ? id.trim() : null
}

export async function getCurrentUserTier(): Promise<UserTier> {
  const userId = await getSessionUserId()
  const cookieStore = await cookies()
  const cookieUserId = cookieStore.get(USER_ID_COOKIE)?.value || null
  const resolvedUserId = userId || cookieUserId
  if (!resolvedUserId) return 'AI_EXPLORER'

  const user = await getUser(resolvedUserId)
  return normalizeUserTier(user?.subscription_tier)
}
