/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const isDev = process.env.NODE_ENV === 'development'
    
    // In development, use a permissive CSP to allow Next.js HMR and dev tools
    if (isDev) {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval'",
                "style-src 'self' 'unsafe-inline'",
                "connect-src 'self' https: ws: wss: http://localhost:*",
                "img-src 'self' data: blob: https:",
                "font-src 'self' data: https:",
                "media-src 'self' blob: mediastream:",
                "frame-src 'self' https:",
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'",
              ].join('; '),
            },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-DNS-Prefetch-Control', value: 'off' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(self)' },
          ],
        },
      ]
    }

    // Production CSP - strict security
    const allowVercelLive = process.env.VERCEL === '1'
    const allowUnsafeEval = allowVercelLive && process.env.VERCEL_ENV !== 'production'

    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      ...(allowUnsafeEval ? ["'unsafe-eval'"] : []),
      'https://js.stripe.com',
      'https://*.stripe.com',
      'https://api.groq.com',
      ...(allowVercelLive ? ['https://vercel.live'] : []),
    ].join(' ')

    const connectSrc = [
      "'self'",
      'https:',
      'https://api.groq.com',
      'https://*.upstash.io',
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
      "media-src 'self' blob: mediastream:",
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
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(self)' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
