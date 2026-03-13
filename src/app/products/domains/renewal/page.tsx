import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, RefreshCw } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Domain Renewal | Keep Your Domains Active',
  description: 'Automated domain renewal protection. Never lose a domain to expiration again.',
  openGraph: { title: 'Domain Renewal | BuildWithAI', url: '/products/domains/renewal' },
}

export default function DomainRenewalPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to Products
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <RefreshCw size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Domain Renewal</h1>
            <p className="text-sm text-zinc-400">Keep your valuable domains active</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Our automated renewal system ensures you never lose a domain to expiration. Flexible renewal periods and grace period recovery options available.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Automatic renewal protection</li>
            <li>Flexible renewal periods (1-10 years)</li>
            <li>Grace period recovery options</li>
            <li>Bulk renewal management</li>
            <li>Renewal reminders and notifications</li>
            <li>Competitive renewal pricing</li>
          </ul>

          <h2>Renewal Timeline</h2>
          <ul>
            <li><strong>30 days before:</strong> First renewal reminder</li>
            <li><strong>7 days before:</strong> Second reminder</li>
            <li><strong>1 day before:</strong> Final reminder</li>
            <li><strong>Expiration day:</strong> Domain enters grace period</li>
            <li><strong>30 days after:</strong> Redemption period begins</li>
          </ul>

          <div className="mt-8 rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-4">
            <p className="text-sm text-emerald-200">
              <strong>Manage Renewals:</strong> View and manage your domain renewals in your <Link href="/dashboard/billing" className="underline">Dashboard</Link>.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
