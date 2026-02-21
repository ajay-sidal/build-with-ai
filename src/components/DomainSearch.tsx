'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { Input } from './ui/input'

type DomainResult = {
  domain: string
  status: 'free' | 'active' | 'reserved'
  is_premium: boolean
  price?: { currency: string; amount: number }
  resellerPrice?: { currency: string; amount: number }
}

type ApiResponse = {
  query: string
  results: DomainResult[]
}

function formatMoney(currency: string, amount: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export default function DomainSearch() {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [results, setResults] = React.useState<DomainResult[]>([])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/domains/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error || 'Search failed')
      }

      const data = (await res.json()) as ApiResponse
      setResults(data.results)
    } catch (err) {
      setResults([])
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setIsLoading(false)
    }
  }

  async function onBuyNow(result: DomainResult) {
    const handle = typeof window !== 'undefined' ? window.localStorage.getItem('op_customer_handle') : null
    if (!handle) {
      router.push(`/signup?next=${encodeURIComponent(`/?domain=${result.domain}`)}`)
      return
    }

    if (!result.resellerPrice) {
      setError('Missing reseller price for checkout')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const [name, tld] = result.domain.split('.')
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: {
            kind: 'domain',
            domain: result.domain,
            name,
            tld,
            owner_handle: handle,
            resellerPrice: result.resellerPrice,
          },
        }),
      })

      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null
      if (!res.ok) throw new Error(data?.error || 'Checkout failed')
      if (!data?.url) throw new Error('Missing checkout URL')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="I’m starting a sustainable fashion brand called ‘Verde’."
                aria-label="Describe your project"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <Sparkles size={18} />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="h-12">
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} /> Scanning…
                </span>
              ) : (
                'Scan domains'
              )}
            </Button>
          </form>

          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        </CardHeader>

        <CardContent>
          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-800 p-6 text-sm text-zinc-500">
              Results will appear here.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((r) => {
                const isFree = r.status === 'free'

                return (
                  <div key={r.domain} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold tracking-tight">{r.domain}</div>
                        <div className="mt-1 text-xs text-zinc-400">
                          {isFree ? 'Available' : r.status === 'reserved' ? 'Reserved' : 'Taken'}
                        </div>
                      </div>

                      {r.is_premium ? (
                        <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-200">
                          Premium
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="text-sm text-zinc-200">
                        {r.price ? formatMoney(r.price.currency, r.price.amount) : '—'}
                      </div>

                      <Button variant={isFree ? 'primary' : 'secondary'} disabled={!isFree} onClick={() => onBuyNow(r)}>
                        Buy Now
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
