'use client'

import Link from 'next/link'
import { Linkedin, Twitter, LayoutDashboard, Globe } from 'lucide-react'
import { productCategories } from '../lib/openprovider-products'

const footerColumns = [
  {
    title: 'Platform',
    links: [
      { href: '/', label: 'Domain Search' },
      { href: '/products', label: 'All Products' },
      { href: '/services', label: 'Services' },
      { href: '/ssl', label: 'SSL Vault' },
      { href: '/developers', label: 'Developers' },
    ],
  },
  {
    title: 'Product Categories',
    links: productCategories.map(cat => ({
      href: `/products#${cat.id}`,
      label: cat.name
    })),
  },
  {
    title: 'Account',
    links: [
      { href: '/dashboard', label: 'Website Dashboard' },
      { href: '/dashboard/billing', label: 'Billing & Assets' },
      { href: '/login', label: 'Login' },
      { href: '/signup', label: 'Sign Up' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/partners', label: 'Partners' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="mx-auto w-full max-w-7xl px-6 pb-10">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/35">
          <div className="px-5 py-8">
            {/* Top Section: Logo + Columns */}
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              {/* Logo */}
              <div className="w-full text-center md:w-56 md:text-left">
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <img src="/icon.png" alt="BUILD WITH AI" className="h-6 w-6 rounded-lg" />
                  <span className="text-sm font-semibold tracking-tight text-zinc-50">BUILD WITH AI</span>
                </div>
                <p className="mt-3 text-xs text-zinc-500">
                  Infrastructure for AI-native teams. Domains, SSL, DNS, and more.
                </p>

                {/* Admin Quick Access */}
                <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                  <Link
                    href="/admin/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800/50 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800"
                  >
                    <LayoutDashboard size={12} />
                    Admin
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800/50 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800"
                  >
                    <Globe size={12} />
                    Website Hub
                  </Link>
                </div>
              </div>

              {/* Footer Columns - Evenly spaced */}
              <div className="flex flex-1 flex-wrap justify-center gap-8 sm:gap-6 lg:gap-8">
                {footerColumns.map((col) => (
                  <div key={col.title} className="w-40 flex-shrink-0">
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{col.title}</div>
                    <div className="mt-3 flex flex-col gap-2">
                      {col.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section: Copyright + Social */}
            <div className="mt-8 flex flex-col items-center gap-3 border-t border-zinc-800/80 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-center">
              <div>© {new Date().getFullYear()} BUILD WITH AI. All rights reserved.</div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-zinc-200 transition-colors"
                  aria-label="X (Twitter)"
                >
                  <Twitter size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
