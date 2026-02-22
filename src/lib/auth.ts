import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

function optionalProvider<T>(provider: T, enabled: boolean): T | null {
  return enabled ? provider : null
}

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
  },
  providers: [
    // Admin secret login (internal only)
    CredentialsProvider({
      id: 'admin-secret',
      name: 'Admin Secret',
      credentials: {
        adminSecret: { label: 'Admin Secret', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.adminSecret) {
          throw new Error('Admin secret required')
        }
        if (credentials.adminSecret === ADMIN_SECRET && ADMIN_SECRET) {
          return {
            id: 'admin',
            email: 'admin@buildwithai.digital',
            name: 'Admin User',
            role: 'admin',
          }
        }
        throw new Error('Invalid admin secret')
      },
    }),
    // OAuth Providers
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
    async signIn({ user, account }) {
      // Allow admin secret sign in
      if (account?.provider === 'admin-secret') {
        return true
      }
      // Allow OAuth sign ins
      if (account?.provider === 'google' || account?.provider === 'github') {
        return true
      }
      return false
    },
  },
}
