import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Layers } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Multi-Domain SSL | SAN Certificates',
  description: 'Secure up to 250 domains with a single certificate. Mixed domain types supported.',
  openGraph: { title: 'Multi-Domain SSL | BuildWithAI', url: '/products/ssl/multi-domain' },
}

export default function MultiDomainSSLPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products/ssl" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to SSL Certificates
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Multi-Domain SSL (SAN)</h1>
            <p className="text-sm text-zinc-400">Secure multiple domains with one certificate</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Secure multiple domains with a single certificate. Support for up to 250 domains across different TLDs and subdomains.
          </p>

          <h2>Benefits</h2>
          <ul>
            <li>Up to 250 domains in one certificate</li>
            <li>Mixed domain types supported</li>
            <li>Single management interface</li>
            <li>Cost savings vs individual certificates</li>
            <li>All validation levels available (DV, OV, EV)</li>
            <li>Easy domain addition/removal</li>
          </ul>

          <h2>Popular Options</h2>
          <ul>
            <li><strong>Comodo Multi-Domain:</strong> $99.99/year - 3 domains included</li>
            <li><strong>DigiCert Multi-Domain:</strong> $249/year - 5 domains included</li>
            <li><strong>GeoTrust Multi-Domain:</strong> $129/year - 5 domains included</li>
          </ul>

          <div className="mt-8">
            <Link href="/ssl" className="inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200">
              Get Multi-Domain SSL
              <ArrowLeft size={16} className="ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
