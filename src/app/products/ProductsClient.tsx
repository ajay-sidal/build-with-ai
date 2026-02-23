'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Box,
  FileText,
  Globe,
  Key,
  Layers,
  Lock,
  Mail,
  Network,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import {
  allProducts,
  productCategories,
  tldCategories,
  type Product,
} from '../../lib/openprovider-products'

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe size={20} />,
  lock: <Lock size={20} />,
  'arrow-right-left': <ArrowRight size={20} />,
  'refresh-cw': <Sparkles size={20} />,
  shield: <Shield size={20} />,
  building: <Box size={20} />,
  'shield-check': <ShieldCheck size={20} />,
  asterisk: <Sparkles size={20} />,
  layers: <Layers size={20} />,
  'file-code': <FileText size={20} />,
  mail: <Mail size={20} />,
  server: <Server size={20} />,
  'file-template': <FileText size={20} />,
  network: <Network size={20} />,
  'mail-check': <Mail size={20} />,
  'shield-alert': <ShieldAlert size={20} />,
  send: <ArrowRight size={20} />,
  archive: <Box size={20} />,
  key: <Key size={20} />,
  box: <Box size={20} />,
}

function ProductCard({ product }: { product: Product }) {
  const router = useRouter()
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeUp}
      transition={{ duration: 0.35 }}
    >
      <Card className="group relative h-full border-zinc-800 bg-zinc-950/60 transition-all hover:border-zinc-700 hover:bg-zinc-950/80">
        {product.popular && (
          <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full border border-amber-800/50 bg-amber-950/80 px-3 py-1 text-xs font-medium text-amber-200">
            <Star size={12} />
            Popular
          </div>
        )}
        {product.new && (
          <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full border border-emerald-800/50 bg-emerald-950/80 px-3 py-1 text-xs font-medium text-emerald-200">
            <Sparkles size={12} />
            New
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3 text-zinc-200">
              {iconMap[product.icon] || <Globe size={20} />}
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
          <div className="mt-4">
            <h3 className="text-lg font-medium text-zinc-100">{product.name}</h3>
            {product.subcategory && (
              <div className="mt-1 text-xs text-zinc-400">{product.subcategory}</div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-400">{product.description}</p>

          <ul className="mt-4 space-y-2">
            {product.benefits.slice(0, 3).map((benefit) => (
              <li key={benefit} className="flex items-start gap-2 text-sm text-zinc-300">
                <ArrowRight size={14} className="mt-0.5 text-zinc-500" />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => router.push(product.cta.url)}
              className="inline-flex flex-1 items-center justify-center rounded-md bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              {product.cta.primary}
              <ArrowRight size={14} className="ml-2" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push(product.cta.url)}
              className="inline-flex items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-800"
            >
              {product.cta.secondary}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CategoryFilter({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: typeof productCategories
  activeCategory: string | null
  onSelect: (id: string | null) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          activeCategory === null
            ? 'bg-zinc-100 text-zinc-900'
            : 'border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
        }`}
        variant={activeCategory === null ? 'primary' : 'secondary'}
      >
        All Products
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
            activeCategory === category.id
              ? 'bg-zinc-100 text-zinc-900'
              : 'border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
          }`}
          variant={activeCategory === category.id ? 'primary' : 'secondary'}
        >
          {iconMap[category.icon]}
          {category.name}
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs">{category.count}</span>
        </Button>
      ))}
    </div>
  )
}

export default function ProductsClient() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null)

  const filteredProducts = activeCategory
    ? allProducts.filter((p) => {
        const categoryMap: Record<string, string> = {
          domains: 'Domains',
          ssl: 'SSL Certificates',
          dns: 'DNS Services',
          email: 'Email Services',
          'spam-experts': 'Spam Experts',
          'easy-dmarc': 'EasyDMARC',
          licenses: 'Licenses',
        }
        return p.category === categoryMap[activeCategory]
      })
    : allProducts

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
              Products & Services
            </h1>
            <p className="mt-2 max-w-2xl text-pretty text-zinc-300">
              Complete infrastructure solutions powered by OpenProvider. Domains, SSL, DNS, email security, and more.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Products', value: allProducts.length },
            { label: 'TLDs Available', value: '1,500+' },
            { label: 'SSL Brands', value: '10+' },
            { label: 'Uptime SLA', value: '99.99%' },
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
        <CategoryFilter
          categories={productCategories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
      </motion.div>

      {/* Products Grid */}
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>

      {/* TLD Categories Section */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-50px' }}
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="mt-16"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-100">Domain Extensions</h2>
          <p className="mt-2 text-zinc-400">Choose from over 1,500 TLDs worldwide</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tldCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5 transition hover:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-zinc-100">{category.name}</h3>
                <span className="text-sm text-zinc-400">from {category.startingPrice}</span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{category.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {category.extensions.map((ext) => (
                  <span
                    key={ext}
                    className="rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1 text-xs text-zinc-300"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
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
                <h2 className="text-2xl font-semibold text-zinc-100">Need a Custom Solution?</h2>
                <p className="mt-2 text-zinc-400">
                  Our team can help you design the perfect infrastructure for your needs.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" onClick={() => router.push('/services')} className="inline-flex items-center justify-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200">
                  View Services
                  <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button variant="secondary" onClick={() => router.push('/partners')} className="inline-flex items-center justify-center rounded-md border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800">
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
