import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nameserver Groups | Custom Nameservers',
  description: 'Create and manage custom nameserver groups for advanced DNS configurations.',
  openGraph: { title: 'Nameserver Groups | BuildWithAI', url: '/products/dns/nameservers' },
}

import Link from 'next/link'
export default function NameserversPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">Nameserver Groups</h1>
        <p className="mt-2 text-zinc-400">Custom nameserver management for advanced configurations</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { title: 'Custom Branding', desc: 'Use your own nameserver names' },
          { title: 'IPv4 & IPv6', desc: 'Dual-stack support included' },
          { title: 'Health Monitoring', desc: 'Automatic failover support' },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h3 className="font-medium text-zinc-100">{f.title}</h3>
            <p className="mt-1 text-sm text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </div>

      <Link href="/products/dns" className="inline-flex items-center text-zinc-300 hover:text-zinc-100">
        Back to DNS Services →
      </Link>
    </main>
  )
}
