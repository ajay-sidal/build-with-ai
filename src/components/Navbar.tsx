'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, Sparkles, ChevronDown, Globe, Shield, Server, Mail, Box, Key } from 'lucide-react'

const mainNavItems = [
  { href: '/', label: 'Domain Search' },
  { href: '/ssl', label: 'SSL Vault' },
  { href: '/developers', label: 'Developers' },
  { href: '/partners', label: 'Partners' },
  { href: '/about', label: 'About' },
  { href: '/membership', label: 'Membership' },
]

const productDropdown = [
  {
    category: 'Domains',
    icon: <Globe size={16} />,
    items: [
      { href: '/products/domains/registration', label: 'Domain Registration' },
      { href: '/products/tlds', label: 'TLD Explorer' },
    ],
  },
  {
    category: 'SSL Certificates',
    icon: <Shield size={16} />,
    items: [
      { href: '/products/ssl', label: 'All SSL Certificates' },
      { href: '/ssl', label: 'SSL Vault (CSR + Order)' },
    ],
  },
  {
    category: 'DNS Services',
    icon: <Server size={16} />,
    items: [
      { href: '/products/dns/hosting', label: 'DNS Hosting' },
      { href: '/products/dns/templates', label: 'DNS Templates' },
      { href: '/products/dns/nameservers', label: 'Nameserver Groups' },
    ],
  },
  {
    category: 'Email & Security',
    icon: <Mail size={16} />,
    items: [
      { href: '/products/email/verification', label: 'Email Verification' },
      { href: '/products/email/templates', label: 'Email Templates' },
      { href: '/products/spam-experts', label: 'Spam Experts' },
      { href: '/products/easy-dmarc', label: 'EasyDMARC' },
    ],
  },
  {
    category: 'Templates',
    icon: <Box size={16} />,
    items: [{ href: '/products/templates', label: 'Templates Storefront' }],
  },
  {
    category: 'Licenses',
    icon: <Key size={16} />,
    items: [
      { href: '/products/licenses/plesk', label: 'Plesk Licenses' },
      { href: '/products/licenses/virtuozzo', label: 'Virtuozzo Licenses' },
    ],
  },
]

const serviceItems = [
  { href: '/services', label: 'Services Overview' },
  { href: '/services/customer-management', label: 'Customer Management' },
  { href: '/services/ai-design', label: 'AI Design' },
]

export default function Navbar() {
  const [open, setOpen] = React.useState(false)
  const [productsOpen, setProductsOpen] = React.useState(false)
  const [servicesOpen, setServicesOpen] = React.useState(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-50"
    >
      <div className="mx-auto w-full max-w-6xl px-6 pt-6">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/35">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-50">
              <span className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                <Sparkles size={16} />
              </span>
              BuildWithAI.digital
            </Link>

            <nav className="hidden items-center gap-1 sm:flex">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50"
                >
                  {item.label}
                </Link>
              ))}
              <div className="relative">
                <button
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50"
                >
                  Products
                  <ChevronDown size={14} className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      onMouseEnter={() => setProductsOpen(true)}
                      onMouseLeave={() => setProductsOpen(false)}
                      className="absolute left-0 top-full z-50 mt-2 w-[600px] rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-xl"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {productDropdown.map((group) => (
                          <div key={group.category}>
                            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-400">
                              {group.icon}
                              {group.category}
                            </div>
                            <div className="space-y-1">
                              {group.items.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="block rounded-md px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative">
                <button
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50"
                >
                  Services
                  <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                      className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-xl"
                    >
                      {serviceItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href="/dashboard/billing"
                className="ml-1 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-900"
              >
                  Admin
              </Link>
              <Link href="/admin/dashboard" className="text-sm font-medium text-zinc-200 hover:text-blue-400">Admin</Link>
              <Link href="/affiliate" className="text-sm font-medium text-zinc-200 hover:text-blue-400">Affiliate</Link>
            </nav>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-900 sm:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden sm:hidden"
              >
                <div className="border-t border-zinc-800/80 px-4 py-3">
                  <div className="grid gap-1">
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-zinc-800 pt-2">
                      <div className="px-3 py-2 text-xs font-medium text-zinc-400">Products</div>
                      {productDropdown.map((group) => (
                        <div key={group.category} className="mb-3">
                          <div className="px-3 py-1 text-xs text-zinc-500">{group.category}</div>
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block rounded-lg px-6 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50"
                              onClick={() => setOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-zinc-800 pt-2">
                      <div className="px-3 py-2 text-xs font-medium text-zinc-400">Services</div>
                      {serviceItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/dashboard/billing"
                      className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-900"
                      onClick={() => setOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}
