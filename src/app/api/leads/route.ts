import { NextResponse } from 'next/server'
import { addLeadsJob, createQueue } from '../../../lib/queue'
import { processLeadsJob } from '../../../lib/leadsWorker'

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Leads API placeholder. Use POST to enqueue jobs.' })
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    // Basic tenant/auth validation could go here

    // If queue available, enqueue job
    try {
      const q = createQueue('leads')
      if (q) {
        const job = await addLeadsJob(body)
        return NextResponse.json({ status: 'enqueued', jobId: job?.id })
      }
    } catch (e) {
      console.warn('Queue not available, will process inline', e)
    }

    // Fallback: process inline (synchronous) — not for production
    const result = await processLeadsJob(body)
    return NextResponse.json({ status: 'processed', result })
  } catch (e) {
    console.error('[LEADS] error', e)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
