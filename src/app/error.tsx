'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Zap } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function GlobalError(props: { error: Error & { digest?: string }; reset: () => void }) {
  const { error, reset } = props

  React.useEffect(() => {
    // Best-effort client crash logging
    fetch('/api/logs/client-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error?.message || 'Unknown error',
        stack: error?.stack,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      }),
    }).catch(() => {})
  }, [error])

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-6 px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8"
      >
        <div className="flex items-center gap-2 text-zinc-300">
          <Zap size={18} />
          <span className="text-xs uppercase tracking-widest">System Reboot Required</span>
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Something glitched.</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Your session is safe. Hit reboot to reload the interface.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Button type="button" onClick={reset} className="h-11">
            <RefreshCw size={16} className="mr-2" /> Reboot
          </Button>
          <div className="text-xs text-zinc-500">Digest: {error?.digest || '—'}</div>
        </div>

        <details className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
          <summary className="cursor-pointer text-sm text-zinc-300">Technical details</summary>
          <pre className="mt-3 whitespace-pre-wrap break-words text-xs text-zinc-400">{String(error?.stack || error?.message || '')}</pre>
        </details>
      </motion.div>
    </main>
  )
}
