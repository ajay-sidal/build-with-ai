'use client'

import * as React from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../components/ui/card'

type ProviderMap = Record<string, { id: string; name: string }>

export default function LoginClient() {
  const [providers, setProviders] = React.useState<Array<{ id: string; name: string }>>([])
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false

    async function loadProviders() {
      try {
        const res = await fetch('/api/auth/providers', { cache: 'no-store' })
        const json = (await res.json().catch(() => null)) as ProviderMap | null
        if (!res.ok || !json) throw new Error('Failed to load providers')
        const list = Object.values(json).map((p) => ({ id: p.id, name: p.name }))
        if (!cancelled) setProviders(list)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load providers')
      }
    }

    loadProviders()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-16">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-zinc-400">Enterprise authentication for BuildWithAI.digital.</p>
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        </CardHeader>
        <CardContent className="grid gap-3">
          {providers.length === 0 ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-400">
              No OAuth providers are configured yet. Set `GITHUB_ID`/`GITHUB_SECRET` or `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`.
            </div>
          ) : (
            providers.map((p) => (
              <Button key={p.id} type="button" className="h-12" onClick={() => signIn(p.id)}>
                Continue with {p.name}
              </Button>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}
