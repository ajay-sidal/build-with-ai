// BullMQ and ioredis are optional dependencies
// This module provides queue functionality when they are available
let Queue: any = null
let Redis: any = null
let queueInstance: any = null
let loaded = false
let available = false

// Load dependencies once
function loadQueueDependencies() {
  if (loaded) return available
  
  loaded = true
  try {
    // Use indirect require to avoid static bundlers (Turbopack) trying to
    // resolve optional dependencies at build time. This keeps these deps
    // truly optional at runtime.
    // eslint-disable-next-line no-eval
    const req: NodeRequire = eval('require')
    const bullmq = req('bullmq')
    Redis = req('ioredis')
    Queue = bullmq?.Queue ?? null
    available = true
  } catch (e) {
    // BullMQ and ioredis are optional - queue functionality disabled if not installed
    available = false
  }
  return available
}

export function createQueue(name = 'leads') {
  if (!loadQueueDependencies()) return null
  if (queueInstance) return queueInstance
  const redisUrl = process.env.REDIS_URL || process.env.REDIS
  if (!redisUrl) return null
  queueInstance = new Queue(name, { connection: { url: redisUrl } })
  return queueInstance
}

export async function addLeadsJob(payload: any) {
  const q = createQueue('leads')
  if (!q) {
    throw new Error('Queue not available (missing bullmq or REDIS_URL)')
  }
  const job = await q.add('generate', payload, { removeOnComplete: true, removeOnFail: false })
  return job
}
