// Monitoring setup with optional Sentry integration.
let Sentry: any = null
try {
  // Require dynamically so this file works even when @sentry/nextjs isn't installed
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Sentry = require('@sentry/nextjs')
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  })
} catch (e) {
  // Sentry not configured/installed; fallback to console
  Sentry = null
}

export function logError(error: Error, context?: any) {
  if (Sentry) {
    Sentry.captureException(error, { extra: context })
  } else {
    console.error('Error:', error, context)
  }
}

// Datadog example (server):
// import { datadogLogs } from '@datadog/browser-logs';
// datadogLogs.init({ clientToken: 'YOUR_TOKEN', site: 'datadoghq.com', ... });
