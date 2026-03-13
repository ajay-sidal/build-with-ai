'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, RefreshCw } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'

type ClientErrorRecord = {
  createdAt?: string
  message?: string
  stack?: string
  url?: string
  userAgent?: string
}

function fmtDate(ts?: string) {
  if (!ts) return '—'
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  return d.toLocaleString()
}

export default function ErrorsClient() {
  const [adminSecret, setAdminSecret] = React.useState('')
  const [rows, setRows] = React.useState<ClientErrorRecord[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const saved = window.sessionStorage.getItem('admin_secret')
    if (saved) setAdminSecret(saved)
  }, [])

  async function load() {
    setIsLoading(true)
    setError(null)

    try {
      if (!adminSecret.trim()) throw new Error('Enter ADMIN_SECRET to load errors')
      window.sessionStorage.setItem('admin_secret', adminSecret.trim())

      const res = await fetch('/api/admin/client-errors', {
        headers: { 'x-admin-secret': adminSecret.trim() },
        cache: 'no-store',
      })

      const json = (await res.json().catch(() => null)) as { results?: ClientErrorRecord[]; error?: string } | null
      if (!res.ok) throw new Error(json?.error || 'Failed to load errors')

      setRows(json?.results ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load errors')
      setRows([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <Card className="border-zinc-800 bg-zinc-950/60">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Admin Errors</h1>
              <p className="mt-1 text-sm text-zinc-400">Client-side crash log (from /api/logs/client-error).</p>
            </div>

            <Button type="button" className="h-10" onClick={load} disabled={isLoading}>
              <RefreshCw size={16} className="mr-2" />
              {isLoading ? 'Loading…' : 'Load'}
            </Button>
          </div>

          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-red-800/40 bg-red-950/20 p-4 text-sm text-red-200"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert size={16} />
                {error}
              </div>
            </motion.div>
          ) : null}
        </CardHeader>

        <CardContent>
          <div className="grid gap-2">
            <label className="text-xs text-zinc-400">Admin Secret</label>
            <Input
              id="admin-secret-errors"
              name="adminSecret"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              placeholder="ADMIN_SECRET"
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                  <th className="py-2 pr-4">When</th>
                  <th className="py-2 pr-4">URL</th>
                  <th className="py-2 pr-4">Message</th>
                  <th className="py-2">User Agent</th>
                </tr>
              </thead>

              <AnimatePresence initial={false}>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-zinc-500">
                        No errors logged.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r, idx) => (
                      <motion.tr
                        key={(r.createdAt || '') + ':' + idx}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-zinc-900/80 hover:bg-zinc-950"
                      >
                        <td className="py-3 pr-4 text-zinc-300">{fmtDate(r.createdAt)}</td>
                        <td className="py-3 pr-4 text-zinc-300">{r.url || '—'}</td>
                        <td className="py-3 pr-4 text-zinc-100">{r.message || '—'}</td>
                        <td className="py-3 text-zinc-300">{(r.userAgent || '').slice(0, 80) || '—'}</td>
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
