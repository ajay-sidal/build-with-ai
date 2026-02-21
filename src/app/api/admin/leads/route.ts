import { NextResponse } from 'next/server'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

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
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return NextResponse.json({ error: 'Missing ADMIN_SECRET on server' }, { status: 500 })

  const headerSecret = req.headers.get('x-admin-secret') || req.headers.get('authorization')
  if (!headerSecret || headerSecret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const file = join(process.cwd(), 'data', 'leads.jsonl')
    const statusFile = join(process.cwd(), 'data', 'lead-statuses.json')

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

    return NextResponse.json({ results: leads })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to read leads'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
