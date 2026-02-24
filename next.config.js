/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Mark optional dependencies as external
  turbopack: {
    resolveAlias: {
      bullmq: 'bullmq',
      ioredis: 'ioredis',
    },
  },
  webpack: (config, { isServer }) => {
    config.externals = config.externals || [];
    config.externals.push('bullmq', 'ioredis');
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "form-action 'self' https://checkout.stripe.com https://*.stripe.com",
              "frame-ancestors 'none'",
              "frame-src https://checkout.stripe.com https://*.stripe.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https: fonts.gstatic.com",
              "connect-src 'self' https: wss: ws:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.com https://*.vercel.app https://js.stripe.com https://*.stripe.com https://api.groq.com",
              "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.com https://*.vercel.app https://js.stripe.com https://*.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "media-src 'self' blob: mediastream:",
              "object-src 'none'",
            ].join('; '),
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=(self)' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
