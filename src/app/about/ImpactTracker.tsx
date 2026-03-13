'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { formatCurrency } from '../../utils/pricing'

type Stats = {
  assetsSecured: number
  marzFundingUsd: number
  marzGoalUsd: number
  marzProgressPct: number
}

export default function ImpactTracker() {
  const [stats, setStats] = React.useState<Stats | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/impact', { cache: 'no-store' })
        const json = (await res.json().catch(() => null)) as Stats | null
        if (!res.ok || !json) return
        if (!cancelled) setStats(json)
      } catch {
        // ignore
      }
    }

    load()
    const t = window.setInterval(load, 15000)
    return () => {
      cancelled = true
      window.clearInterval(t)
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="text-xs uppercase tracking-widest text-zinc-500">Live Impact Tracker</div>
        <div className="mt-1 text-sm text-zinc-300">Transparent progress, in real time.</div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-xs text-zinc-500">Digital Assets Secured</div>
            <div className="mt-1 font-mono text-2xl text-zinc-100">{stats ? stats.assetsSecured : '—'}</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-500">MARZ Funding Progress</div>
              <div className="text-xs text-zinc-500">{stats ? `${stats.marzProgressPct.toFixed(1)}%` : '—'}</div>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-zinc-800 bg-zinc-950">
              <div
                className="h-full bg-emerald-400/40"
                style={{ width: `${Math.max(0, Math.min(100, stats?.marzProgressPct ?? 0))}%` }}
              />
            </div>
            <div className="mt-3 text-xs text-zinc-400">
              {stats
                ? `${formatCurrency('USD', stats.marzFundingUsd)} raised of ${formatCurrency('USD', stats.marzGoalUsd)}`
                : '—'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
