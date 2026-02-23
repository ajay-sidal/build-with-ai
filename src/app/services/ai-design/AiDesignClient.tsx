'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BrainCircuit, Lock, ShieldCheck, Sparkles, Wand2 } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Textarea } from '../../../components/ui/textarea'

type Tier = 'starter' | 'pro'

type LeadPayload = {
  service: 'ai-design'
  tier: Tier
  name: string
  email: string
  company?: string
  message?: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

export default function AiDesignClient() {
  const [tier, setTier] = React.useState<Tier>('starter')
  const [form, setForm] = React.useState({ name: '', email: '', company: '', message: '' })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [status, setStatus] = React.useState<'idle' | 'ok' | 'error'>('idle')
  const [error, setError] = React.useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')
    setError(null)

    const payload: LeadPayload = {
      service: 'ai-design',
      tier,
      name: form.name.trim(),
      email: form.email.trim(),
      company: form.company.trim() || undefined,
      message: form.message.trim() || undefined,
    }

    try {
      const res = await fetch('/api/leads/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!res.ok) throw new Error(data?.error || 'Failed to submit inquiry')
      setStatus('ok')
      setForm({ name: '', email: '', company: '', message: '' })
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to submit inquiry')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16">
      <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Bespoke AI‑Native Web Design</h1>
            <p className="mt-2 max-w-2xl text-pretty text-zinc-300">
              Dark‑mode premium builds for founders who want speed, clarity, and an AI‑first conversion engine.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: <Sparkles size={16} />, title: 'AI-first UX', desc: 'Intent → UI without friction.' },
            { icon: <ShieldCheck size={16} />, title: 'Production-ready', desc: 'App Router, API routes, and integrations.' },
            { icon: <Lock size={16} />, title: 'Security posture', desc: 'Server-side secrets, client-side trust.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                <span className="text-zinc-200">{f.icon}</span>
                {f.title}
              </div>
              <div className="mt-2 text-sm text-zinc-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.section variants={fadeUp} transition={{ duration: 0.35 }}>
          <Card className="border-zinc-800 bg-zinc-950/60">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <Wand2 size={16} /> Pricing
              </div>
              <p className="mt-2 text-sm text-zinc-400">Two tiers. No confusion. Premium delivery.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  onClick={() => setTier('starter')}
                  className={`rounded-xl border p-5 text-left transition ${
                    tier === 'starter'
                      ? 'border-zinc-600 bg-zinc-950'
                      : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-sm font-medium text-zinc-100">Starter</div>
                  <div className="mt-1 text-2xl font-semibold text-zinc-50">$999</div>
                  <div className="mt-2 text-sm text-zinc-400">Landing + core flows + deployment.</div>
                </Button>

                <Button
                  type="button"
                  onClick={() => setTier('pro')}
                  className={`rounded-xl border p-5 text-left transition ${
                    tier === 'pro'
                      ? 'border-zinc-600 bg-zinc-950'
                      : 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-sm font-medium text-zinc-100">Pro</div>
                  <div className="mt-1 text-2xl font-semibold text-zinc-50">$2,499</div>
                  <div className="mt-2 text-sm text-zinc-400">SaaS-grade UX + checkout + ops dashboard.</div>
                </Button>
              </div>

              <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                <div className="text-sm font-medium text-zinc-100">Includes</div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                  <li className="flex items-center gap-2">
                    <ArrowRight size={14} className="text-zinc-400" /> Domain search + pricing UX
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight size={14} className="text-zinc-400" /> Secure API routing patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight size={14} className="text-zinc-400" /> Iteration sprint + handoff
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={fadeUp} transition={{ duration: 0.35 }}>
          <Card className="border-zinc-800 bg-zinc-950/60">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <Sparkles size={16} /> Lead capture
              </div>
              <p className="mt-2 text-sm text-zinc-400">Get a callback with a build plan and timeline.</p>
            </CardHeader>
            <CardContent>
              {status === 'ok' ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-200">
                  Inquiry received. We’ll reply soon.
                </div>
              ) : null}

              {status === 'error' && error ? (
                <div className="mb-4 rounded-xl border border-red-800/40 bg-red-950/20 p-4 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <form onSubmit={submit} className="grid gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    id="ai-design-name"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                  <Input
                    id="ai-design-email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>

                <Input
                  id="ai-design-company"
                  name="company"
                  placeholder="Company (optional)"
                  value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                />

                <Textarea
                  id="ai-design-message"
                  name="message"
                  className="min-h-32 w-full resize-y rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-200/20"
                  placeholder="What are you building?"
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-zinc-500">Selected tier: {tier.toUpperCase()}</div>
                  <Button type="submit" disabled={isSubmitting} className="h-12">
                    {isSubmitting ? 'Sending…' : 'Request consult'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>
    </main>
  )
}
