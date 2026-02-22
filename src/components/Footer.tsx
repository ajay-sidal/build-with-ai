'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const columns: Array<{
  title: string
  links: Array<{ href: string; label: string }>
}> = [
  {
    title: 'Platform',
    links: [
      { href: '/', label: 'Domain Search' },
      { href: '/ssl', label: 'SSL Vault' },
      { href: '/developers', label: 'Developers' },
      { href: '/dashboard/billing', label: 'Dashboard' },
    ],
  },
  {
    title: 'Products',
    links: [
      { href: '/products', label: 'All Products' },
      { href: '/products/domains/registration', label: 'Domain Registration' },
      { href: '/products/ssl', label: 'SSL Certificates' },
      { href: '/products/dns/hosting', label: 'DNS Hosting' },
      { href: '/products/licenses/plesk', label: 'Plesk Licenses' },
      { href: '/products/templates', label: 'Templates' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/services', label: 'Overview' },
      { href: '/services/customer-management', label: 'Customer Management' },
      { href: '/services/ai-design', label: 'AI Design' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/partners', label: 'Partners' },
      { href: '/membership', label: 'Membership' },
      { href: '/signup', label: 'Sign Up' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-12">
      <div className="mx-auto w-full max-w-6xl px-6 pb-10">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/35">
          <div className="px-5 py-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-50">
                <span className="rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                  <Sparkles size={16} />
                </span>
                BuildWithAI.digital
              </Link>

              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {columns.map((col) => (
                  <div key={col.title}>
                    <div className="text-xs font-medium text-zinc-400">{col.title}</div>
                    <div className="mt-3 grid gap-2">
                      {col.links.map((l) => (
                        <Link key={l.href} href={l.href} className="text-sm text-zinc-300 hover:text-zinc-50">
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                  <div>
                    <div className="text-xs font-medium text-zinc-400">Admin</div>
                    <div className="mt-3 grid gap-2">
                      <Link href="/admin/dashboard" className="text-sm text-zinc-300 hover:text-zinc-50">Admin</Link>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-400">Affiliate</div>
                    <div className="mt-3 grid gap-2">
                      <Link href="/affiliate" className="text-sm text-zinc-300 hover:text-zinc-50">Affiliate</Link>
                    </div>
                  </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2 border-t border-zinc-800/80 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} BuildWithAI.digital</div>
              <div className="text-zinc-500">Infrastructure for AI-native teams</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
