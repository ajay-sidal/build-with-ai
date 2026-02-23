import NextAuth from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { logger } from '@/lib/logger'
import { startSpan } from '@/lib/tracing'
import { initSentry, captureException } from '@/lib/sentry'

const handler = NextAuth(authOptions)

async function instrumentedHandler(req: Request) {
	initSentry()
	const span = startSpan('auth.nextauth')
	try {
		logger.info('NextAuth handler invoked', { method: req?.method })
		// delegate to NextAuth's handler
		// `handler` is the Next.js-compatible route handler returned by NextAuth
		const res = await (handler as unknown as (req: Request) => Promise<Response>)(req)
		span.end({ status: 'ok' })
		return res
	} catch (err) {
		span.end({ status: 'error' })
		try {
			captureException(err, { route: '/api/auth/[...nextauth]' })
		} catch (e) {
			// swallow to avoid masking original error
			// eslint-disable-next-line no-console
			console.warn('Sentry capture failed', e)
		}
		logger.error('NextAuth handler error', { error: String(err) })
		throw err
	}
}

export { instrumentedHandler as GET, instrumentedHandler as POST }
