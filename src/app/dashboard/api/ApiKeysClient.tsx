'use client'

import * as React from 'react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'

type KeyRow = {
  id: string
  key_hint: string
  created_at: string
  status: 'ACTIVE' | 'REVOKED'
}

type ListResponse = {
  keys: KeyRow[]
  usage?: { windowHours: number; count: number }
  requestId?: string
  error?: string
}

type CreateResponse = {
  key?: { id: string; apiKey: string; hint: string }
  requestId?: string
  error?: string
}

export default function ApiKeysClient() {
  const [userId, setUserId] = React.useState<string | null>(null)
  const [keys, setKeys] = React.useState<KeyRow[]>([])
  const [usage, setUsage] = React.useState<{ windowHours: number; count: number } | null>(null)

  const [isLoading, setIsLoading] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [newKey, setNewKey] = React.useState<{ apiKey: string; hint: string; id: string } | null>(null)

  React.useEffect(() => {
    const handle = typeof window !== 'undefined' ? window.localStorage.getItem('op_customer_handle') : null
    setUserId(handle && handle.trim() ? handle.trim() : null)
  }, [])

  const load = React.useCallback(async (uid: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/developer/keys?userId=${encodeURIComponent(uid)}`, { cache: 'no-store' })
      const json = (await res.json().catch(() => null)) as ListResponse | null
      if (!res.ok) throw new Error(json?.error || 'Failed to load keys')

      setKeys(Array.isArray(json?.keys) ? json!.keys : [])
      setUsage(json?.usage && typeof json.usage.count === 'number' ? json.usage : null)
    } catch (err) {
      setKeys([])
      setUsage(null)
      setError(err instanceof Error ? err.message : 'Failed to load keys')
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (!userId) return
    load(userId)
  }, [userId, load])

  async function onCreate() {
    if (!userId) return

    setIsCreating(true)
    setError(null)
    setNewKey(null)

    try {
      const res = await fetch('/api/developer/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      const json = (await res.json().catch(() => null)) as CreateResponse | null
      if (!res.ok) throw new Error(json?.error || 'Failed to create key')
      if (!json?.key?.apiKey) throw new Error('Missing API key')

      setNewKey({ apiKey: json.key.apiKey, hint: json.key.hint, id: json.key.id })
      await load(userId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create key')
    } finally {
      setIsCreating(false)
    }
  }

  async function onRevoke(id: string) {
    if (!userId) return

    setError(null)
    try {
      const res = await fetch(`/api/developer/keys/${encodeURIComponent(id)}?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      })
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!res.ok) throw new Error(json?.error || 'Failed to revoke key')
      await load(userId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke key')
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Developer API</h1>
        <p className="mt-1 text-sm text-zinc-400">Generate API keys and access your programmatic gateway.</p>
      </div>

      {!userId ? (
        <Card className="border-zinc-800 bg-zinc-950/60">
          <CardHeader>
            <h2 className="text-sm font-medium text-zinc-200">Sign in required</h2>
            <p className="mt-1 text-xs text-zinc-500">Create an account before generating developer keys.</p>
          </CardHeader>
          <CardContent>
            <Button type="button" className="h-11" onClick={() => (window.location.href = '/signup')}>
              Create account
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-800/40 bg-red-950/20 p-4 text-sm text-red-200">{error}</div>
      ) : null}

      {newKey ? (
        <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-4 text-sm text-emerald-200">
          <div className="font-medium">API key created (shown once)</div>
          <div className="mt-2 rounded-lg border border-emerald-800/40 bg-zinc-950 p-3 font-mono text-xs text-zinc-100 break-all">
            {newKey.apiKey}
          </div>
          <div className="mt-2 text-xs text-zinc-300">Store it now. You won’t be able to view it again.</div>
        </div>
      ) : null}

      <Card className="border-zinc-800 bg-zinc-950/60">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-medium text-zinc-200">API keys</h2>
              <p className="mt-1 text-xs text-zinc-500">Rate limit: 60 requests/min per key.</p>
            </div>
            <Button type="button" onClick={onCreate} disabled={!userId || isCreating} className="h-11">
              {isCreating ? 'Generating…' : 'Generate new key'}
            </Button>
          </div>

          <div className="mt-3 text-xs text-zinc-500">
            Usage (last {usage?.windowHours || 24}h):{' '}
            <span className="font-mono text-zinc-200">{usage ? usage.count : '—'}</span>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-sm text-zinc-500">Loading…</div>
          ) : keys.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-800 p-6 text-sm text-zinc-500">No keys yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                    <th className="py-2 pr-4">Hint</th>
                    <th className="py-2 pr-4">Created</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((k) => (
                    <tr key={k.id} className="border-b border-zinc-900/80 hover:bg-zinc-950">
                      <td className="py-3 pr-4 font-mono text-zinc-200">{k.key_hint}…</td>
                      <td className="py-3 pr-4 text-zinc-300">{k.created_at ? new Date(k.created_at).toLocaleString() : '—'}</td>
                      <td className="py-3 pr-4 text-zinc-300">{k.status}</td>
                      <td className="py-3">
                        <Button
                          type="button"
                          variant="secondary"
                          className="h-9"
                          disabled={k.status !== 'ACTIVE'}
                          onClick={() => onRevoke(k.id)}
                        >
                          Revoke
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-400">
            <div className="font-medium text-zinc-200">Gateway endpoints</div>
            <div className="mt-2 font-mono">GET /api/v1/domains/check?query=verde&amp;tlds=com,digital</div>
            <div className="mt-1 font-mono">GET /api/v1/ssl/products</div>
            <div className="mt-2">Send your key via <span className="font-mono">x-api-key</span> header.</div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
