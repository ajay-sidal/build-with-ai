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
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { allServices } from '../../lib/openprovider-products'

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

export default function ServicesOverviewClient() {
  const router = useRouter()
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
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Professional Services
            </h1>
            <p className="mt-2 max-w-2xl text-pretty text-zinc-300">
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
            <Card className="group h-full border-zinc-800 bg-zinc-950/60 transition-all hover:border-zinc-700 hover:bg-zinc-950/80">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-zinc-200">
                    {iconMap[service.id] || <Layers size={24} />}
                  </div>
                  <h3 className="text-xl font-medium text-zinc-100">{service.name}</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">{service.description}</p>

                <div className="mt-6">
                  <div className="text-sm font-medium text-zinc-200">Features</div>
                  <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {service.features.slice(0, 6).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                        <ArrowRight size={14} className="mt-0.5 text-zinc-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-medium text-zinc-200">Benefits</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-300"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-medium text-zinc-200">Use Cases</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.useCases.map((useCase) => (
                      <span
                        key={useCase}
                        className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-400"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant="primary"
                    onClick={() => router.push(service.cta.url)}
                    className="inline-flex w-full items-center justify-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                  >
                    {service.cta.primary}
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* AI Design Service Card */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.35 }}
        >
          <Card className="group h-full border-zinc-800 bg-zinc-950/60 transition-all hover:border-zinc-700 hover:bg-zinc-950/80">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-zinc-200">
                  <Paintbrush size={24} />
                </div>
                <h3 className="text-xl font-medium text-zinc-100">Bespoke AI Design</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400">
                Premium dark-mode web design for AI-native brands. Bespoke, conversion-first, and production-ready.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { title: 'AI-first UX', desc: 'Intent → UI without friction' },
                  { title: 'Production-ready', desc: 'App Router, API routes' },
                  { title: 'Security posture', desc: 'Server-side secrets' },
                  { title: 'Fast delivery', desc: '2-4 week turnaround' },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
                    <div className="font-medium text-zinc-100">{item.title}</div>
                    <div className="text-sm text-zinc-400">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={() => router.push('/services/ai-design')}
                  className="inline-flex w-full items-center justify-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                >
                  Learn More
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
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
        <Card className="border-zinc-800 bg-zinc-950/60">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <Shield size={16} /> Why Choose Our Services
            </div>
          </CardHeader>
          <CardContent>
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
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-200">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium text-zinc-100">{item.title}</div>
                    <div className="text-sm text-zinc-400">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
        <Card className="border-zinc-800 bg-gradient-to-r from-zinc-950 to-zinc-900">
          <CardContent className="p-8">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-100">Ready to Get Started?</h2>
                <p className="mt-2 text-zinc-400">
                  Let us help you build the perfect infrastructure for your needs.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => router.push('/products')}
                  className="inline-flex items-center justify-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                >
                  Browse Products
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => router.push('/partners')}
                  className="inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
                >
                  Become a Partner
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  )
}
