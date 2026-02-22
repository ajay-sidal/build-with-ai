import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Domain Validation SSL | DV Certificates',
  description: 'Fast, affordable domain-validated SSL certificates. Instant issuance for blogs, portfolios, and small business websites.',
  openGraph: { title: 'Domain Validation SSL | BuildWithAI', url: '/products/ssl/domain-validation' },
}

export default function DomainValidationSSLPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products/ssl" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to SSL Certificates
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <Lock size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Domain Validation SSL</h1>
            <p className="text-sm text-zinc-400">Fast, affordable SSL for basic websites</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Secure your website with fast, affordable domain-validated SSL certificates. Perfect for blogs, portfolios, and small business websites.
          </p>

          <h2>Benefits</h2>
          <ul>
            <li>Instant issuance (minutes)</li>
            <li>Basic domain validation only</li>
            <li>256-bit encryption</li>
            <li>Browser trust indicator</li>
            <li>SEO ranking boost</li>
            <li>Mobile-friendly security</li>
          </ul>

          <h2>Popular Options</h2>
          <ul>
            <li><strong>RapidSSL:</strong> $9.99/year - Basic DV, single domain</li>
            <li><strong>Comodo EssentialSSL:</strong> $14.99/year - Enhanced DV</li>
            <li><strong>GeoTrust QuickSSL:</strong> $12.99/year - Fast issuance</li>
          </ul>

          <div className="mt-8">
            <Link href="/ssl" className="inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200">
              Get SSL Certificate
              <ArrowLeft size={16} className="ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
