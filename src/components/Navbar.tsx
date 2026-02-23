'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Sparkles, ChevronDown, Globe, Shield, Server, Mail, Box, Key, LogOut, Layers, Palette, Zap, ShoppingCart } from 'lucide-react'
import { useCart } from './providers/CartProvider'
import { allProducts, allServices } from '../lib/openprovider-products'

// Main navigation items (centered) - Products and Services are now dropdown-only
const mainNavItems = [
  { href: '/', label: 'Home' },
  { href: '/developers', label: 'Developers' },
  { href: '/about', label: 'About' },
]

// Dynamically generate product dropdown from the single source of truth
const productDropdown = allProducts.reduce((acc: { category: string; icon: JSX.Element; items: { href: string; label: string }[] }[], product) => {
  let group = acc.find(g => g.category === product.category);
  if (!group) {
    group = { category: product.category, icon: <Globe size={16} />, items: [] };
    // Assign specific icons based on category
    if (product.category === 'SSL Certificates') group.icon = <Shield size={16} />;
    if (product.category === 'DNS Services') group.icon = <Server size={16} />;
    if (product.category.includes('Email') || product.category.includes('Spam')) group.icon = <Mail size={16} />;
    if (product.category === 'Licenses') group.icon = <Key size={16} />;
    if (product.category === 'EasyDMARC') group.icon = <Shield size={16} />;
    acc.push(group);
  }
  group.items.push({
    href: `/products/${product.slug}`,
    label: product.name,
  });
  return acc;
}, []);

// Add a general "All Products" link
productDropdown.unshift({
  category: 'Overview',
  icon: <Layers size={16} />,
  items: [{ href: '/products', label: 'All Products' }],
});

// Merged Services dropdown - all service categories in one cohesive menu
const serviceItems = [
  {
    category: 'Overview',
    icon: <Layers size={16} />,
    items: [
      { href: '/services', label: 'Services Overview' },
    ],
  },
  {
    category: 'Management Services',
    icon: <Zap size={16} />,
    items: [
      { href: '/services/customer-management', label: 'Customer Management' },
      { href: '/services/domain-management', label: 'Domain Management' },
      { href: '/services/ssl-management', label: 'SSL Management' },
    ],
  },
  {
    category: 'Design Services',
    icon: <Palette size={16} />,
    items: [
      { href: '/services/ai-design', label: 'AI Design' },
    ],
  },
]

export default function Navbar() {
  const { data: session, status } = useSession()
  const [open, setOpen] = React.useState(false)
  const [productsOpen, setProductsOpen] = React.useState(false)
  const [servicesOpen, setServicesOpen] = React.useState(false)
  const { itemCount } = useCart()

  const isLoading = status === 'loading'
  const isAuthenticated = !!session

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-50"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-6">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/35">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
            {/* Logo */}
            <Link href="/" className="inline-flex shrink-0 items-center gap-2.5 text-base font-semibold tracking-tight text-zinc-50">
              <img src="/icon.png" alt="BUILD WITH AI" className="h-8 w-8 rounded-lg" />
              <span className="whitespace-nowrap">BUILD WITH AI</span>
            </Link>

            {/* Desktop Navigation - Centered with even spacing */}
            <nav className="hidden flex-1 items-center justify-center gap-1.5 lg:flex">
              {/* Center group: Home, Products, Services, Developers, About */}
              <div className="flex items-center gap-1.5">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3.5 py-2 text-base text-zinc-100 hover:bg-zinc-900/60 hover:text-white transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Products Dropdown */}
                <div className="relative">
                  <button
                    onMouseEnter={() => setProductsOpen(true)}
                    onMouseLeave={() => setProductsOpen(false)}
                    className="inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-base text-zinc-100 hover:bg-zinc-900/60 hover:text-white transition-colors"
                  >
                    Products
                    <ChevronDown size={16} className={`transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {productsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        onMouseEnter={() => setProductsOpen(true)}
                        onMouseLeave={() => setProductsOpen(false)}
                        className="absolute left-1/2 top-full z-50 mt-2 w-[700px] -translate-x-1/2 rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl"
                        style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}
                      >
                        <div className="grid grid-cols-3 gap-5">
                          {productDropdown.map((group) => (
                            <div key={group.category}>
                              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-200">
                                {group.icon}
                                {group.category}
                              </div>
                              <div className="space-y-1.5">
                                {group.items.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block rounded-md px-2 py-1.5 text-sm text-zinc-100 hover:bg-zinc-900 hover:text-white transition-colors"
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
                    className="inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-base text-zinc-100 hover:bg-zinc-900/60 hover:text-white transition-colors"
                  >
                    Services
                    <ChevronDown size={16} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        onMouseEnter={() => setServicesOpen(true)}
                        onMouseLeave={() => setServicesOpen(false)}
                        className="absolute left-1/2 top-full z-50 mt-2 w-80 -translate-x-1/2 rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl"
                        style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}
                      >
                        <div className="space-y-4">
                          {serviceItems.map((group) => (
                            <div key={group.category}>
                              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-200">
                                {group.icon}
                                {group.category}
                              </div>
                              <div className="space-y-1">
                                {group.items.map((item) => (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    className="block rounded-md px-2 py-1.5 text-sm text-zinc-100 hover:bg-zinc-900 hover:text-white transition-colors"
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
              </div>
            </nav>

            {/* Authentication Buttons - Right side */}
            <div className="hidden items-center gap-2 lg:flex">
              <Link href="/cart" className="relative rounded-lg p-2 text-zinc-100 hover:bg-zinc-900/60 hover:text-white transition-colors" aria-label="View shopping cart">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
                  >
                    {itemCount}
                  </motion.div>
                )}
              </Link>
              <div className="h-6 w-px bg-zinc-800"></div>

              {!isLoading && isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-base font-medium text-white hover:bg-zinc-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-base text-zinc-100 hover:text-white hover:bg-zinc-900/60 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-2 text-base font-medium text-zinc-100 hover:text-white hover:bg-zinc-900/60 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-base font-medium text-white hover:bg-zinc-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

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
                    <div className="border-t border-zinc-800 pt-2 mt-2">
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                        <Globe size={14} />
                        Products
                      </div>
                      {productDropdown.map((group) => (
                        <div key={group.category} className="mb-3">
                          <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-zinc-500">
                            {group.icon}
                            {group.category}
                          </div>
                          <div className="ml-5 space-y-1">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block rounded-lg px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition-colors"
                                onClick={() => setOpen(false)}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Services Section */}
                    <div className="border-t border-zinc-800 pt-2">
                      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                        <Layers size={14} />
                        Services
                      </div>
                      {serviceItems.map((group) => (
                        <div key={group.category} className="mb-3">
                          <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-zinc-500">
                            {group.icon}
                            {group.category}
                          </div>
                          <div className="ml-5 space-y-1">
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block rounded-lg px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50 transition-colors"
                                onClick={() => setOpen(false)}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Authentication Buttons (Mobile) */}
                    {!isLoading && isAuthenticated ? (
                      <>
                        <Link
                          href="/cart"
                          className="mt-3 flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-700 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <span>Shopping Cart</span>
                          {itemCount > 0 && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                              {itemCount}
                            </span>
                          )}
                        </Link>
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
                          href="/cart"
                          className="mt-3 flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-700 transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          <span>Shopping Cart</span>
                          {itemCount > 0 && (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                              {itemCount}
                            </span>
                          )}
                        </Link>
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
