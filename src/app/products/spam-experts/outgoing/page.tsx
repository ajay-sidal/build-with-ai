import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Send } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Outgoing Email Filter | Prevent Spam Outbreaks',
  description: 'Monitor and filter outgoing emails to prevent spam outbreaks and protect your sender reputation.',
  openGraph: { title: 'Outgoing Email Filter | BuildWithAI', url: '/products/spam-experts/outgoing' },
}

export default function SpamExpertsOutgoingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products/spam-experts" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to Spam Experts
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <Send size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Outgoing Email Filter</h1>
            <p className="text-sm text-zinc-400">Protect your sender reputation</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Monitor and filter outgoing emails to prevent spam outbreaks and protect your sender reputation.
          </p>

          <h2>Benefits</h2>
          <ul>
            <li>Prevent spam outbreaks</li>
            <li>Protect sender reputation</li>
            <li>Detect compromised accounts</li>
            <li>Policy enforcement</li>
            <li>Compliance monitoring</li>
            <li>Detailed logging</li>
          </ul>

          <h2>Features</h2>
          <ul>
            <li>Outbound spam detection</li>
            <li>Account compromise alerts</li>
            <li>Rate limiting</li>
            <li>Content scanning</li>
            <li>Policy enforcement</li>
            <li>Audit logging</li>
            <li>Reporting dashboard</li>
            <li>Alert notifications</li>
          </ul>

          <h2>Pricing</h2>
          <p>Starting from $0.99/mailbox/month</p>

          <div className="mt-8">
            <Link href="/products/spam-experts" className="inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200">
              View All Spam Experts
              <ArrowLeft size={16} className="ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
