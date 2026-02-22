import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

function optionalProvider<T>(provider: T, enabled: boolean): T | null {
  return enabled ? provider : null
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
  },
  providers: [
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
  secret: (process.env.NEXTAUTH_SECRET || '').trim() || undefined,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        ;(session.user as any).id = user.id
      }
      return session
    },
  },
}
