import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Extended Validation SSL | EV Certificates',
  description: 'The highest level of SSL validation. Maximum trust for e-commerce and financial sites.',
  openGraph: { title: 'Extended Validation SSL | BuildWithAI', url: '/products/ssl/extended-validation' },
}

export default function ExtendedValidationSSLPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products/ssl" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to SSL Certificates
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Extended Validation SSL</h1>
            <p className="text-sm text-zinc-400">Maximum trust with rigorous business verification</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            The highest level of SSL validation. Display your company name prominently and provide maximum trust for e-commerce and financial sites.
          </p>

          <h2>Benefits</h2>
          <ul>
            <li>Green address bar (legacy browsers)</li>
            <li>Company name prominently displayed</li>
            <li>Highest level of validation</li>
            <li>Maximum warranty coverage ($1.75M+)</li>
            <li>Enhanced customer trust</li>
            <li>Reduced cart abandonment</li>
          </ul>

          <h2>Popular Options</h2>
          <ul>
            <li><strong>Comodo EV SSL:</strong> $149.99/year - Extended validation</li>
            <li><strong>DigiCert EV:</strong> $299/year - Premium EV</li>
            <li><strong>GeoTrust EV:</strong> $179/year - Business EV</li>
          </ul>

          <div className="mt-8">
            <Link href="/ssl" className="inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200">
              Get EV SSL Certificate
              <ArrowLeft size={16} className="ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
