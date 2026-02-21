'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X, Sparkles } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Domain Search' },
  { href: '/ssl', label: 'SSL Vault' },
  { href: '/services/ai-design', label: 'AI Design' },
  { href: '/products/templates', label: 'Templates' },
]

export default function Navbar() {
  const [open, setOpen] = React.useState(false)

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
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/dashboard/billing"
                className="ml-1 inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-900"
              >
                Dashboard
              </Link>
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
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-50"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <Link
                      href="/dashboard/billing"
                      className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-900"
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
