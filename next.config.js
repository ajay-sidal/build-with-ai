/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const allowVercelLive = process.env.VERCEL === '1'
    const allowUnsafeEval = allowVercelLive && process.env.VERCEL_ENV !== 'production'

    // CSP with media support for voice chat and MARZ AI
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      ...(allowUnsafeEval ? ["'unsafe-eval'"] : []),
      'https://js.stripe.com',
      'https://*.stripe.com',
      'https://api.groq.com', // MARZ AI backend
      ...(allowVercelLive ? ['https://vercel.live'] : []),
    ].join(' ')

    const connectSrc = [
      "'self'",
      'https:',
      'https://api.groq.com', // MARZ AI
      'https://*.upstash.io', // Vector DB (if configured)
      ...(allowVercelLive ? ['https://vercel.live'] : []),
    ].join(' ')

    const frameSrc = [
      'https://checkout.stripe.com',
      'https://*.stripe.com',
      ...(allowVercelLive ? ['https://vercel.live'] : []),
    ].join(' ')

    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self' https://checkout.stripe.com https://*.stripe.com",
      "frame-ancestors 'none'",
      `frame-src ${frameSrc}`,
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      `connect-src ${connectSrc}`,
      `script-src ${scriptSrc}`,
      `script-src-elem ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline' https:",
      "media-src 'self' blob: mediastream:", // CRITICAL: Allows microphone access for voice chat
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(self)' }, // Allow mic on same origin
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
