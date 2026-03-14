import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { getDataDir } from './dataDir'

type PersistedLead = {
  userId?: string
  service?: string
  tier?: string
  name?: string
  email?: string
  company?: string
  message?: string
  timestamp?: string
  createdAt?: string
}

export type DashboardLeadStatus = 'Discovery' | 'Proposal Sent' | 'Active Mission'

export type DashboardLead = {
  id: string
  name: string
  service: string
  budgetUsd: number
  status: DashboardLeadStatus
  email: string
  createdAt: string
}

function getLeadBudgetUsd(tier: string | undefined): number {
  if ((tier || '').toLowerCase() === 'pro') return 2499
  return 999
}

function normalizeLeadStatus(status: string | undefined): DashboardLeadStatus {
  if (status === 'Contacted') return 'Proposal Sent'
  if (status === 'Closed') return 'Active Mission'
  return 'Discovery'
}

function normalizeService(service: string | undefined): string {
  if (service === 'ai-design') return 'AI Design Retainer'
  if (!service) return 'General Inquiry'
  return service
    .split('-')
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

export async function getDashboardLeadsData(args?: { userId?: string | null; includeAll?: boolean }): Promise<{
  leads: DashboardLead[]
  potentialContractValueUsd: number
  activeMissions: number
}> {
  const includeAll = Boolean(args?.includeAll)
  const scopedUserId = args?.userId || null

  const dataDir = getDataDir()
  const leadsFile = join(dataDir, 'leads.jsonl')
  const statusesFile = join(dataDir, 'lead-statuses.json')

  const [text, statusText] = await Promise.all([
    readFile(leadsFile, { encoding: 'utf8' }).catch((err: any) => {
      if (err?.code === 'ENOENT') return ''
      throw err
    }),
    readFile(statusesFile, { encoding: 'utf8' }).catch((err: any) => {
      if (err?.code === 'ENOENT') return '{}'
      throw err
    }),
  ])

  const persistedStatuses = (() => {
    try {
      return JSON.parse(statusText) as Record<string, 'New' | 'Contacted' | 'Closed'>
    } catch {
      return {} as Record<string, 'New' | 'Contacted' | 'Closed'>
    }
  })()

  const leads = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as PersistedLead
      } catch {
        return null
      }
    })
    .filter((lead): lead is PersistedLead => Boolean(lead))
    .map((lead) => {
      const email = (lead.email || '').trim().toLowerCase()
      const persistedStatus = email ? persistedStatuses[email] : undefined
      const createdAt = lead.createdAt || lead.timestamp || new Date(0).toISOString()

      return {
        id: `${email}:${createdAt}`,
        userId: (lead.userId || '').trim() || null,
        name: lead.name || 'Unknown lead',
        service: normalizeService(lead.service),
        budgetUsd: getLeadBudgetUsd(lead.tier),
        status: normalizeLeadStatus(persistedStatus),
        email,
        createdAt,
      }
    })
    .filter((lead) => includeAll ? true : Boolean(scopedUserId) && lead.userId === scopedUserId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  const potentialContractValueUsd = leads.reduce((total, lead) => total + lead.budgetUsd, 0)
  const activeMissions = leads.filter((lead) => lead.status === 'Active Mission').length

  return {
    leads,
    potentialContractValueUsd,
    activeMissions,
  }
}