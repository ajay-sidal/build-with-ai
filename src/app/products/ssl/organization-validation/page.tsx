import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Building } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Organization Validation SSL | OV Certificates',
  description: 'Display your company name in certificate details. Ideal for business websites and e-commerce stores.',
  openGraph: { title: 'Organization Validation SSL | BuildWithAI', url: '/products/ssl/organization-validation' },
}

export default function OrganizationValidationSSLPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products/ssl" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to SSL Certificates
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <Building size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Organization Validation SSL</h1>
            <p className="text-sm text-zinc-400">Business-validated certificates with enhanced trust</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Display your company name in the certificate details. Ideal for business websites, e-commerce stores, and corporate portals.
          </p>

          <h2>Benefits</h2>
          <ul>
            <li>Company name verification</li>
            <li>Enhanced trust indicators</li>
            <li>Business validation badge</li>
            <li>Higher warranty coverage ($500K+)</li>
            <li>Multi-domain options available</li>
            <li>Wildcard support available</li>
          </ul>

          <h2>Popular Options</h2>
          <ul>
            <li><strong>Comodo OV SSL:</strong> $49.99/year - Organization validation</li>
            <li><strong>GeoTrust True BusinessID:</strong> $59.99/year - Business validation</li>
            <li><strong>DigiCert Secure Site:</strong> $199/year - Premium OV</li>
          </ul>

          <div className="mt-8">
            <Link href="/ssl" className="inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200">
              Get OV SSL Certificate
              <ArrowLeft size={16} className="ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
