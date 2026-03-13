'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Boxes, Eye, ShoppingCart, Sparkles } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'

type TemplateSku = 'nextjs-ai-boilerplates' | 'tailwind-pro-ui-kits'

type Product = {
  sku: TemplateSku
  title: string
  description: string
  badge: string
  previewHref: string
}

const PRODUCTS: Product[] = [
  {
    sku: 'nextjs-ai-boilerplates',
    title: 'Next.js AI Boilerplates',
    description: 'App Router scaffolding + AI-first flows + server-secure patterns.',
    badge: 'Ship faster',
    previewHref: '#',
  },
  {
    sku: 'tailwind-pro-ui-kits',
    title: 'Tailwind Pro UI Kits',
    description: 'High-contrast dark-mode components for modern SaaS storefronts.',
    badge: 'High fidelity',
    previewHref: '#',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

export default function TemplatesClient() {
  const [error, setError] = React.useState<string | null>(null)
  const [loadingSku, setLoadingSku] = React.useState<string | null>(null)

  async function buyNow(sku: TemplateSku) {
    setLoadingSku(sku)
    setError(null)

    try {
      const res = await fetch('/api/checkout/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku }),
      })

      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null
      if (!res.ok) throw new Error(data?.error || 'Checkout failed')
      if (!data?.url) throw new Error('Missing checkout URL')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setLoadingSku(null)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16">
      <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <Boxes size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
            <p className="mt-1 text-sm text-zinc-400">Digital products built for AI-native shipping.</p>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-800/40 bg-red-950/20 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </motion.div>

      <motion.div
        className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        {PRODUCTS.map((p) => (
          <motion.div key={p.sku} variants={fadeUp} transition={{ duration: 0.35 }}>
            <Card className="border-zinc-800 bg-zinc-950/60">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-zinc-50">{p.title}</div>
                    <div className="mt-1 text-sm text-zinc-400">{p.description}</div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-200">
                    <Sparkles size={12} /> {p.badge}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => { window.location.href = p.previewHref }}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 text-sm font-medium text-zinc-50 hover:bg-zinc-900"
                    variant="secondary"
                  >
                    <Eye size={16} /> Preview
                  </Button>

                  <Button className="h-12 flex-1" onClick={() => buyNow(p.sku)} disabled={loadingSku === p.sku}>
                    <ShoppingCart size={16} className="mr-2" />
                    {loadingSku === p.sku ? 'Redirecting…' : 'Buy Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </main>
  )
}
