import { join } from 'node:path'

/**
 * Returns a writable directory for runtime logs/state.
 *
 * - Local/dev: defaults to <repo>/data
 * - Vercel/AWS Lambda: defaults to /tmp/build-with-ai/data (writable)
 * - Override: set DATA_DIR
 */
export function getDataDir() {
  const override = (process.env.DATA_DIR || '').trim()
  if (override) return override

  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
  if (isServerless) return join('/tmp', 'build-with-ai', 'data')

  return join(process.cwd(), 'data')
}
