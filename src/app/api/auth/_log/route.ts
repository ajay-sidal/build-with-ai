import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    
    logger.error('Client-side error logged', {
      message: body.message,
      stack: body.stack,
      url: body.url,
      userAgent: body.userAgent,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // Silently fail - don't let error logging cause more errors
    return NextResponse.json({ success: false }, { status: 200 })
  }
}
