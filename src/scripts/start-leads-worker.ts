#!/usr/bin/env node
/*
  Simple script to start a BullMQ worker for leads processing.
  Run with: `node ./src/scripts/start-leads-worker.ts` (use tsx in dev)
*/
async function main() {
  try {
    // Lazy import to avoid failing when bullmq not installed
    // Use indirect require to prevent static bundlers from resolving optional deps at build time
    // eslint-disable-next-line no-eval
    const req: NodeRequire = eval('require')
    let Worker: any
    try {
      Worker = req('bullmq').Worker
    } catch (err) {
      console.error('bullmq not installed; cannot start worker', err)
      process.exit(1)
    }
    const { processLeadsJob } = req('../../src/lib/leadsWorker')
    const redisUrl = process.env.REDIS_URL || process.env.REDIS
    if (!redisUrl) {
      console.error('REDIS_URL not configured; cannot start worker')
      process.exit(1)
    }

    const worker = new Worker('leads', async (job: any) => {
      console.log('[WORKER] processing job', job.id)
      const result = await processLeadsJob(job.data)
      return result
    }, { connection: { url: redisUrl } })

    worker.on('completed', (job: any) => console.log('[WORKER] completed', job.id))
    worker.on('failed', (job: any, err: Error | any) => console.error('[WORKER] failed', job?.id, err))

    console.log('Leads worker started')
  } catch (e) {
    console.error('Failed to start worker', e)
    process.exit(1)
  }
}

main()
