import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'SSL Certificate Management | Enterprise SSL',
  description: 'Streamlined SSL certificate lifecycle management. Certificate inventory, expiration alerts, and auto-renewal.',
  openGraph: { title: 'SSL Certificate Management | BuildWithAI', url: '/services/ssl-management' },
}

export default function SSLManagementPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/services" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to Services
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">SSL Certificate Management</h1>
            <p className="text-sm text-zinc-400">Enterprise SSL lifecycle management</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Streamlined SSL certificate lifecycle management for enterprises. Never let a certificate expire unexpectedly again.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Certificate inventory</li>
            <li>Expiration alerts</li>
            <li>Auto-renewal</li>
            <li>CSR generation</li>
            <li>Multi-CA support</li>
            <li>Compliance reporting</li>
            <li>API integration</li>
            <li>Team collaboration</li>
          </ul>

          <h2>Benefits</h2>
          <ul>
            <li>No outages from expired certificates</li>
            <li>Compliance assurance</li>
            <li>Cost savings through consolidation</li>
            <li>Centralized management</li>
          </ul>

          <h2>Use Cases</h2>
          <ul>
            <li><strong>Enterprises:</strong> Manage hundreds of certificates</li>
            <li><strong>E-commerce:</strong> Ensure continuous secure checkout</li>
            <li><strong>Financial Services:</strong> Meet regulatory requirements</li>
            <li><strong>Healthcare:</strong> HIPAA compliance for patient portals</li>
          </ul>

          <div className="mt-8">
            <Link href="/ssl" className="inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200">
              Visit SSL Vault
              <ArrowLeft size={16} className="ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
