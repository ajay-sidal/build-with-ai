import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Enforce HTTPS in production
  // Enforce HTTPS only when explicitly enabled in the environment. This
  // prevents local test runs (and CI) from being redirected unexpectedly.
  // Set `ENFORCE_HTTPS=1` in production environments that require it.
  if (
    process.env.ENFORCE_HTTPS === '1' &&
    process.env.NODE_ENV === 'production' &&
    request.nextUrl.protocol === 'http:'
  ) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    return NextResponse.redirect(url);
  }

  // Add security headers (CSP is handled in next.config.js headers)
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  return response;
}
