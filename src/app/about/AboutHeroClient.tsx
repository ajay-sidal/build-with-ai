'use client'

import { motion } from 'framer-motion'
import { Button } from '../../components/ui/button'
import DigitalCoreGraphic from './DigitalCoreGraphic'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export default function AboutHeroClient() {
  function openAlpha() {
    window.dispatchEvent(new Event('bwai:open-alpha-magnet'))
  }

  return (
    <section className="grid items-center gap-6 lg:grid-cols-2">
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="text-xs uppercase tracking-widest text-zinc-500">
          Our Vision
        </motion.div>

        <motion.h1 variants={item} className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          A registrar built for the next era of the internet.
        </motion.h1>

        <motion.p variants={item} className="mt-3 text-pretty text-sm text-zinc-300">
          Legacy registrars haven’t meaningfully innovated since 2005. They optimize for margins, lock-in, and upsells —
          not security, speed, or builders.
        </motion.p>

        <motion.p variants={item} className="mt-3 text-pretty text-sm text-zinc-300">
          BuildWithAI.digital is a digital utility built by developers, for the future. We ship zero-knowledge security
          patterns and AI-native provisioning flows because infrastructure should feel instant.
        </motion.p>

        <motion.p variants={item} className="mt-3 text-pretty text-sm text-zinc-300">
          Revenue from this platform directly funds the MARZ Project — our moonshot initiative to accelerate
          human‑AI collaboration and unlock new forms of progress.
        </motion.p>

        <motion.div variants={item} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={openAlpha} className="h-11">
            Join the Alpha
          </Button>
          <Button type="button" variant="secondary" className="h-11" onClick={() => (window.location.href = '/')}
          >
            Search domains
          </Button>
        </motion.div>
      </motion.div>

      <div className="lg:pl-6">
        <DigitalCoreGraphic />
      </div>
    </section>
  )
}
