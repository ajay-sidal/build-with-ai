'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'

type PayoutRow = {
  requestId: string
  createdAt: string
  partnerId: string
  status: 'PENDING' | 'COMPLETED' | 'REJECTED'
  amount: number
  method: string
  completedAt: string | null
}

type ApiResponse = { results: PayoutRow[] } | { error: string }

function fmtDate(ts: string) {
  if (!ts) return '—'
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  return d.toLocaleString()
}

export default function PayoutsClient() {
  const [adminSecret, setAdminSecret] = React.useState('')
  const [rows, setRows] = React.useState<PayoutRow[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  React.useEffect(() => {
    const saved = window.sessionStorage.getItem('admin_secret')
    if (saved) setAdminSecret(saved)
  }, [])

  async function load() {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (!adminSecret.trim()) throw new Error('Enter ADMIN_SECRET to load payouts')
      window.sessionStorage.setItem('admin_secret', adminSecret.trim())

      const res = await fetch('/api/admin/payouts', {
        headers: { 'x-admin-secret': adminSecret.trim() },
        cache: 'no-store',
      })

      const json = (await res.json().catch(() => null)) as ApiResponse | null
      if (!res.ok) throw new Error((json as any)?.error || 'Failed to load payouts')

      const list = (json && 'results' in json ? json.results : []) as PayoutRow[]
      setRows(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payouts')
      setRows([])
    } finally {
      setIsLoading(false)
    }
  }

  async function markPaid(requestId: string) {
    setError(null)
    setSuccess(null)

    try {
      if (!adminSecret.trim()) throw new Error('Enter ADMIN_SECRET')

      const res = await fetch('/api/admin/payouts/mark-paid', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret.trim(),
        },
        body: JSON.stringify({ requestId }),
      })

      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!res.ok) throw new Error(json?.error || 'Failed to mark as paid')

      setRows((prev) => prev.filter((r) => r.requestId !== requestId))
      setSuccess('Payout marked as COMPLETED')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as paid')
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <Card className="border-zinc-800 bg-zinc-950/60">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Admin Payouts</h1>
              <p className="mt-1 text-sm text-zinc-400">Approve partner payout requests (PENDING).</p>
            </div>

            <div className="flex gap-2">
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

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-4 text-sm text-emerald-200"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                {success}
              </div>
            </motion.div>
          ) : null}
        </CardHeader>

        <CardContent>
          <div className="grid gap-2">
            <label className="text-xs text-zinc-400">Admin Secret</label>
            <Input
              id="admin-secret-payouts"
              name="adminSecret"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              placeholder="ADMIN_SECRET"
            />
            <div className="text-xs text-zinc-500">Sent as `x-admin-secret` header.</div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                  <th className="py-2 pr-4">Requested</th>
                  <th className="py-2 pr-4">Partner</th>
                  <th className="py-2 pr-4">Method</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>

              <AnimatePresence initial={false}>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-zinc-500">
                        No pending payout requests.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <motion.tr
                        key={r.requestId}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-zinc-900/80 hover:bg-zinc-950"
                      >
                        <td className="py-3 pr-4 text-zinc-300">{fmtDate(r.createdAt)}</td>
                        <td className="py-3 pr-4 font-medium text-zinc-100">{r.partnerId}</td>
                        <td className="py-3 pr-4 text-zinc-300">{r.method}</td>
                        <td className="py-3 pr-4 text-zinc-300">{r.amount}</td>
                        <td className="py-3">
                          <Button type="button" onClick={() => markPaid(r.requestId)}>
                            Mark as Paid
                          </Button>
                        </td>
                      </motion.tr>
                    ))
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
