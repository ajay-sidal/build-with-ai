import * as SentryNode from '@sentry/node'

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
const enabled = Boolean(dsn) && process.env.NODE_ENV !== 'test'

export function initSentry() {
  if (!enabled) return
  try {
    SentryNode.init({
      dsn,
      tracesSampleRate: 0.05, // conservative default
      environment: process.env.NODE_ENV || 'development',
    })
  } catch (err) {
    // swallow init errors in case Sentry library is unavailable in some envs
    // eslint-disable-next-line no-console
    console.warn('Sentry init failed:', err)
  }
}

export function captureException(e: unknown, ctx?: Record<string, unknown>) {
  if (!enabled) {
    // eslint-disable-next-line no-console
    console.error('Captured exception (Sentry disabled):', e, ctx)
    return
  }
  try {
    SentryNode.withScope((scope) => {
      if (ctx) Object.entries(ctx).forEach(([k, v]) => scope.setExtra(k, v))
      SentryNode.captureException(e as Error)
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Sentry capture failed:', err)
  }
}

export default { initSentry, captureException }
