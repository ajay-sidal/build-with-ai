import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Domain Transfer | Transfer Your Domains',
  description: 'Seamlessly transfer your domains from any registrar. Free 1-year extension, no downtime, and competitive pricing.',
  openGraph: { title: 'Domain Transfer | BuildWithAI', url: '/products/domains/transfer' },
}

export default function DomainTransferPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to Products
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <Globe size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Domain Transfer</h1>
            <p className="text-sm text-zinc-400">Seamlessly move your domains to BuildWithAI</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Transfer your domains from any registrar and enjoy better pricing, superior support, and advanced management features.
          </p>

          <h2>Benefits</h2>
          <ul>
            <li>Free 1-year extension with every transfer</li>
            <li>No downtime during transfer process</li>
            <li>Competitive transfer pricing</li>
            <li>Dedicated transfer support team</li>
            <li>Bulk transfer capabilities</li>
            <li>Automatic DNS preservation</li>
          </ul>

          <h2>Transfer Process</h2>
          <ol>
            <li>Unlock your domain at current registrar</li>
            <li>Obtain authorization (EPP) code</li>
            <li>Initiate transfer on BuildWithAI</li>
            <li>Approve transfer confirmation email</li>
            <li>Wait for completion (5-7 days)</li>
          </ol>

          <div className="mt-8 rounded-xl border border-amber-800/40 bg-amber-950/20 p-4">
            <p className="text-sm text-amber-200">
              <strong>Coming Soon:</strong> Self-service domain transfer portal. For now, please contact our support team to initiate a transfer.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
