/**
 * Notifications API - Server-Sent Events (SSE) endpoint
 * Streams real-time notifications to connected clients
 */

import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

// Store for active connections (in production, use Redis Pub/Sub)
const clients = new Set<ReadableStreamDefaultController>()

// Function to broadcast notifications to all connected clients
export function broadcastNotification(data: {
  type: string
  title: string
  message: string
}) {
  const notification = {
    id: crypto.randomUUID(),
    ...data,
    timestamp: Date.now(),
  }

  const message = `data: ${JSON.stringify(notification)}\n\n`

  clients.forEach((client) => {
    try {
      client.enqueue(new TextEncoder().encode(message))
    } catch (e) {
      // Client disconnected, remove from set
      clients.delete(client)
    }
  })
}

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  // Create a new ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Add client to the set
      clients.add(controller)

      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`)
      )

      // Keep connection alive with periodic pings
      const pingInterval = setInterval(() => {
        controller.enqueue(encoder.encode(': ping\n\n'))
      }, 30000)

      // Clean up on close
      request.signal.addEventListener('abort', () => {
        clearInterval(pingInterval)
        clients.delete(controller)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  })
}
