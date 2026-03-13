import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    // Check if NEXTAUTH_SECRET is configured
    if (!process.env.NEXTAUTH_SECRET) {
      logger.warn('NEXTAUTH_SECRET not configured - returning anonymous session')
      return NextResponse.json({
        user: null,
        expires: null,
        warning: 'Authentication not configured. Please set NEXTAUTH_SECRET environment variable.',
      })
    }

    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ user: null, expires: null })
    }

    return NextResponse.json(session)
  } catch (error) {
    logger.error('Session API error', { error })
    
    // Return a graceful error response instead of 500
    return NextResponse.json(
      {
        user: null,
        expires: null,
        error: 'Session unavailable',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 } // Return 200 to prevent client errors
    )
  }
}
