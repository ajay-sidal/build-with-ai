'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Download, ShieldAlert, RefreshCw } from 'lucide-react'
import { Select } from '../../../components/ui/select'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import Skeleton from '../../../components/ui/Skeleton'

type Lead = {
  service: string
  tier: 'starter' | 'pro' | string
  name: string
  email: string
  company?: string
  message?: string
  timestamp?: string
  createdAt?: string
  status?: LeadStatus
}

type LeadStatus = 'New' | 'Contacted' | 'Closed'

function leadId(l: Lead) {
  return `${l.timestamp || l.createdAt || ''}|${l.email}|${l.tier}|${l.service}`
}

function leadDate(l: Lead) {
  const ts = l.timestamp || l.createdAt
  if (!ts) return ''
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  return d.toLocaleString()
}

function statusOrder(s: LeadStatus) {
  if (s === 'New') return 0
  if (s === 'Contacted') return 1
  return 2
}

function badgeClasses(s: LeadStatus) {
  if (s === 'New') return 'border border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
  if (s === 'Contacted') return 'border border-amber-500/30 bg-amber-950/20 text-amber-200'
  return 'border border-sky-500/30 bg-sky-950/20 text-sky-200'
}

function buildMailto(l: Lead, status: LeadStatus) {
  const first = (l.name || '').split(' ')[0] || l.name || 'there'
  const tierLine = String(l.tier).toLowerCase() === 'pro' ? 'Pro ($2,499)' : 'Starter ($999)'

  const subject = `BuildWithAI.digital — AI-Native Web Design (${tierLine})`

  const body = [
    `Hi ${first},`,
    '',
    `Thanks for reaching out about our Bespoke AI‑Native Web Design (${tierLine}).`,
    '',
    'Here’s what I can do for you in the next 7 days:',
    '- High-contrast, conversion-first landing + core flows',
    '- Performance + SEO foundations (metadata, sitemap, robots)',
    '- Secure checkout + server-side integrations where needed',
    '',
    'If you can reply with 2 quick answers, I’ll send a 1-page build plan:',
    '1) What are you selling (and to whom)?',
    '2) What is your #1 outcome in the first 30 days?',
    '',
    `Context I have: ${l.message ? l.message : '—'}`,
    '',
    'Best,',
    'BuildWithAI.digital',
    '',
    `Status: ${status}`,
  ].join('\n')

  const qs = new URLSearchParams({ subject, body })
  return `mailto:${encodeURIComponent(l.email)}?${qs.toString()}`
}

function toCsv(rows: Array<{ [k: string]: string }>) {
  const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))))
  const escape = (v: string) => `"${String(v ?? '').replaceAll('"', '""')}"`
  const lines = [headers.map(escape).join(',')]
  for (const r of rows) {
    lines.push(headers.map((h) => escape(r[h] ?? '')).join(','))
  }
  return lines.join('\n')
}

