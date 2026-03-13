'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

export default function ChatHistorySkeleton() {
  return (
    <div className="space-y-4 px-4 py-3">
      {/* Welcome message skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-start"
      >
        <div className="max-w-[85%] rounded-2xl bg-zinc-800/50 p-4">
          <div className="h-4 w-48 animate-pulse rounded bg-zinc-700" />
          <div className="mt-2 h-3 w-16 animate-pulse rounded bg-zinc-700/50" />
        </div>
      </motion.div>

      {/* Additional skeleton messages to simulate loading */}
      {[1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex justify-start"
        >
          <div className="max-w-[85%] rounded-2xl bg-zinc-800/30 p-4">
            <div className="flex gap-2">
              <div className="h-3 w-32 animate-pulse rounded bg-zinc-700/30" />
              <div className="h-3 w-24 animate-pulse rounded bg-zinc-700/30" />
            </div>
            <div className="mt-2 h-3 w-16 animate-pulse rounded bg-zinc-700/30" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
