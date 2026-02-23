import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DNS Templates | Pre-configured DNS Settings',
  description: 'Pre-configured DNS templates for popular services. Deploy standard configurations instantly across multiple domains.',
  openGraph: { title: 'DNS Templates | BuildWithAI', url: '/products/dns/templates' },
}

export default function DNSTemplatesPage() {
  const templates = [
    { name: 'WordPress', records: ['A', 'CNAME', 'TXT'], description: 'Standard WordPress hosting setup' },
    { name: 'Google Workspace', records: ['MX', 'TXT', 'CNAME'], description: 'Email and productivity suite' },
    { name: 'Microsoft 365', records: ['MX', 'TXT', 'CNAME', 'SRV'], description: 'Office 365 email and services' },
    { name: 'Cloudflare', records: ['CNAME', 'TXT'], description: 'CDN and security proxy' },
    { name: 'Shopify', records: ['A', 'CNAME', 'TXT'], description: 'E-commerce platform' },
    { name: 'Vercel', records: ['A', 'CNAME'], description: 'Modern deployment platform' },
  ]

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">DNS Templates</h1>
        <p className="mt-2 text-zinc-400">Pre-configured DNS settings for popular services</p>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div key={template.name} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h3 className="font-medium text-zinc-100">{template.name}</h3>
            <p className="mt-1 text-sm text-zinc-400">{template.description}</p>
            <div className="mt-3 flex gap-2">
              {template.records.map((r) => (
                <span key={r} className="rounded bg-zinc-900 px-2 py-1 text-xs text-zinc-300">{r}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link href="/products/dns" className="inline-flex items-center text-zinc-300 hover:text-zinc-100">
        Back to DNS Services →
      </Link>
    </main>
  )
}
