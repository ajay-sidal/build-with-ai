'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Code,
  Globe,
  Layers,
  Lock,
  Paintbrush,
  Shield,
  Users,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useRouter } from 'next/navigation'
import { allServices } from '../../lib/openprovider-products'
import { DESIGN_TOKENS } from '@/constants/design-tokens'

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe size={24} />,
  lock: <Lock size={24} />,
  code: <Code size={24} />,
  layers: <Layers size={24} />,
  users: <Users size={24} />,
  paintbrush: <Paintbrush size={24} />,
  shield: <Shield size={24} />,
}

const cardHoverStyles = {
  borderColor: DESIGN_TOKENS.colors.brand.teal,
  boxShadow: `0 8px 32px 0 rgba(20, 184, 166, 0.15)`,
}

const cardBaseStyles = {
  borderColor: DESIGN_TOKENS.colors.border.subtle,
  boxShadow: DESIGN_TOKENS.effects.cardShadow,
}

export default function ServicesOverviewClient() {
  const router = useRouter()

  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.brand.teal;
    e.currentTarget.style.boxShadow = cardHoverStyles.boxShadow;
  }

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.border.subtle;
    e.currentTarget.style.boxShadow = DESIGN_TOKENS.effects.cardShadow;
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-16">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl border p-3"
            style={{
              borderColor: DESIGN_TOKENS.colors.border.subtle,
              backgroundColor: DESIGN_TOKENS.colors.background.surface,
            }}
          >
            <Layers size={24} className="text-teal-400" />
          </div>
          <div>
            <h1
              className="text-balance text-3xl font-semibold sm:text-4xl text-white"
              style={{ letterSpacing: DESIGN_TOKENS.typography.tracking.widest }}
            >
              Professional Services
            </h1>
            <p className="mt-2 max-w-2xl text-pretty text-neutral-400">
              Beyond products: comprehensive services to help you manage, integrate, and scale your digital infrastructure.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Services Grid */}
      <motion.div
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      >
        {allServices.map((service) => (
          <motion.div
            key={service.id}
            variants={fadeUp}
            transition={{ duration: 0.35 }}
          >
            <div
              className="group h-full rounded-3xl border p-6 transition-all duration-300 bg-[#0a0a0a]"
              style={cardBaseStyles}
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="rounded-xl border p-3"
                    style={{
                      borderColor: DESIGN_TOKENS.colors.border.subtle,
                      backgroundColor: DESIGN_TOKENS.colors.background.surface,
                    }}
                  >
                    {iconMap[service.id] || <Layers size={24} className="text-teal-400" />}
                  </div>
                  <h3
                    className="text-xl font-bold text-white"
                    style={{ letterSpacing: DESIGN_TOKENS.typography.tracking.widest }}
                  >
                    {service.name}
                  </h3>
                </div>
              </div>

              <p className="text-neutral-400 mb-6">{service.description}</p>

              <div className="mb-6">
                <div className="text-sm font-bold uppercase mb-3" style={{ color: DESIGN_TOKENS.colors.brand.teal, letterSpacing: "0.1em" }}>Features</div>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {service.features.slice(0, 6).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-neutral-300">
                      <ArrowRight size={14} className="mt-0.5 text-teal-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold uppercase mb-3" style={{ color: DESIGN_TOKENS.colors.brand.teal, letterSpacing: "0.1em" }}>Benefits</div>
                <div className="flex flex-wrap gap-2">
                  {service.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="rounded-full border px-3 py-1 text-xs"
                      style={{
                        borderColor: `rgba(20, 184, 166, 0.3)`,
                        backgroundColor: `rgba(20, 184, 166, 0.05)`,
                        color: DESIGN_TOKENS.colors.brand.tealGlow,
                      }}
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-bold uppercase mb-3" style={{ color: DESIGN_TOKENS.colors.brand.teal, letterSpacing: "0.1em" }}>Use Cases</div>
                <div className="flex flex-wrap gap-2">
                  {service.useCases.map((useCase) => (
                    <span
                      key={useCase}
                      className="rounded-md border px-3 py-1.5 text-xs"
                      style={{
                        borderColor: DESIGN_TOKENS.colors.border.subtle,
                        backgroundColor: DESIGN_TOKENS.colors.background.surface,
                        color: DESIGN_TOKENS.colors.text.secondary,
                      }}
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Button
                  variant="primary"
                  onClick={() => router.push(service.cta.url)}
                  className="inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold uppercase transition-all"
                  style={{
                    backgroundColor: DESIGN_TOKENS.colors.brand.teal,
                    color: '#0a0a0a',
                    letterSpacing: "0.1em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = DESIGN_TOKENS.colors.brand.tealGlow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = DESIGN_TOKENS.colors.brand.teal;
                  }}
                >
                  {service.cta.primary}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* AI Design Service Card - Enhanced */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.35 }}
        >
          <div
            className="group relative h-full rounded-3xl border p-6 transition-all duration-300 bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] overflow-hidden"
            style={cardBaseStyles}
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            {/* Animated gradient overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: DESIGN_TOKENS.effects.glassGradient }}
            />

            <div className="relative z-10">
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="rounded-xl border p-3 bg-teal-500/10"
                    style={{ borderColor: `rgba(20, 184, 166, 0.3)` }}
                  >
                    <Paintbrush size={24} className="text-teal-400" />
                  </div>
                  <h3
                    className="text-xl font-bold text-white"
                    style={{ letterSpacing: DESIGN_TOKENS.typography.tracking.widest }}
                  >
                    Bespoke AI Design
                  </h3>
                </div>
              </div>

              <p className="text-neutral-400 mb-6">
                Premium dark-mode web design for AI-native brands. Bespoke, conversion-first, and production-ready.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-6">
                {[
                  { title: 'AI-first UX', desc: 'Intent → UI without friction' },
                  { title: 'Production-ready', desc: 'App Router, API routes' },
                  { title: 'Security posture', desc: 'Server-side secrets' },
                  { title: 'Fast delivery', desc: '2-4 week turnaround' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border p-4"
                    style={{
                      borderColor: DESIGN_TOKENS.colors.border.subtle,
                      backgroundColor: DESIGN_TOKENS.colors.background.surface,
                    }}
                  >
                    <div className="font-bold text-white text-sm uppercase mb-1" style={{ letterSpacing: "0.05em" }}>{item.title}</div>
                    <div className="text-sm text-neutral-400">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div>
                <Button
                  variant="primary"
                  onClick={() => router.push('/services/ai-design')}
                  className="inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold uppercase transition-all"
                  style={{
                    backgroundColor: DESIGN_TOKENS.colors.brand.tealGlow,
                    color: '#0a0a0a',
                    letterSpacing: "0.1em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = DESIGN_TOKENS.colors.brand.teal;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = DESIGN_TOKENS.colors.brand.tealGlow;
                  }}
                >
                  Learn More
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="mt-16"
      >
        <div
          className="rounded-3xl border p-8 bg-[#0a0a0a]"
          style={cardBaseStyles}
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm font-bold uppercase" style={{ color: DESIGN_TOKENS.colors.brand.teal, letterSpacing: "0.15em" }}>
              <Shield size={16} /> Why Choose Our Services
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Expert Support',
                description: '24/7 technical support from infrastructure experts',
                icon: <Users size={20} />,
              },
              {
                title: 'API-First',
                description: 'Full API access for seamless automation',
                icon: <Code size={20} />,
              },
              {
                title: 'Scalable',
                description: 'Grow from 1 to 10,000+ domains effortlessly',
                icon: <Layers size={20} />,
              },
              {
                title: 'Secure',
                description: 'Enterprise-grade security and compliance',
                icon: <Shield size={20} />,
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div
                  className="rounded-lg border p-2"
                  style={{
                    borderColor: DESIGN_TOKENS.colors.border.subtle,
                    backgroundColor: DESIGN_TOKENS.colors.background.surface,
                  }}
                >
                  <div className="text-teal-400">{item.icon}</div>
                </div>
                <div>
                  <div className="font-bold text-white text-sm uppercase mb-1" style={{ letterSpacing: "0.05em" }}>{item.title}</div>
                  <div className="text-sm text-neutral-400">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="mt-16"
      >
        <div
          className="rounded-3xl border p-8 bg-gradient-to-r from-[#0a0a0a] to-[#0f0f0f]"
          style={{
            borderColor: `rgba(20, 184, 166, 0.3)`,
            boxShadow: `0 8px 32px 0 rgba(20, 184, 166, 0.1)`,
          }}
        >
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: DESIGN_TOKENS.typography.tracking.widest }}>Ready to Get Started?</h2>
              <p className="mt-2 text-neutral-400">
                Let us help you build the perfect infrastructure for your needs.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => router.push('/products')}
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold uppercase transition-all"
                style={{
                  backgroundColor: DESIGN_TOKENS.colors.brand.teal,
                  color: '#0a0a0a',
                  letterSpacing: "0.1em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = DESIGN_TOKENS.colors.brand.tealGlow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = DESIGN_TOKENS.colors.brand.teal;
                }}
              >
                Browse Products
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/partners')}
                className="inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-bold uppercase transition-all"
                style={{
                  borderColor: DESIGN_TOKENS.colors.border.subtle,
                  backgroundColor: DESIGN_TOKENS.colors.background.surface,
                  color: DESIGN_TOKENS.colors.text.secondary,
                  letterSpacing: "0.1em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.brand.teal;
                  e.currentTarget.style.color = DESIGN_TOKENS.colors.brand.teal;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = DESIGN_TOKENS.colors.border.subtle;
                  e.currentTarget.style.color = DESIGN_TOKENS.colors.text.secondary;
                }}
              >
                Become a Partner
              </Button>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  )
}
