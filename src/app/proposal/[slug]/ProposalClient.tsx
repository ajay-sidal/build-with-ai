'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Shield, Zap } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { calculateCustomerPrice, formatCurrency } from '../../../utils/pricing'

type ProposalScope = {
  aiDesign?: boolean
  domain?: { fqdn: string; resellerPrice: number }
  ssl?: { resellerPrice: number }
}

type ProposalData = {
  slug: string
  clientName: string
  scope: ProposalScope
  depositAmount: number
  currency: string
}

function msToClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export default function ProposalClient({ data }: { data: ProposalData }) {
  const [isPaying, setIsPaying] = React.useState(false)

  const deadline = React.useMemo(() => {
    const key = `proposal_deadline_${data.slug}`
    const existing = typeof window !== 'undefined' ? window.sessionStorage.getItem(key) : null
    const parsed = existing ? Number(existing) : NaN
    const d = Number.isFinite(parsed) ? parsed : Date.now() + 48 * 60 * 60 * 1000
    if (typeof window !== 'undefined' && !existing) window.sessionStorage.setItem(key, String(d))
    return d
  }, [data.slug])

  const [now, setNow] = React.useState(() => Date.now())
  React.useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])

  const remaining = Math.max(0, deadline - now)

  const items = React.useMemo(() => {
    const list: Array<{ label: string; amount: number }> = []
    list.push({ label: 'AI Design Service Sprint (Deposit)', amount: data.depositAmount })

    if (data.scope.domain) {
      list.push({
        label: `Domain + Instant DNS (${data.scope.domain.fqdn})`,
        amount: calculateCustomerPrice(data.scope.domain.resellerPrice, 'DOMAIN'),
      })
    }

    if (data.scope.ssl) {
      list.push({
        label: 'Zero-Knowledge SSL Order',
        amount: calculateCustomerPrice(data.scope.ssl.resellerPrice, 'SSL'),
      })
    }

    return list
  }, [data.depositAmount, data.scope.domain, data.scope.ssl])

  async function payDeposit() {
    setIsPaying(true)
    try {
      const res = await fetch('/api/checkout/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: data.slug }),
      })
      const json = (await res.json().catch(() => null)) as { url?: string; error?: string } | null
      if (!res.ok) throw new Error(json?.error || 'Checkout failed')
      if (!json?.url) throw new Error('Missing checkout URL')
      window.location.href = json.url
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-6 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/35">
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Bespoke Digital Strategy for {data.clientName}
          </h1>
          <p className="mt-2 max-w-3xl text-pretty text-zinc-300">
            A $10,000-style proposal built for speed: instant digital identity, a security vault, and an AI-native core.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200">
            Proposal expires in <span className="font-mono">{msToClock(remaining)}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-zinc-800 bg-zinc-950/60 lg:col-span-2">
          <CardHeader>
            <div className="text-sm font-medium text-zinc-200">Value stack</div>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-3">
              <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                  <Zap size={16} /> Instant Digital Identity
                </div>
                <p className="mt-2 text-sm text-zinc-400">Automated Domain & DNS provisioning.</p>
              </li>
              <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                  <Shield size={16} /> Security Vault
                </div>
                <p className="mt-2 text-sm text-zinc-400">Zero‑knowledge SSL and safe CSR generation.</p>
              </li>
              <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                  <Lock size={16} /> AI‑Native Core
                </div>
                <p className="mt-2 text-sm text-zinc-400">Next.js 14 performance, SEO, and secure routing.</p>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/60">
          <CardHeader>
            <div className="text-sm font-medium text-zinc-200">Price transparency</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((i) => (
                <div key={i.label} className="flex items-start justify-between gap-3 text-sm">
                  <div className="text-zinc-300">{i.label}</div>
                  <div className="font-medium text-zinc-50">{formatCurrency(data.currency, i.amount)}</div>
                </div>
              ))}

              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <Button className="h-12 w-full" onClick={payDeposit} disabled={isPaying}>
                  Secure My Slot & Pay Deposit
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <p className="mt-2 text-xs text-zinc-500">$999 deposit reserves your build sprint window.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
