'use client'

import { motion } from 'framer-motion'

export default function DigitalCoreGraphic() {
  return (
    <div className="relative h-[340px] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900/20" />

      <motion.div
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-700/80 bg-zinc-950"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-800/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-700/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
      />

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-emerald-400/40"
          style={{
            left: `${15 + i * 13}%`,
            top: `${20 + ((i % 3) * 18)}%`,
          }}
          animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
        <div className="text-xs uppercase tracking-widest text-zinc-500">Digital Infrastructure Core</div>
        <div className="mt-1 text-sm text-zinc-200">Always-on provisioning, audit trails, and durable state.</div>
      </div>
    </div>
  )
}
