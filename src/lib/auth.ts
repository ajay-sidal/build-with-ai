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

// Generate a fallback secret for development only (never use in production)
const getFallbackSecret = () => {
  if (process.env.NODE_ENV === 'production') {
    return undefined
  }
  // Development-only fallback secret
  return 'dev-fallback-secret-do-not-use-in-production-' + process.platform
}

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
  secret: (process.env.NEXTAUTH_SECRET || '').trim() || getFallbackSecret(),
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
  // Always enable error logging to help debug issues
  logger: {
    error: (code, ...message) => console.error('[NextAuth]', code, message),
    warn: (code) => console.warn('[NextAuth]', code),
    debug: (code, ...message) => console.log('[NextAuth]', code, message),
  },
}
