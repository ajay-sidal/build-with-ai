'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Clock,
  Globe,
  Layers,
  Network,
  Server,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

const features = [
  {
    icon: <Globe size={20} />,
    title: 'Global Anycast',
    description: 'Distributed network for fast resolution worldwide',
  },
  {
    icon: <Shield size={20} />,
    title: 'DNSSEC Support',
    description: 'Cryptographic security for your DNS records',
  },
  {
    icon: <Zap size={20} />,
    title: 'Instant Updates',
    description: 'Changes propagate within seconds',
  },
  {
    icon: <Server size={20} />,
    title: '99.99% Uptime',
    description: 'Highly reliable infrastructure',
  },
  {
    icon: <Layers size={20} />,
    title: 'All Record Types',
    description: 'A, AAAA, CNAME, MX, TXT, SRV, CAA & more',
  },
  {
    icon: <Network size={20} />,
    title: 'API Access',
    description: 'Full API for automation and integration',
  },
]

const recordTypes = [
  { type: 'A', description: 'Maps domain to IPv4 address' },
  { type: 'AAAA', description: 'Maps domain to IPv6 address' },
  { type: 'CNAME', description: 'Alias of one name to another' },
  { type: 'MX', description: 'Mail exchange records' },
  { type: 'TXT', description: 'Text records for verification' },
  { type: 'SRV', description: 'Service location records' },
  { type: 'CAA', description: 'Certificate authority authorization' },
  { type: 'NS', description: 'Nameserver records' },
  { type: 'PTR', description: 'Pointer records for reverse DNS' },
  { type: 'SOA', description: 'Start of authority (auto-managed)' },
]

export default function DNSHostingClient() {
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
            <Server size={24} />
          </div>
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              DNS Hosting
            </h1>
            <p className="mt-2 max-w-2xl text-pretty text-zinc-300">
              Free, reliable DNS hosting with global anycast network. Manage all your DNS records 
              through an intuitive interface or API with 99.99% uptime guarantee.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Uptime SLA', value: '99.99%' },
            { label: 'Record Types', value: '15+' },
            { label: 'Propagation', value: '< 60s' },
            { label: 'Price', value: 'Free' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-center">
              <div className="text-2xl font-semibold text-zinc-50">{stat.value}</div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
        className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2 text-zinc-200">
                {feature.icon}
              </div>
              <h3 className="font-medium text-zinc-100">{feature.title}</h3>
            </div>
            <p className="mt-3 text-sm text-zinc-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Record Types */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="mb-16"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-100">Supported Record Types</h2>
          <p className="mt-2 text-zinc-400">Complete DNS record management</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recordTypes.map((record) => (
            <div
              key={record.type}
              className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4"
            >
              <div className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-sm text-zinc-200">
                {record.type}
              </div>
              <div className="text-sm text-zinc-400">{record.description}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="mb-16"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-100">How It Works</h2>
          <p className="mt-2 text-zinc-400">Get started in minutes</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Add Domain',
              description: 'Create a new DNS zone for your domain',
              icon: <Globe size={24} />,
            },
            {
              step: '2',
              title: 'Configure Records',
              description: 'Add A, CNAME, MX and other records',
              icon: <Layers size={24} />,
            },
            {
              step: '3',
              title: 'Update Nameservers',
              description: 'Point your domain to our nameservers',
              icon: <Network size={24} />,
            },
          ].map((item) => (
            <div key={item.step} className="relative rounded-xl border border-zinc-800 bg-zinc-950/60 p-6">
              <div className="absolute -top-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-sm font-semibold text-zinc-100">
                {item.step}
              </div>
              <div className="mb-4 text-zinc-200">{item.icon}</div>
              <h3 className="font-medium text-zinc-100">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Pricing */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="mb-16"
      >
        <Card className="border-zinc-800 bg-zinc-950/60">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <Sparkles size={16} /> Simple Pricing
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-center">
              <div className="text-5xl font-semibold text-zinc-50">Free</div>
              <div className="mt-2 text-zinc-400">Included with every domain registration</div>
              <ul className="mx-auto mt-6 max-w-md space-y-3 text-left text-sm text-zinc-300">
                {[
                  'Unlimited DNS records',
                  'DNSSEC support included',
                  'Custom nameservers',
                  'DNS templates',
                  'API access',
                  'Zone file import/export',
                  'Real-time updates',
                  'Query analytics',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button onClick={() => (window.location.href = '/products')} className="mt-6 inline-flex items-center justify-center rounded-md bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200">
                Get Started
                <ArrowRight size={16} className="ml-2" />
              </Button>
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
      >
        <Card className="border-zinc-800 bg-gradient-to-r from-zinc-950 to-zinc-900">
          <CardContent className="p-8">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-100">Ready to Manage Your DNS?</h2>
                <p className="mt-2 text-zinc-400">
                  Start with our free DNS hosting for all your domains.
                </p>
              </div>
              <Button onClick={() => (window.location.href = '/products')} className="inline-flex items-center justify-center rounded-md bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200">
                View All Products
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  )
}
