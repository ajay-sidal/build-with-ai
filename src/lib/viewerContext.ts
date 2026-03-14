import { cookies } from 'next/headers'
import { getServerSession } from 'next-auth'

import { authOptions } from './auth'
import { prisma } from './prisma'
import { getUser } from './userStore'
import { USER_ID_COOKIE } from '../utils/membership'

const MASTER_ADMIN_EMAILS = new Set(
  [
    'asidal@outlook.com',
    ...((process.env.MASTER_ADMIN_EMAILS || '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)),
  ],
)

const MASTER_ADMIN_USER_IDS = new Set(
  ((process.env.MASTER_ADMIN_USER_IDS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)),
)

export type ViewerContext = {
  userId: string | null
  email: string | null
  name: string | null
  role: string | null
  isAuthenticated: boolean
  isMasterAdmin: boolean
}

function matchesFounderName(name: string | null | undefined) {
  const normalized = (name || '').trim().toLowerCase()
  if (!normalized) return false
  return normalized.includes('ajay') || normalized.includes('silas')
}

export async function getViewerContext(): Promise<ViewerContext> {
  const [cookieStore, session] = await Promise.all([
    cookies(),
    getServerSession(authOptions).catch(() => null),
  ])

  const cookieUserId = cookieStore.get(USER_ID_COOKIE)?.value || null
  const sessionUser = session?.user as { id?: string | null; email?: string | null; name?: string | null; role?: string | null } | undefined

  const sessionUserId = sessionUser?.id?.trim() || null
  const userId = sessionUserId || cookieUserId || null

  const dbProfile = userId ? await getUser(userId).catch(() => null) : null
  const email = (sessionUser?.email || dbProfile?.email || null)?.trim().toLowerCase() || null
  const name = sessionUser?.name?.trim() || null

  let role = sessionUser?.role?.trim() || null
  if (!role && email) {
    const prismaUser = await prisma.user.findUnique({
      where: { email },
      select: { role: true, name: true, email: true },
    }).catch(() => null)

    if (prismaUser) {
      role = prismaUser.role || null
      if (!name && prismaUser.name) {
        return buildViewerContext({ userId, email, name: prismaUser.name, role })
      }
    }
  }

  return buildViewerContext({ userId, email, name, role })
}

function buildViewerContext(args: { userId: string | null; email: string | null; name: string | null; role: string | null }): ViewerContext {
  const normalizedRole = args.role?.trim().toLowerCase() || null
  const isMasterAdmin = Boolean(
    normalizedRole === 'admin'
      || (args.email && MASTER_ADMIN_EMAILS.has(args.email))
      || (args.userId && MASTER_ADMIN_USER_IDS.has(args.userId))
      || matchesFounderName(args.name),
  )

  return {
    userId: args.userId,
    email: args.email,
    name: args.name,
    role: normalizedRole,
    isAuthenticated: Boolean(args.userId || args.email),
    isMasterAdmin,
  }
}

export async function requireMasterAdmin() {
  const viewer = await getViewerContext()
  if (!viewer.isMasterAdmin) {
    throw new Error('Unauthorized')
  }
  return viewer
}