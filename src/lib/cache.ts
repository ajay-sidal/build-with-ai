// Simple Redis cache utility (example). If `ioredis` is not installed or REDIS_URL
// is not set, this module exposes no-op functions so the app still runs.
const redisUrl = process.env.REDIS_URL || '';
let redis: any = null;
try {
  if (redisUrl) {
    // Require dynamically to avoid type errors when the package isn't installed
    // in environments where caching is not configured.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const IORedis = require('ioredis')
    redis = new IORedis(redisUrl)
  }
} catch (e) {
  // ioredis not available; fall back to no-op
  redis = null
}

export async function cacheSet(key: string, value: string, ttl = 3600) {
  if (!redis) return
  await redis.set(key, value, 'EX', ttl)
}

export async function cacheGet(key: string) {
  if (!redis) return null
  return await redis.get(key)
}
