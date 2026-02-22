'use client'

import Link from 'next/link'
import { Sparkles, Linkedin, Twitter } from 'lucide-react'

const footerColumns = [
  {
    title: 'Platform',
    links: [
      { href: '/', label: 'Domain Search' },
      { href: '/products', label: 'All Products' },
      { href: '/services', label: 'Services' },
      { href: '/ssl', label: 'SSL Vault' },
    ],
  },
  {
    title: 'Products',
    links: [
      { href: '/products/domains/registration', label: 'Domain Registration' },
      { href: '/products/ssl', label: 'SSL Certificates' },
      { href: '/products/dns/hosting', label: 'DNS Hosting' },
      { href: '/products/spam-experts', label: 'Spam Experts' },
      { href: '/products/licenses/plesk', label: 'Plesk Licenses' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/services', label: 'Overview' },
      { href: '/services/customer-management', label: 'Customer Management' },
      { href: '/services/ai-design', label: 'AI Design' },
      { href: '/services/domain-management', label: 'Domain Management' },
    ],
  },
  {
    title: 'Developers',
    links: [
      { href: '/developers', label: 'Documentation' },
      { href: '/api/health', label: 'API Status' },
      { href: '/partners', label: 'Partner Program' },
      { href: '/affiliate', label: 'Affiliate Program' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/membership', label: 'Membership' },
      { href: '/login', label: 'Login' },
      { href: '/signup', label: 'Sign Up' },
    ],
  },
  {
    title: 'Support',
    links: [
      { href: '/dashboard/billing', label: 'Dashboard' },
      { href: '/admin/dashboard', label: 'Admin' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
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
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              {/* Logo */}
              <div className="md:w-48">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-50">
                  <img src="/icon.png" alt="BUILD WITH AI" className="h-6 w-6 rounded-lg" />
                  BUILD WITH AI
                </Link>
                <p className="mt-3 text-xs text-zinc-500">
                  Infrastructure for AI-native teams. Domains, SSL, DNS, and more.
                </p>
              </div>

              {/* Footer Columns */}
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3">
                {footerColumns.map((col) => (
                  <div key={col.title}>
                    <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{col.title}</div>
                    <div className="mt-3 grid gap-2">
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
            <div className="mt-8 flex flex-col gap-4 border-t border-zinc-800/80 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} BUILD WITH AI. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={16} />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
                  aria-label="X (Twitter)"
                >
                  <Twitter size={16} />
                  <span>X</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
