import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { dbAudit } from '../../../../lib/opsStore'
import { getDataDir } from '../../../../lib/dataDir'

export const runtime = 'nodejs'

export type AdminLead = {
  service: string
  tier: string
  name: string
  email: string
  company?: string
  message?: string
  timestamp?: string
  createdAt?: string
  status?: 'New' | 'Contacted' | 'Closed'
}

function getLeadTimestamp(lead: AdminLead): string {
  return lead.timestamp || lead.createdAt || ''
}

export async function GET(req: Request) {
  const requestId = randomUUID()
  const adminSecret = process.env.ADMIN_SECRET
  // lazy import logger + tracing to avoid runtime cost in cold paths
  const [{ logger }, { startSpan }] = await Promise.all([
    import('@/lib/logger'),
    import('@/lib/tracing'),
  ]).catch(() => [ { logger: console }, { startSpan: () => ({ end: () => {} }) } ])
  const safeStartSpan = (startSpan as unknown as ((name: string) => { end: (meta?: any) => void })) ?? ((n: string) => ({ end: (_?: any) => {} }))
  const trace = safeStartSpan('admin.leads.list')
  if (!adminSecret) return NextResponse.json({ error: 'Missing ADMIN_SECRET on server' }, { status: 500, headers: { 'x-request-id': requestId } })

  const headerSecret = req.headers.get('x-admin-secret') || req.headers.get('authorization')
  if (!headerSecret || headerSecret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'x-request-id': requestId } })
  }

    try {
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown'
    await dbAudit({
      actorType: 'admin',
      actorId: 'admin',
      action: 'admin_leads_list',
      resource: 'lead',
      resourceId: 'list',
      metadata: { ip },
    })
      logger?.info?.('admin.leads.list audit recorded', { ip })
  } catch {
    // ignore
  }

  try {
    const dataDir = getDataDir()
    const file = join(dataDir, 'leads.jsonl')
    const statusFile = join(dataDir, 'lead-statuses.json')

    const statusText = await readFile(statusFile, { encoding: 'utf8' }).catch((err: any) => {
      if (err?.code === 'ENOENT') return '{}'
      throw err
    })

    const persistedStatuses = (() => {
      try {
        return JSON.parse(statusText) as Record<string, 'New' | 'Contacted' | 'Closed'>
      } catch {
        return {} as Record<string, 'New' | 'Contacted' | 'Closed'>
      }
    })()

    const text = await readFile(file, { encoding: 'utf8' }).catch((err: any) => {
      if (err?.code === 'ENOENT') return ''
      throw err
    })

    const leads: AdminLead[] = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line) as AdminLead
        } catch {
          return null
        }
      })
      .filter((x): x is AdminLead => Boolean(x))
      .map((l) => {
        const key = (l.email || '').trim().toLowerCase()
        const status = key ? persistedStatuses[key] : undefined
        return status ? { ...l, status } : l
      })
      .sort((a, b) => (getLeadTimestamp(a) < getLeadTimestamp(b) ? 1 : -1))

    trace?.end({ count: leads.length })
    logger?.info?.('admin.leads.list success', { count: leads.length })
    return NextResponse.json({ results: leads }, { headers: { 'x-request-id': requestId } })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to read leads'
    logger?.error?.('admin.leads.list error', { error: message })
    trace?.end({ error: message })
    return NextResponse.json({ error: message }, { status: 500, headers: { 'x-request-id': requestId } })
  }
}
