import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Asterisk } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wildcard SSL | Secure Unlimited Subdomains',
  description: 'Secure unlimited subdomains with a single certificate. Perfect for SaaS platforms and growing businesses.',
  openGraph: { title: 'Wildcard SSL | BuildWithAI', url: '/products/ssl/wildcard' },
}

export default function WildcardSSLPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products/ssl" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to SSL Certificates
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <Asterisk size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Wildcard SSL</h1>
            <p className="text-sm text-zinc-400">Secure unlimited subdomains with one certificate</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Secure unlimited subdomains with a single certificate. Perfect for SaaS platforms, multi-tenant applications, and growing businesses.
          </p>

          <h2>Benefits</h2>
          <ul>
            <li>Unlimited subdomain coverage</li>
            <li>Single certificate management</li>
            <li>Cost-effective for multiple subdomains</li>
            <li>Easy scalability</li>
            <li>All validation levels available (DV, OV, EV)</li>
            <li>Compatible with all servers</li>
          </ul>

          <h2>Popular Options</h2>
          <ul>
            <li><strong>RapidSSL Wildcard:</strong> $69.99/year - DV Wildcard</li>
            <li><strong>Comodo Wildcard:</strong> $89.99/year - DV Wildcard</li>
            <li><strong>GeoTrust Wildcard:</strong> $149/year - OV Wildcard</li>
          </ul>

          <div className="mt-8">
            <Link href="/ssl" className="inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200">
              Get Wildcard SSL
              <ArrowLeft size={16} className="ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
