/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const allowVercelLive = process.env.VERCEL === '1'

    // CSP is intentionally permissive to avoid breaking Next.js hydration and Stripe.
    // On Vercel deployments, allow Vercel Live Feedback / Toolbar script.
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      ...(allowVercelLive ? ["'unsafe-eval'"] : []),
      'https://js.stripe.com',
      'https://*.stripe.com',
      ...(allowVercelLive ? ['https://vercel.live'] : []),
    ].join(' ')

    const connectSrc = [
      "'self'",
      'https:',
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
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
