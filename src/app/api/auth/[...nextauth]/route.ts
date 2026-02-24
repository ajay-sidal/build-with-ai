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
		// Return a JSON error response so clients (and NextAuth devtools) can
		// parse the error payload instead of receiving an empty response body.
		try {
			return new Response(JSON.stringify({ error: 'NextAuth handler error' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			})
		} catch (e) {
			// As a last resort, re-throw the original error
			throw err
		}
	}
}

export { instrumentedHandler as GET, instrumentedHandler as POST }
