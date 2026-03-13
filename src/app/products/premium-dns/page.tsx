import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Premium DNS | Enterprise-Grade DNS',
  description: '99.999% uptime SLA, DDoS protection, and global anycast network powered by Sectigo.',
  openGraph: { title: 'Premium DNS | BuildWithAI', url: '/products/premium-dns' },
}

export default function PremiumDNSPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to Products
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Premium DNS</h1>
            <p className="text-sm text-zinc-400">Enterprise-grade DNS infrastructure</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Upgrade to Premium DNS for 99.999% uptime guarantee, global anycast network, and advanced DDoS protection.
          </p>

          <h2>Features</h2>
          <ul>
            <li>99.999% uptime SLA</li>
            <li>Global anycast network (20+ PoPs)</li>
            <li>DDoS protection up to 1Tbps</li>
            <li>DNSSEC signing and validation</li>
            <li>Real-time DNS updates</li>
            <li>Detailed query analytics</li>
            <li>GeoDNS capabilities</li>
            <li>DNS failover</li>
          </ul>

          <h2>Pricing</h2>
          <p>Starting from $4.99/month per domain</p>

          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="text-sm text-zinc-300">
              <strong>Free DNS:</strong> Standard DNS hosting is included free with all domain registrations. Upgrade to Premium DNS for enhanced performance and reliability.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