function downloadCsvFile(fileName: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function LeadsClient() {
  const { useNotifications } = require('../../../lib/notifications')
  const { addNotification } = useNotifications()
  const { useDragAndDropList } = require('../../../lib/drag-and-drop')

  const [adminSecret, setAdminSecret] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [leads, setLeads] = React.useState<Lead[]>([])
  const [statuses, setStatuses] = React.useState<Record<string, LeadStatus>>({})
  const [orderedLeads, setOrderedLeads] = React.useState<Array<{ l: Lead, id: string, status: LeadStatus }>>([])

  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Initialize drag-and-drop for ordered leads
  const dragList = useDragAndDropList(orderedLeads, setOrderedLeads)

  React.useEffect(() => {
    const saved = window.sessionStorage.getItem('admin_secret')
    if (saved) setAdminSecret(saved)

    const statusJson = window.localStorage.getItem('lead_statuses')
    if (statusJson) {
      try {
        setStatuses(JSON.parse(statusJson) as Record<string, LeadStatus>)
      } catch {
        // ignore
      }
    }
  }, [])

  React.useEffect(() => {
    window.localStorage.setItem('lead_statuses', JSON.stringify(statuses))
  }, [statuses])

  async function load() {
    setIsLoading(true)
    setError(null)

    try {
      if (!adminSecret.trim()) throw new Error('Enter ADMIN_SECRET to load leads')
      window.sessionStorage.setItem('admin_secret', adminSecret.trim())

      const res = await fetch('/api/admin/leads', {
        headers: { 'x-admin-secret': adminSecret.trim() },
        cache: 'no-store',
      })

      const data = (await res.json().catch(() => null)) as { results?: Lead[]; error?: string } | null
      if (!res.ok) throw new Error(data?.error || 'Failed to load leads')

      const list = data?.results ?? []
      setLeads(list)

      // Initialize ordered leads with decorated data
      const decorated = list.map((l) => {
        const id = leadId(l)
        const s = statuses[id] || l.status || 'New'
        return { l, id, status: s }
      })
      setOrderedLeads(decorated)

      // default any missing to New
      setStatuses((prev) => {
        const next = { ...prev }
        for (const l of list) {
          const id = leadId(l)
          if (!next[id]) next[id] = l.status || 'New'
        }
        return next
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leads')
      setLeads([])
    } finally {
      setIsLoading(false)
    }
  }

  async function setStatus(id: string, email: string, s: LeadStatus) {
    setStatuses((prev) => ({ ...prev, [id]: s }))

    // persist when admin secret is available
    if (!adminSecret.trim()) return
    try {
      await fetch('/api/admin/leads/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret.trim(),
        },
        body: JSON.stringify({ email, status: s }),
      })
      addNotification({
        type: 'success',
        title: 'Lead Status Updated',
        message: `Status for ${email} set to ${s}.`,
      })
    } catch {
      // best-effort
      addNotification({
        type: 'error',
        title: 'Status Update Failed',
        message: `Could not update status for ${email}.`,
      })
    }
  }

  const query = search.trim().toLowerCase()
  const filtered = leads.filter((l) => {
    if (!query) return true
    const c = (l.company || '').toLowerCase()
    const e = (l.email || '').toLowerCase()
    return c.includes(query) || e.includes(query)
  })

  const decorated = filtered
    .map((l) => {
      const id = leadId(l)
      const status = statuses[id] || 'New'
      const ts = l.timestamp || l.createdAt || ''
      return { l, id, status, ts }
    })
    .sort((a, b) => {
      const s = statusOrder(a.status) - statusOrder(b.status)
      if (s !== 0) return s
      return a.ts < b.ts ? 1 : -1
    })

  function exportCsv() {
    const rows = decorated.map(({ l, id, status }) => ({
      id,
      date: leadDate(l),
      name: l.name,
      email: l.email,
      company: l.company || '',
      tier: String(l.tier),
      status,
      message: l.message || '',
    }))

    downloadCsvFile(`leads-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows))
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <Card className="border-zinc-800 bg-zinc-950/60">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Admin Leads</h1>
              <p className="mt-1 text-sm text-zinc-400">Actionable prospects from AI Design inquiries.</p>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="secondary" className="h-10" onClick={exportCsv} disabled={decorated.length === 0}>
                <Download size={16} className="mr-2" /> Export CSV
              </Button>
              <Button type="button" className="h-10" onClick={load} disabled={isLoading}>
                <RefreshCw size={16} className="mr-2" />
                {isLoading ? 'Loading…' : 'Load'}
              </Button>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-800/40 bg-red-950/20 p-4 text-sm text-red-200">
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} />
                {error}
              </div>
            </div>
          ) : null}
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-xs text-zinc-400">Admin Secret</label>
              <Input
                id="admin-secret-leads"
                name="adminSecret"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                placeholder="ADMIN_SECRET"
              />
              <div className="text-xs text-zinc-500">Sent as `x-admin-secret` header.</div>
            </div>

            <div className="grid gap-2">
              <label className="text-xs text-zinc-400">Search</label>
              <Input
                id="admin-leads-search"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by company or email"
              />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Prospect</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Project Type</th>
                  <th className="py-2 pr-4">Lead Score</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Engage</th>
                </tr>
              </thead>

              <AnimatePresence initial={false}>
                <tbody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <tr key={idx}>
                        <td colSpan={7} className="py-3">
                          <div className="flex gap-2">
                            <div className="w-24 h-4"><Skeleton className="w-full h-full" /></div>
                            <div className="w-32 h-4"><Skeleton className="w-full h-full" /></div>
                            <div className="w-40 h-4"><Skeleton className="w-full h-full" /></div>
                            <div className="w-20 h-4"><Skeleton className="w-full h-full" /></div>
                            <div className="w-16 h-4"><Skeleton className="w-full h-full" /></div>
                            <div className="w-24 h-4"><Skeleton className="w-full h-full" /></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : orderedLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-zinc-500">
                        No leads loaded.
                      </td>
                    </tr>
                  ) : (
                    orderedLeads.map(({ l, id, status }, idx) => {
                      const isPro = String(l.tier).toLowerCase() === 'pro'
                      const score = isPro ? 'High' : 'Standard'
                      return (
                        <motion.tr
                          key={id}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className={
                            `border-b border-zinc-900/80 hover:bg-zinc-950 ` +
                            (isPro ? 'ring-1 ring-emerald-400/20' : '')
                          }
                          draggable
                          onDragStart={e => dragList.handlers.onDragStart(e, idx)}
                          onDragOver={e => dragList.handlers.onDragOver(e, idx)}
                          onDrop={e => dragList.handlers.onDrop(e, idx)}
                          onDragEnd={dragList.handlers.onDragEnd}
                          style={dragList.dragIndex === idx ? { opacity: 0.5 } : dragList.hoverIndex === idx ? { background: '#232323' } : {}}
                        >
                          <td className="py-3 pr-4 text-zinc-300">{leadDate(l)}</td>
                          <td className="py-3 pr-4 font-medium text-zinc-100">{l.name}</td>
                          <td className="py-3 pr-4 text-zinc-300">{l.email}</td>
                          <td className="py-3 pr-4 text-zinc-300">{String(l.tier).toUpperCase()}</td>
                          <td className="py-3 pr-4">
                            <span className={isPro ? 'text-emerald-200' : 'text-zinc-300'}>{score}</span>
                          </td>
                          <td className="py-3 pr-4">
                            <Select
                              className={`h-9 rounded-md px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-200/20 ${badgeClasses(status)}`}
                              value={status}
                              onChange={(e) => setStatus(id, l.email, e.target.value as LeadStatus)}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Closed">Closed</option>
                            </Select>
                          </td>
                          <td className="py-3">
                            <Button
                              type="button"
                              onClick={() => window.open(buildMailto(l, status), '_blank')}
                              className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-xs font-medium text-zinc-50 hover:bg-zinc-900"
                            >
                              <Mail size={14} /> Engage
                            </Button>
                          </td>
                        </motion.tr>
                      )
                    })
                  )}
                </tbody>
              </AnimatePresence>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
