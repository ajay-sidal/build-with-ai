'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Sparkles, ChevronDown, Globe, Shield, Server, Mail, Box, Key, LogOut } from 'lucide-react'

// Main navigation items (always visible)
const mainNavItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/services', label: 'Services' },
  { href: '/developers', label: 'Developers' },
  { href: '/partners', label: 'Partners' },
  { href: '/about', label: 'About' },
]

// Products dropdown menu
const productDropdown = [
  {
    category: 'Domains',
    icon: <Globe size={16} />,
    items: [
      { href: '/products/domains/registration', label: 'Domain Registration' },
      { href: '/products/domains/transfer', label: 'Domain Transfer' },
      { href: '/products/tlds', label: 'TLD Explorer' },
    ],
  },
  {
    category: 'SSL Certificates',
    icon: <Shield size={16} />,
    items: [
      { href: '/products/ssl', label: 'All SSL Certificates' },
      { href: '/ssl', label: 'SSL Vault' },
      { href: '/products/ssl/domain-validation', label: 'Domain Validation' },
      { href: '/products/ssl/organization-validation', label: 'Organization Validation' },
      { href: '/products/ssl/extended-validation', label: 'Extended Validation' },
      { href: '/products/ssl/wildcard', label: 'Wildcard SSL' },
      { href: '/products/ssl/multi-domain', label: 'Multi-Domain SSL' },
      { href: '/products/ssl/code-signing', label: 'Code Signing' },
    ],
  },
  {
    category: 'DNS Services',
    icon: <Server size={16} />,
    items: [
      { href: '/products/dns/hosting', label: 'DNS Hosting' },
      { href: '/products/dns/templates', label: 'DNS Templates' },
      { href: '/products/dns/nameservers', label: 'Nameserver Groups' },
      { href: '/products/premium-dns', label: 'Premium DNS' },
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

// Services dropdown menu
const serviceItems = [
  { href: '/services', label: 'Services Overview' },
  { href: '/services/customer-management', label: 'Customer Management' },
  { href: '/services/ai-design', label: 'AI Design' },
  { href: '/services/domain-management', label: 'Domain Management' },
  { href: '/services/ssl-management', label: 'SSL Management' },
]

export default function Navbar() {
  const { data: session, status } = useSession()
  const [open, setOpen] = React.useState(false)
  const [productsOpen, setProductsOpen] = React.useState(false)
  const [servicesOpen, setServicesOpen] = React.useState(false)

  const isLoading = status === 'loading'
  const isAuthenticated = !!session

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-50"
    >
      <div className="mx-auto w-full max-w-7xl px-6 pt-6">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/35">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-50">
              <span className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                <Sparkles size={16} />
              </span>
              BuildWithAI.digital
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 lg:flex">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {/* Products Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setProductsOpen(true)}
                  onMouseLeave={() => setProductsOpen(false)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition-colors"
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
                      className="absolute left-0 top-full z-50 mt-2 w-[700px] rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl"
                    >
                      <div className="grid grid-cols-3 gap-5">
                        {productDropdown.map((group) => (
                          <div key={group.category}>
                            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                              {group.icon}
                              {group.category}
                            </div>
                            <div className="space-y-2">
                              {group.items.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="block rounded-md px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50 transition-colors"
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

              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition-colors"
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
                      className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-zinc-800 bg-zinc-950 p-2 shadow-2xl"
                    >
                      {serviceItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-zinc-50 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Authentication Buttons */}
              {!isLoading && isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="ml-2 inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="ml-2 inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-900 sm:hidden transition-colors"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Mobile Menu */}
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
                    {/* Main Nav Items */}
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}

                    {/* Products Section */}
                    <div className="border-t border-zinc-800 pt-2">
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Products</div>
                      {productDropdown.map((group) => (
                        <div key={group.category} className="mb-3">
                          <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-zinc-500">
                            {group.icon}
                            {group.category}
                          </div>
                          {group.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block rounded-lg px-6 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition-colors"
                              onClick={() => setOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Services Section */}
                    <div className="border-t border-zinc-800 pt-2">
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">Services</div>
                      {serviceItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-lg px-6 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Authentication Buttons (Mobile) */}
                    {!isLoading && isAuthenticated ? (
                      <>
                        <Link
                          href="/dashboard"
                          className="mt-3 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-700 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            signOut({ callbackUrl: '/' })
                            setOpen(false)
                          }}
                          className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-800/50 bg-red-950/20 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-950/40 transition-colors"
                        >
                          <LogOut size={14} />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="mt-3 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-700 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          Login
                        </Link>
                        <Link
                          href="/signup"
                          className="mt-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-700 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
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
