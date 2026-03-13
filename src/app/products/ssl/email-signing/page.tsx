import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'S/MIME Email Certificate | Email Signing',
  description: 'Digitally sign and encrypt emails. Verify sender identity and ensure message integrity.',
  openGraph: { title: 'S/MIME Email Certificate | BuildWithAI', url: '/products/ssl/email-signing' },
}

export default function EmailSigningPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products/ssl" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to SSL Certificates
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <Mail size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">S/MIME Email Certificate</h1>
            <p className="text-sm text-zinc-400">Digitally sign and encrypt emails</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Digitally sign and encrypt emails to protect sensitive communications. Verify sender identity and ensure message integrity.
          </p>

          <h2>Benefits</h2>
          <ul>
            <li>Email encryption</li>
            <li>Digital signatures</li>
            <li>Sender verification</li>
            <li>Message integrity</li>
            <li>Non-repudiation</li>
            <li>Outlook/Thunderbird compatible</li>
          </ul>

          <h2>Features</h2>
          <ul>
            <li>S/MIME protocol</li>
            <li>256-bit encryption</li>
            <li>Digital signature</li>
            <li>Certificate-based authentication</li>
            <li>Email client integration</li>
            <li>1-3 year validity options</li>
          </ul>

          <h2>Pricing</h2>
          <p>Starting from $19.99/year</p>

          <div className="mt-8">
            <Link href="/ssl" className="inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200">
              Get Email Certificate
              <ArrowLeft size={16} className="ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
