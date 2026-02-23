'use client'

import { Suspense } from 'react'
import DomainSearch from '../components/DomainSearch'
import LaunchMagnet from '../components/LaunchMagnet'
import { motion } from 'framer-motion'
import { Sparkles, Shield, Zap, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-16 text-center"
      >
        {/* Brand Badge */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400 backdrop-blur-sm"
        >
          <Sparkles size={16} className="text-cyan-400" />
          <span>Powered by Advanced AI</span>
        </motion.div>

        {/* Main Headline */}
        <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent italic">Build With AI</span>
          <br />
          <span className="mt-2 block text-3xl sm:text-4xl lg:text-5xl text-zinc-100">
            Your Digital Future, Secured
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mt-6 max-w-3xl text-balance text-lg text-zinc-400 sm:text-xl">
          The world's first AI-driven platform for domain registration, zero-knowledge SSL, and instant DNS.
          Find and secure your brand in seconds.
        </p>

        {/* Feature Badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm"
          >
            <Globe size={16} className="text-cyan-400" />
            <span>1,500+ TLDs Available</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm"
          >
            <Shield size={16} className="text-cyan-400" />
            <span>Zero-Knowledge Security</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 backdrop-blur-sm"
          >
            <Zap size={16} className="text-cyan-400" />
            <span>Instant DNS Propagation</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Domain Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="flex-1"
      >
        <Suspense fallback={null}>
          <LaunchMagnet />
          <DomainSearch />
        </Suspense>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="mt-16 border-t border-zinc-800/50 pt-8 text-center"
      >
        <p className="text-sm text-zinc-500">
          Trusted by developers and businesses worldwide • Powered by OpenProvider • Secured with Enterprise-Grade Infrastructure
        </p>
      </motion.div>
    </main>
  )
}
