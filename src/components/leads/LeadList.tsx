"use client"

import * as React from 'react'

export default function LeadList({ leads }: { leads: any[] }) {
  if (!leads || leads.length === 0) {
    return <div className="py-8 text-center text-zinc-400">No leads found.</div>
  }

  return (
    <div className="space-y-3">
      {leads.map((l, idx) => (
        <div key={l.id || idx} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-zinc-100">{l.company || 'Unknown Company'}</div>
              <div className="mt-1 text-xs text-zinc-400">{l.title || l.role || '—'}</div>
            </div>
            <div className="text-right text-xs text-zinc-400">{l.location || ''}</div>
          </div>
          <div className="mt-3 text-xs text-zinc-300">{l.summary || ''}</div>
        </div>
      ))}
    </div>
  )
}
