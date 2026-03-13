/**
 * Notifications API - Polling endpoint (fallback for SSE)
 * Returns recent notifications for clients that don't support SSE
 */

import { NextResponse } from 'next/server'

// In-memory store for notifications (use Redis/DB in production)
const notifications: Array<{
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: number
}> = []

export async function GET() {
  // Return last 50 notifications
  const recentNotifications = notifications.slice(-50)

  return NextResponse.json(recentNotifications)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, title, message } = body

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title, message' },
        { status: 400 }
      )
    }

    const notification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      timestamp: Date.now(),
    }

    notifications.push(notification)

    // Keep only last 100 notifications in memory
    if (notifications.length > 100) {
      notifications.shift()
    }

    return NextResponse.json({ success: true, notification })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
