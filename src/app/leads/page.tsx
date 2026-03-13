"use client"

import * as React from 'react'
import LeadSearch from '../../components/leads/LeadSearch'
import LeadList from '../../components/leads/LeadList'

export default function LeadsPage() {
  const [leads, setLeads] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  const doSearch = async (q: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/leads?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      // If API returns enqueued, call GET to fetch results in real implementation
      if (data?.results) setLeads(data.results)
      else setLeads(data?.items || [])
    } catch (e) {
      console.error('Leads fetch error', e)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold">Leads Generator (demo)</h1>
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-6">
        <LeadSearch onSearch={doSearch} />
        <div className="mt-6">
          {loading ? <div className="text-zinc-400">Searching…</div> : <LeadList leads={leads} />}
        </div>
      </div>
    </main>
  )
}
