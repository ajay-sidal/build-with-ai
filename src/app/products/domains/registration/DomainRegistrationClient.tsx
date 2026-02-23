'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Clock,
  Globe,
  Headphones,
  Lock,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '../../../../components/ui/card'
import { Input } from '../../../../components/ui/input'
import DomainSearch from '../../../../components/DomainSearch'

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

const features = [
  {
    icon: <Globe size={20} />,
    title: '1,500+ TLDs',
    description: 'Choose from generic, country-code, and new gTLDs',
  },
  {
    icon: <Zap size={20} />,
    title: 'Instant Activation',
    description: 'Your domain is active within minutes',
  },
  {
    icon: <Lock size={20} />,
    title: 'Free WHOIS Privacy',
    description: 'Keep your personal information private',
  },
  {
    icon: <Shield size={20} />,
    title: 'Domain Lock',
    description: 'Protect against unauthorized transfers',
  },
  {
    icon: <RefreshCw size={20} />,
    title: 'Auto-Renewal',
    description: 'Never lose your domain to expiration',
  },
  {
    icon: <Headphones size={20} />,
    title: '24/7 Support',
    description: 'Expert help whenever you need it',
  },
]

const pricingTiers = [
  {
    name: 'Standard TLDs',
    price: '$8.06',
    period: '/year',
    examples: ['.com', '.net', '.org', '.info'],
    features: ['Most popular extensions', 'Free DNS management', 'WHOIS privacy included', 'Email forwarding'],
    popular: false,
  },
  {
    name: 'Premium TLDs',
    price: '$35.00',
    period: '/year',
    examples: ['.io', '.ai', '.co', '.me'],
    features: ['Tech-focused extensions', 'Enhanced features', 'Priority support', 'Advanced DNS'],
    popular: true,
  },
  {
    name: 'Country Code',
    price: 'Varies',
    period: '',
    examples: ['.uk', '.de', '.nl', '.eu'],
    features: ['Local market targeting', 'Regional trust', 'Local presence options', 'Country-specific features'],
    popular: false,
  },
]

export default function DomainRegistrationClient() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState('')

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
            <Globe size={24} />
          </div>
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Domain Registration
            </h1>
            <p className="mt-2 max-w-2xl text-pretty text-zinc-300">
              Register your perfect domain name from over 1,500+ TLDs worldwide. Instant activation, competitive pricing, and comprehensive management.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Domain Search */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="mb-12"
      >
        <Card className="border-zinc-800 bg-zinc-950/60">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <Search size={16} /> Find Your Perfect Domain
            </div>
            <p className="text-sm text-zinc-400">Search for available domains across all extensions</p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-20" />}>
              <DomainSearch />
            </Suspense>
          </CardContent>
        </Card>
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

      {/* Pricing Tiers */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="mb-16"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-100">Pricing</h2>
          <p className="mt-2 text-zinc-400">Transparent pricing with no hidden fees</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={fadeUp}
              transition={{ duration: 0.35 }}
              className={`relative rounded-xl border p-6 ${
                tier.popular
                  ? 'border-zinc-600 bg-zinc-950'
                  : 'border-zinc-800 bg-zinc-950/60'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 right-4 flex items-center gap-1 rounded-full border border-amber-800/50 bg-amber-950/80 px-3 py-1 text-xs font-medium text-amber-200">
                  <Sparkles size={12} />
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-medium text-zinc-100">{tier.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold text-zinc-50">{tier.price}</span>
                  <span className="text-zinc-400">{tier.period}</span>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {tier.examples.map((ext) => (
                  <span
                    key={ext}
                    className="rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-xs text-zinc-300"
                  >
                    {ext}
                  </span>
                ))}
              </div>

              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check size={16} className="mt-0.5 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button variant="primary" onClick={() => router.push('/')} className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200">
                Get Started
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </motion.div>
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
          <p className="mt-2 text-zinc-400">Register your domain in 3 simple steps</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Search',
              description: 'Find your perfect domain name using our search tool',
              icon: <Search size={24} />,
            },
            {
              step: '2',
              title: 'Configure',
              description: 'Choose your TLD, registration period, and add-ons',
              icon: <Sparkles size={24} />,
            },
            {
              step: '3',
              title: 'Launch',
              description: 'Complete checkout and your domain is active instantly',
              icon: <Zap size={24} />,
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

      {/* Popular Extensions */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="mb-16"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-100">Popular Extensions</h2>
          <p className="mt-2 text-zinc-400">Choose from our most registered TLDs</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-zinc-400">Extension</th>
                <th className="px-4 py-3 text-left text-zinc-400">Description</th>
                <th className="px-4 py-3 text-right text-zinc-400">Price</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {[
                { ext: '.com', desc: 'Commercial - Most popular worldwide', price: '$8.06/year' },
                { ext: '.net', desc: 'Network - Tech and infrastructure', price: '$12.99/year' },
                { ext: '.org', desc: 'Organization - Non-profits and communities', price: '$11.99/year' },
                { ext: '.io', desc: 'Tech startups and SaaS companies', price: '$35.00/year' },
                { ext: '.ai', desc: 'Artificial intelligence and tech', price: '$65.00/year' },
                { ext: '.co', desc: 'Company - Business alternative to .com', price: '$24.99/year' },
              ].map((row) => (
                <tr key={row.ext} className="border-b border-zinc-800/50 last:border-0">
                  <td className="px-4 py-3 font-medium text-zinc-100">{row.ext}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.desc}</td>
                  <td className="px-4 py-3 text-right text-zinc-300">{row.price}</td>
                  <td className="px-4 py-3 text-right">
                      <Button variant="secondary" onClick={() => router.push('/')} className="inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-800">
                        Register
                        <ArrowRight size={14} className="ml-1" />
                      </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                <h2 className="text-2xl font-semibold text-zinc-100">Ready to Register?</h2>
                <p className="mt-2 text-zinc-400">
                  Start with our domain search tool to find your perfect name.
                </p>
              </div>
              <Button variant="primary" onClick={() => router.push('/')} className="inline-flex items-center justify-center rounded-md bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200">
                Search Domains
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  )
}
