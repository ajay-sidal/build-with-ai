import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Domain Management | Portfolio Management',
  description: 'Comprehensive domain portfolio management for businesses and agencies. Bulk operations, analytics, and more.',
  openGraph: { title: 'Domain Management | BuildWithAI', url: '/services/domain-management' },
}

export default function DomainManagementPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/services" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to Services
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <Globe size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Domain Management</h1>
            <p className="text-sm text-zinc-400">Comprehensive portfolio management</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Comprehensive domain portfolio management for businesses and agencies. Centralize control, reduce costs, and minimize risk.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Bulk domain operations</li>
            <li>Portfolio analytics</li>
            <li>Expiration monitoring</li>
            <li>Auto-renewal management</li>
            <li>Contact management</li>
            <li>DNS management</li>
            <li>Transfer management</li>
            <li>API access</li>
          </ul>

          <h2>Benefits</h2>
          <ul>
            <li>Centralized control across all domains</li>
            <li>Significant time savings</li>
            <li>Cost optimization through bulk pricing</li>
            <li>Risk reduction with expiration alerts</li>
            <li>Scalability for growing portfolios</li>
          </ul>

          <h2>Use Cases</h2>
          <ul>
            <li><strong>Domain Resellers:</strong> Manage customer domains efficiently</li>
            <li><strong>Web Agencies:</strong> Centralized management for client portfolios</li>
            <li><strong>Enterprise IT:</strong> Corporate domain governance</li>
            <li><strong>Brand Protection:</strong> Monitor and protect trademarked names</li>
          </ul>

          <div className="mt-8">
            <Link href="/services" className="inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200">
              View All Services
              <ArrowLeft size={16} className="ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
