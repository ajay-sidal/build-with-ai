'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Asterisk,
  Building,
  Check,
  FileCode,
  Layers,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '../../../components/ui/card'
import { sslProducts } from '../../../lib/openprovider-products'

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

const iconMap: Record<string, React.ReactNode> = {
  lock: <Lock size={20} />,
  building: <Building size={20} />,
  'shield-check': <ShieldCheck size={20} />,
  asterisk: <Asterisk size={20} />,
  layers: <Layers size={20} />,
  'file-code': <FileCode size={20} />,
  mail: <Mail size={20} />,
}

const categoryFilter = [
  { id: 'all', name: 'All Certificates' },
  { id: 'Domain Validation', name: 'Domain Validation' },
  { id: 'Organization Validation', name: 'Organization Validation' },
  { id: 'Extended Validation', name: 'Extended Validation' },
  { id: 'Wildcard', name: 'Wildcard' },
  { id: 'Multi-Domain', name: 'Multi-Domain' },
  { id: 'Code Signing', name: 'Code Signing' },
  { id: 'Email Security', name: 'Email Security' },
]

export default function SSLProductsClient() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = React.useState('all')

  const filteredProducts = activeCategory === 'all'
    ? sslProducts
    : sslProducts.filter(p => p.subcategory === activeCategory || p.category === activeCategory)

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
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              SSL Certificates
            </h1>
            <p className="mt-2 max-w-2xl text-pretty text-zinc-300">
              Secure your website with SSL certificates from trusted Certificate Authorities. 
              Domain Validation, Organization Validation, Extended Validation, Wildcard, and more.
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Certificate Authorities', value: '10+' },
            { label: 'Compatibility', value: '99.9%' },
            { label: 'Issuance Time', value: 'Minutes' },
            { label: 'Warranty', value: 'Up to $1.75M' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-center">
              <div className="text-2xl font-semibold text-zinc-50">{stat.value}</div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-wrap gap-2">
          {categoryFilter.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === category.id
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
              variant={activeCategory === category.id ? 'primary' : 'secondary'}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            variants={fadeUp}
            transition={{ duration: 0.35 }}
          >
            <Card className="group h-full border-zinc-800 bg-zinc-950/60 transition-all hover:border-zinc-700 hover:bg-zinc-950/80">
              {product.popular && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full border border-amber-800/50 bg-amber-950/80 px-3 py-1 text-xs font-medium text-amber-200">
                  <Star size={12} />
                  Popular
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-zinc-200">
                      {iconMap[product.icon] || <Shield size={20} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-zinc-100">{product.name}</h3>
                      {product.subcategory && (
                        <div className="text-xs text-zinc-400">{product.subcategory}</div>
                      )}
                    </div>
                  </div>
                  {product.pricing && (
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-zinc-50">
                        ${product.pricing.startingFrom}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {product.pricing.currency} {product.pricing.period}
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">{product.description}</p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {product.benefits.slice(0, 4).map((benefit) => (
                    <div key={benefit} className="flex items-start gap-2">
                      <Check size={14} className="mt-0.5 text-emerald-500" />
                      <span className="text-sm text-zinc-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                {product.pricing?.tiers && (
                  <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4">
                    <div className="text-xs font-medium text-zinc-400">Available Options:</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {product.pricing.tiers.map((tier) => (
                        <div
                          key={tier.name}
                          className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs"
                        >
                          <div className="font-medium text-zinc-200">{tier.name}</div>
                          <div className="text-zinc-400">{tier.price}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/products/ssl/${product.slug}`)}
                    className="inline-flex flex-1 items-center justify-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
                  >
                    {product.cta.primary}
                    <ArrowRight size={14} className="ml-2" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push(`/products/ssl/${product.slug}`)}
                    className="inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800"
                  >
                    {product.cta.secondary}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* SSL Guide */}
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
              <Sparkles size={16} /> SSL Certificate Guide
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Domain Validation (DV)',
                  description: 'Fastest issuance, basic validation. Perfect for blogs and personal sites.',
                  icon: <Lock size={20} />,
                  price: 'From $9.99/year',
                },
                {
                  title: 'Organization Validation (OV)',
                  description: 'Business verification included. Ideal for company websites and e-commerce.',
                  icon: <Building size={20} />,
                  price: 'From $49.99/year',
                },
                {
                  title: 'Extended Validation (EV)',
                  description: 'Highest validation level. Maximum trust for financial and enterprise sites.',
                  icon: <ShieldCheck size={20} />,
                  price: 'From $149.99/year',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                  <div className="mb-3 text-zinc-200">{item.icon}</div>
                  <h4 className="font-medium text-zinc-100">{item.title}</h4>
                  <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
                  <div className="mt-3 text-sm font-medium text-zinc-300">{item.price}</div>
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
                <h2 className="text-2xl font-semibold text-zinc-100">Need Help Choosing?</h2>
                <p className="mt-2 text-zinc-400">
                  Our SSL experts can help you select the perfect certificate for your needs.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => router.push('/services')}
                className="inline-flex items-center justify-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                Contact Sales
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  )
}
