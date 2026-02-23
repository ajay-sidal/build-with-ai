import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

function optionalProvider<T>(provider: T, enabled: boolean): T | null {
  return enabled ? provider : null
}

// Check if database is available
const hasDatabase = !!(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '')
const hasNextAuthSecret = !!(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.trim() !== '')

export const authOptions: NextAuthOptions = {
  adapter: hasDatabase ? PrismaAdapter(prisma) : undefined,
  session: {
    strategy: hasDatabase ? 'database' : 'jwt',
  },
  providers: [
    // OAuth Providers for regular user signup/signin
    optionalProvider(
      GitHubProvider({
        clientId: (process.env.GITHUB_ID || '').trim(),
        clientSecret: (process.env.GITHUB_SECRET || '').trim(),
      }),
      Boolean((process.env.GITHUB_ID || '').trim() && (process.env.GITHUB_SECRET || '').trim()),
    ),
    optionalProvider(
      GoogleProvider({
        clientId: (process.env.GOOGLE_CLIENT_ID || '').trim(),
        clientSecret: (process.env.GOOGLE_CLIENT_SECRET || '').trim(),
      }),
      Boolean((process.env.GOOGLE_CLIENT_ID || '').trim() && (process.env.GOOGLE_CLIENT_SECRET || '').trim()),
    ),
  ].filter(Boolean) as NextAuthOptions['providers'],
  // NEXTAUTH_SECRET is required for JWT sessions
  secret: (process.env.NEXTAUTH_SECRET || '').trim() || undefined,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        // Use token for JWT sessions, user for database sessions
        ;(session.user as any).id = (user?.id || token?.sub || 'anonymous') as string
      }
      return session
    },
  },
  // Disable NextAuth if critical env vars are missing (prevents 500 errors)
  ...(!hasNextAuthSecret ? {
    // In development, generate a warning but continue
    logger: {
      error: (code, ...message) => console.error('[NextAuth]', code, message),
      warn: (code) => console.warn('[NextAuth]', code),
      debug: (code, ...message) => console.log('[NextAuth]', code, message),
    },
  } : {}),
}
