'use client'

import * as React from 'react'
import { Button } from '../../../components/ui/button'
import { Switch } from '../../../components/ui/switch'

type DomainRow = {
  domain: string
  expiration_date?: string
  is_auto_renew_enabled?: boolean
}

type Props = {
  domains: DomainRow[]
}

function daysUntil(dateIso?: string) {
  if (!dateIso) return null
  const d = new Date(dateIso)
  if (Number.isNaN(d.getTime())) return null
  const diffMs = d.getTime() - Date.now()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export default function RenewalManagement({ domains }: Props) {
  const [rows, setRows] = React.useState(domains)
  const [isSaving, setIsSaving] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  async function toggle(domain: string, nextValue: boolean) {
    setIsSaving(domain)
    setError(null)

    // optimistic
    setRows((prev) => prev.map((r) => (r.domain === domain ? { ...r, is_auto_renew_enabled: nextValue } : r)))

    try {
      const res = await fetch('/api/domains/autorenew', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, is_auto_renew_enabled: nextValue }),
      })
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      if (!res.ok) throw new Error(data?.error || 'Failed to update')
    } catch (err) {
      // revert
      setRows((prev) => prev.map((r) => (r.domain === domain ? { ...r, is_auto_renew_enabled: !nextValue } : r)))
      setError(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setIsSaving(null)
    }
  }

  const expiring = rows
    .map((r) => ({ ...r, days: daysUntil(r.expiration_date) }))
    .filter((r) => r.days != null && r.days <= 30)
    .sort((a, b) => (a.days! > b.days! ? 1 : -1))

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-950/60">
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <div>
          <h2 className="text-sm font-medium text-zinc-200">Renewal Management</h2>
          <p className="mt-1 text-xs text-zinc-500">Domains expiring within 30 days.</p>
        </div>
        <Button variant="secondary" type="button" onClick={() => window.location.reload()} className="h-9">
          Refresh
        </Button>
      </div>

      {error ? <p className="px-5 pt-3 text-sm text-red-300">{error}</p> : null}

      <div className="px-5 pb-5 pt-4">
        {expiring.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-800 p-6 text-sm text-zinc-500">
            No renewals due soon.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                  <th className="py-2 pr-4">Domain</th>
                  <th className="py-2 pr-4">Expires</th>
                  <th className="py-2 pr-4">Days</th>
                  <th className="py-2">Auto-renew</th>
                </tr>
              </thead>
              <tbody>
                {expiring.map((r) => (
                  <tr key={r.domain} className="border-b border-zinc-900/80 hover:bg-zinc-950">
                    <td className="py-3 pr-4 font-medium text-zinc-100">{r.domain}</td>
                    <td className="py-3 pr-4 text-zinc-300">{r.expiration_date || '—'}</td>
                    <td className="py-3 pr-4 text-zinc-300">{r.days}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`auto-renew-${r.domain}`}
                          name={`auto_renew_${r.domain}`}
                          checked={Boolean(r.is_auto_renew_enabled)}
                          disabled={isSaving === r.domain}
                          onChange={(e) => toggle(r.domain, e.target.checked)}
                          aria-label={`Auto renew ${r.domain}`}
                        />
                        <span className="text-xs text-zinc-500">{isSaving === r.domain ? 'Saving…' : ''}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
