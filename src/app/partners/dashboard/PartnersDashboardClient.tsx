'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Card } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Select } from '../../../components/ui/select'

type StatsResponse =
  | { error: string }
  | {
      partnerId: string
      totals: {
        salesCount: number
        commissionTotal: number
        commissionEligible: number
        pendingPayoutsTotal: number
        completedPayoutsTotal: number
        availableNow: number
        canRequestPayout: boolean
        markupTotal: number
        lastSaleAt: string | null
      }
      recent: Array<{
        createdAt: string
        kind: string
        commissionAmount: number
        markupAmount: number
        currency: string
        sessionId: string
        paymentStatus: string
      }>
      payouts: Array<{
        requestId: string
        createdAt: string
        status: 'PENDING' | 'COMPLETED' | 'REJECTED'
        amount: number
        method: string
        completedAt: string | null
      }>
    }

const LS_KEY = 'bwai_partner_id'

export default function PartnersDashboardClient() {
  const [partnerId, setPartnerId] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<StatsResponse | null>(null)
  const [payoutMethod, setPayoutMethod] = useState<'STRIPE_CONNECT' | 'MANUAL'>('STRIPE_CONNECT')
  const [payoutState, setPayoutState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [payoutMessage, setPayoutMessage] = useState<string | null>(null)

  const canFetch = useMemo(() => partnerId.trim().length >= 4, [partnerId])

  useEffect(() => {
    const existing = window.localStorage.getItem(LS_KEY) || ''
    if (existing) setPartnerId(existing)
  }, [])

  async function fetchStats() {
    if (!canFetch) return
    const id = partnerId.trim()

    setLoading(true)
    setData(null)

    try {
      window.localStorage.setItem(LS_KEY, id)
      const res = await fetch(`/api/partners/stats?partnerId=${encodeURIComponent(id)}`, { cache: 'no-store' })
      const json = (await res.json().catch(() => null)) as StatsResponse | null
      setData(json || { error: 'Failed to load stats' })
    } catch {
      setData({ error: 'Failed to load stats' })
    } finally {
      setLoading(false)
    }
  }

  async function requestPayout() {
    if (!data || 'error' in data) return
    if (!data.totals.canRequestPayout) return

    setPayoutState('loading')
    setPayoutMessage(null)

    try {
      const res = await fetch('/api/partners/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId: data.partnerId, method: payoutMethod }),
      })

      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!res.ok) throw new Error(json?.error || 'Payout request failed')

      setPayoutState('success')
      setPayoutMessage('Payout request submitted (PENDING).')
      await fetchStats()
    } catch (err) {
      setPayoutState('error')
      setPayoutMessage(err instanceof Error ? err.message : 'Payout request failed')
    }
  }

  function fmtDate(ts: string) {
    if (!ts) return '—'
    const d = new Date(ts)
    if (Number.isNaN(d.getTime())) return ts
    return d.toLocaleString()
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Partner Dashboard</h1>
        <p className="text-zinc-300">Enter your Partner ID to see totals and recent commissions.</p>
      </div>

      <div className="mt-8 grid gap-6">
        <Card className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              id="partner-dashboard-id"
              name="partnerId"
              value={partnerId}
              onChange={(e) => setPartnerId(e.target.value)}
              placeholder="partner-abc123"
            />
            <Button onClick={fetchStats} disabled={!canFetch || loading}>
              {loading ? 'Loading…' : 'Load stats'}
            </Button>
          </div>
        </Card>

        {data && 'error' in data && (
          <Card className="p-6 border border-red-500/30">
            <p className="text-red-200">{data.error}</p>
          </Card>
        )}

        {data && !('error' in data) && (
          <>
            <Card className="p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-xs text-zinc-400">Sales</div>
                  <div className="text-2xl font-semibold">{data.totals.salesCount}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Commission (total)</div>
                  <div className="text-2xl font-semibold">{data.totals.commissionTotal}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Markup (total)</div>
                  <div className="text-2xl font-semibold">{data.totals.markupTotal}</div>
                </div>
              </div>
              <div className="pt-4 text-xs text-zinc-400">Last sale: {data.totals.lastSaleAt || '—'}</div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-sm font-medium">Wallet</div>
                  <div className="mt-1 text-xs text-zinc-400">Only commissions older than 14 days are available.</div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-zinc-400">Method</label>
                  <Select value={payoutMethod} onChange={(e) => setPayoutMethod(e.target.value as any)} />

                  <Button onClick={requestPayout} disabled={!data.totals.canRequestPayout || payoutState === 'loading'}>
                    {payoutState === 'loading' ? 'Requesting…' : 'Request Payout'}
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-xs text-zinc-400">Total Earned</div>
                  <div className="text-2xl font-semibold">{data.totals.commissionTotal}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Pending Payouts</div>
                  <div className="text-2xl font-semibold">{data.totals.pendingPayoutsTotal}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">Available Now</div>
                  <div className="text-2xl font-semibold">{data.totals.availableNow}</div>
                  <div className="text-xs text-zinc-500">Minimum: $50</div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {payoutMessage ? (
                  <motion.div
                    key={payoutState}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className={
                      'mt-5 rounded-xl border p-4 text-sm ' +
                      (payoutState === 'success'
                        ? 'border-emerald-800/40 bg-emerald-950/20 text-emerald-200'
                        : payoutState === 'error'
                          ? 'border-red-800/40 bg-red-950/20 text-red-200'
                          : 'border-zinc-800 bg-zinc-950/40 text-zinc-200')
                    }
                  >
                    {payoutMessage}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </Card>

            <Card className="p-6">
              <div className="text-sm font-medium">Payout History</div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                      <th className="py-2 pr-4">Requested</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Method</th>
                      <th className="py-2">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.payouts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-500">
                          No payout requests yet.
                        </td>
                      </tr>
                    ) : (
                      data.payouts.map((p) => (
                        <tr key={p.requestId} className="border-b border-zinc-900/80">
                          <td className="py-3 pr-4 text-zinc-300">{fmtDate(p.createdAt)}</td>
                          <td className="py-3 pr-4 text-zinc-300">{p.status}</td>
                          <td className="py-3 pr-4 text-zinc-300">{p.amount}</td>
                          <td className="py-3 pr-4 text-zinc-300">{p.method}</td>
                          <td className="py-3 text-zinc-300">{p.completedAt ? fmtDate(p.completedAt) : '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6">
              <div className="text-sm font-medium">Recent</div>
              <div className="mt-4 grid gap-3">
                {data.recent.length === 0 && <div className="text-sm text-zinc-400">No sales yet.</div>}
                {data.recent.map((r) => (
                  <div key={r.sessionId + r.createdAt} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm text-zinc-50 truncate">{r.kind}</div>
                      <div className="text-xs text-zinc-400 truncate">{r.createdAt}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">+{r.commissionAmount}</div>
                      <div className="text-xs text-zinc-400">{r.paymentStatus}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}
