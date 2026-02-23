/**
 * Retry utility with exponential backoff for API calls
 * Implements enterprise-grade retry logic with jitter
 */

export interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  shouldRetry?: (error: Error, attempt: number) => boolean
  onRetry?: (error: Error, attempt: number) => void
}

/**
 * Executes a function with retry logic using exponential backoff
 * @param fn - Async function to execute
 * @param options - Retry configuration options
 * @returns Promise resolving to function result
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    shouldRetry = () => true,
    onRetry,
  } = options

  let lastError: Error | null = null
  let attempt = 0

  while (attempt <= maxRetries) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      attempt++

      // Don't retry if we've exhausted all attempts
      if (attempt > maxRetries) {
        break
      }

      // Don't retry if shouldRetry returns false
      if (!shouldRetry(lastError, attempt)) {
        throw lastError
      }

      // Calculate delay with exponential backoff and jitter
      const delay = calculateDelay(baseDelay, maxDelay, attempt)

      // Call onRetry callback if provided
      onRetry?.(lastError, attempt)

      // Wait before retrying
      await sleep(delay)
    }
  }

  throw lastError || new Error('Unknown error after retries')
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(baseDelay: number, maxDelay: number, attempt: number): number {
  // Exponential backoff: baseDelay * 2^(attempt-1)
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1)
  
  // Add jitter: random value between 0 and 1000ms
  const jitter = Math.random() * 1000
  
  // Total delay capped at maxDelay
  return Math.min(exponentialDelay + jitter, maxDelay)
}

/**
 * Sleep utility function
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Fetch wrapper with automatic retry
 */
export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: RetryOptions & {
    retryStatusCodes?: number[]
  } = {}
): Promise<Response> {
  const { retryStatusCodes = [408, 429, 500, 502, 503, 504], ...retryOptions } = options

  return withRetry(async () => {
    const response = await fetch(input, init)

    // Check if status code should trigger a retry
    if (retryStatusCodes.includes(response.status)) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response
  }, retryOptions)
}

/**
 * Default retry handler for API calls
 * Logs retry attempts to console in development
 */
export function createRetryHandler(context: string) {
  return {
    shouldRetry: (error: Error, attempt: number) => {
      // Don't retry on client errors (4xx) except rate limiting
      if (error.message.includes('4') && !error.message.includes('429')) {
        return false
      }
      return attempt <= 3
    },
    onRetry: (error: Error, attempt: number) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[${context}] Retry attempt ${attempt} after error:`, error.message)
      }
    },
  }
}

export default { withRetry, fetchWithRetry, createRetryHandler }
