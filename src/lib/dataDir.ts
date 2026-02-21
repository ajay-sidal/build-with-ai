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

  const cwd = process.cwd()
  const lambdaTaskRoot = (process.env.LAMBDA_TASK_ROOT || '').trim()

  const isServerless = Boolean(
    process.env.VERCEL ||
      process.env.VERCEL_REGION ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.AWS_EXECUTION_ENV ||
      lambdaTaskRoot ||
      cwd.startsWith('/var/task'),
  )

  if (isServerless) return join('/tmp', 'build-with-ai', 'data')

  return join(cwd, 'data')
}
