'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { Input } from './ui/input'

type AlphaStats = { count: number; remaining: number; limit: number }

type SignupResponse =
  | ({ ok: true; already: boolean } & AlphaStats)
  | ({ error: string } & Partial<AlphaStats>)

export default function LaunchMagnet() {
  const [open, setOpen] = React.useState(true)
  const [email, setEmail] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [done, setDone] = React.useState<{ already: boolean } | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/marketing/alpha-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })

      const json = (await res.json().catch(() => null)) as SignupResponse | null
      if (!res.ok) throw new Error((json as any)?.error || 'Signup failed')

      setDone({ already: Boolean((json as any)?.already) })
    } catch (err) {
      setDone(null)
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Join the AI Infrastructure Alpha"
          >
            <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/55">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-zinc-400">AI Infrastructure Alpha</div>
                    <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-zinc-50">
                      Join the AI Infrastructure Alpha
                    </h2>
                    <p className="mt-2 text-sm text-zinc-300">
                      Be one of the first 1,000. Get wholesale pricing on your first domain + a Free “AI Deployment”
                      Template.
                    </p>
                  </div>

                  <Button type="button" variant="secondary" onClick={() => setOpen(false)} aria-label="Close">
                    <X size={18} />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {done ? (
                  <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-4 text-sm text-emerald-200">
                    {done.already ? 'You’re already on the list.' : 'You’re in. Welcome to the Alpha.'}
                    <div className="mt-2 text-xs text-zinc-300">You can close this and continue domain search.</div>
                  </div>
                ) : (
                  <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        inputMode="email"
                        autoComplete="email"
                        aria-label="Email address"
                      />
                    </div>

                    <Button type="submit" disabled={submitting} className="h-12">
                      {submitting ? 'Joining…' : 'Join Alpha'}
                    </Button>
                  </form>
                )}

                {error ? <div className="mt-3 text-xs text-red-300">{error}</div> : null}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
