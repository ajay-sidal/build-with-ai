import { NextResponse } from 'next/server'

// 1x1 transparent PNG. We serve it at /favicon.ico to prevent noisy 404s.
const FAVICON_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7+EioAAAAASUVORK5CYII='

export function GET() {
  const bytes = Buffer.from(FAVICON_PNG_BASE64, 'base64')

  return new NextResponse(bytes, {
    headers: {
      'content-type': 'image/png',
      // Cache aggressively; change requires redeploy.
      'cache-control': 'public, max-age=31536000, immutable',
    },
  })
}
