'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'

type JoinResponse =
  | { error: string }
  | { partnerId: string; referralUrl: string; existing: boolean }

export default function PartnersClient() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<JoinResponse | null>(null)

  const canSubmit = useMemo(() => {
    return name.trim().length > 1 && email.trim().includes('@')
  }, [name, email])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/partners/join', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })

      const json = (await res.json().catch(() => null)) as JoinResponse | null
      setResult(json || { error: 'Join failed' })
    } catch {
      setResult({ error: 'Join failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Partner Program</h1>
        <p className="text-zinc-300">
          Get a referral link and earn commission when your referrals check out.
        </p>
      </div>

      <div className="mt-8 grid gap-6">
        <Card className="p-6">
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <label className="text-sm text-zinc-300">Name</label>
              <Input
                id="partner-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Partner"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-zinc-300">Email</label>
              <Input
                id="partner-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                inputMode="email"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={!canSubmit || loading}>
                {loading ? 'Creating…' : 'Create partner link'}
              </Button>
              <Button variant="secondary" onClick={() => router.push('/partners/dashboard')} className="text-sm text-zinc-300 hover:text-zinc-50">
                Go to dashboard →
              </Button>
            </div>
          </form>
        </Card>

        {result && 'error' in result && (
          <Card className="p-6 border border-red-500/30">
            <p className="text-red-200">{result.error}</p>
          </Card>
        )}

        {result && !('error' in result) && (
          <Card className="p-6">
            <div className="space-y-2">
              <div className="text-sm text-zinc-300">Partner ID</div>
              <div className="font-mono text-sm break-all">{result.partnerId}</div>

              <div className="text-sm text-zinc-300 pt-3">Referral link</div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input id="partner-referral-url" name="referral_url" readOnly value={result.referralUrl} />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigator.clipboard.writeText(result.referralUrl)}
                >
                  Copy
                </Button>
              </div>

              <div className="text-xs text-zinc-400">
                Visits with <span className="font-mono">?ref={result.partnerId}</span> are stored for 30 days.
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  )
}
