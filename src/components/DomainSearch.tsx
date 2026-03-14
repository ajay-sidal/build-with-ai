'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { Input } from './ui/input'
import { formatCurrency } from '../utils/pricing'
import DynamicPromos, { type PromoCategory } from './DynamicPromos'

type DomainResult = {
  domain: string
  status: 'free' | 'active' | 'reserved'
  is_premium: boolean
  price?: { currency: string; amount: number }
  resellerPrice?: { currency: string; amount: number }
  isHot?: boolean
}

type ApiResponse = {
  query: string
  results: DomainResult[]
  warning?: string
  requestId?: string
}

function formatMoney(currency: string, amount: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

function classifyIntent(q: string): PromoCategory {
  const s = q.toLowerCase()

  const tech = ['ai', 'dev', 'cloud', 'saas', 'app', 'api', 'labs', 'infra', 'data']
  const creative = ['design', 'creative', 'art', 'music', 'photo', 'writer', 'portfolio', 'blog']

  if (creative.some((k) => s.includes(k))) return 'Creative'
  if (tech.some((k) => s.includes(k))) return 'Business'
  return 'Business'
}

export default function DomainSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [results, setResults] = React.useState<DomainResult[]>([])

  const promoCategory = React.useMemo(() => classifyIntent(query || ''), [query])

  const [alphaStats, setAlphaStats] = React.useState<{ remaining: number; limit: number } | null>(null)
  const [alphaUnlocked, setAlphaUnlocked] = React.useState(false)

  const checkoutState = searchParams.get('checkout')
  const checkoutDomain = searchParams.get('domain')
  const showUpsell = checkoutState === 'success' && Boolean(checkoutDomain)

  const [licenseLoading, setLicenseLoading] = React.useState(false)
  const [licenseError, setLicenseError] = React.useState<string | null>(null)

  const [licenseQuote, setLicenseQuote] = React.useState<
    | { currency: string; customerAmount: number }
    | null
  >(null)

  React.useEffect(() => {
    const unlocked = typeof window !== 'undefined' ? window.localStorage.getItem('alpha_unlocked') : null
    if (unlocked === '1') setAlphaUnlocked(true)
  }, [])

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/marketing/alpha-signup', { cache: 'no-store' })
        const json = (await res.json().catch(() => null)) as { remaining?: number; limit?: number } | null
        if (!res.ok) return
        const remaining = Number(json?.remaining)
        const limit = Number(json?.limit)
        if (!cancelled && Number.isFinite(remaining) && Number.isFinite(limit)) setAlphaStats({ remaining, limit })
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

  React.useEffect(() => {
    let cancelled = false
    if (!showUpsell) return

    ;(async () => {
      try {
        const res = await fetch('/api/licenses/plesk/quote', { cache: 'no-store' })
        const json = (await res.json().catch(() => null)) as
          | { quote?: { currency: string; customerAmount: number }; error?: string }
          | null

        if (!res.ok) throw new Error(json?.error || 'Failed to load license pricing')
        if (!json?.quote) throw new Error('Missing quote')

        if (!cancelled) setLicenseQuote(json.quote)
      } catch (err) {
        if (!cancelled) {
          setLicenseQuote(null)
          setLicenseError(err instanceof Error ? err.message : 'Failed to load license pricing')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [showUpsell])

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

      const requestId = res.headers.get('x-request-id') || undefined
      const data = (await res.json().catch(() => null)) as (ApiResponse & { error?: string }) | null

      if (!res.ok) {
        const msg = data?.error || 'Search failed'
        const ref = requestId || data?.requestId
        throw new Error(ref ? `${msg} (ref: ${ref})` : msg)
      }

      setResults(Array.isArray(data?.results) ? data!.results : [])
      const warning = data?.warning
      const ref = requestId || data?.requestId
      setError(warning ? (ref ? `${warning} (ref: ${ref})` : warning) : null)
    } catch (err) {
      setResults([])
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setIsLoading(false)
    }
  }

  async function onBuyNow(result: DomainResult) {
    const cookieHandle = typeof window !== 'undefined'
      ? document.cookie.match(/(?:^|; )bwai_user_id=([^;]+)/)?.[1] || null
      : null
    const handle = typeof window !== 'undefined'
      ? window.localStorage.getItem('op_customer_handle') || (cookieHandle ? decodeURIComponent(cookieHandle) : null)
      : null
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
          discountCode: alphaUnlocked ? 'ALPHA50' : undefined,
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

  async function onBuyLicense() {
    if (!checkoutDomain) return

    setLicenseLoading(true)
    setLicenseError(null)

    try {
      const res = await fetch('/api/checkout/license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain_name: checkoutDomain }),
      })

      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null
      if (!res.ok) throw new Error(data?.error || 'License checkout failed')
      if (!data?.url) throw new Error('Missing checkout URL')
      window.location.href = data.url
    } catch (err) {
      setLicenseError(err instanceof Error ? err.message : 'License checkout failed')
    } finally {
      setLicenseLoading(false)
    }
  }

  async function onShareUnlock() {
    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/`

    const text = 'Unlock $5 .digital domains + 50% off your first SSL — join BuildWithAI Alpha'
    const intent = `https://x.com/intent/post?text=${encodeURIComponent(`${text} ${shareUrl}`)}`

    try {
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        await (navigator as any).share({ text, url: shareUrl })
      } else if (typeof window !== 'undefined') {
        window.open(intent, '_blank', 'noopener,noreferrer')
      }
    } catch {
      // ignore
    }

    if (typeof window !== 'undefined') window.localStorage.setItem('alpha_unlocked', '1')
    setAlphaUnlocked(true)
  }

  return (
    <div className="w-full">
      <DynamicPromos category={promoCategory} />
      <Card>
        <CardHeader>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-300">
              <span className="uppercase tracking-widest text-zinc-500">Alpha Slots Remaining</span>
              <span className="font-mono text-zinc-100">
                {alphaStats ? `${alphaStats.remaining}/${alphaStats.limit}` : '—/1000'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" onClick={onShareUnlock}>
                Share on X to unlock $5.00 .digital domains
              </Button>
              {alphaUnlocked ? (
                <div className="rounded-full border border-emerald-800/40 bg-emerald-950/20 px-4 py-2 text-xs text-emerald-200">
                  Code unlocked: <span className="font-mono">ALPHA50</span>
                </div>
              ) : null}
            </div>
          </div>

          {showUpsell ? (
            <div className="mb-4 rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-4">
              <div className="text-sm font-medium text-emerald-200">Domain secured.</div>
              <div className="mt-1 text-xs text-zinc-300">
                Your registration is processing. Complete your setup with AI-native hosting.
              </div>

              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold tracking-tight text-zinc-100">AI‑Native Hosting</div>
                    <div className="mt-1 text-xs text-zinc-400">
                      Complete your setup. Add a Plesk Web Host license for{' '}
                      {licenseQuote
                        ? `${formatCurrency(licenseQuote.currency, licenseQuote.customerAmount)}/mo`
                        : '—/mo'}.
                      {' '}High-performance management for your new domain.
                    </div>
                  </div>

                  <Button type="button" onClick={onBuyLicense} disabled={licenseLoading || !licenseQuote}>
                    {licenseLoading ? 'Starting…' : 'Add Plesk'}
                  </Button>
                </div>

                {licenseError ? <div className="mt-3 text-xs text-red-300">{licenseError}</div> : null}
              </div>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Input
                id="domain-search-query"
                name="query"
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
                        <div className="flex items-center gap-2 text-base font-semibold tracking-tight">
                          <span>{r.domain}</span>
                          {r.isHot ? (
                            <span className="rounded-full border border-amber-800/40 bg-amber-950/20 px-2 py-0.5 text-[10px] font-medium text-amber-200">
                              HOT
                            </span>
                          ) : null}
                        </div>
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

                      <Button
                        variant={isFree ? 'primary' : 'secondary'}
                        disabled={!isFree}
                        onClick={isFree ? () => onBuyNow(r) : undefined}
                      >
                        {isFree ? 'Buy Now' : 'Unavailable'}
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
