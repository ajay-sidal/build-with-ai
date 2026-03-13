import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShieldAlert } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Incoming Email Filter | Spam Protection',
  description: 'Advanced inbound spam filtering with 99%+ accuracy. Protect your inbox from spam, viruses, and phishing.',
  openGraph: { title: 'Incoming Email Filter | BuildWithAI', url: '/products/spam-experts/incoming' },
}

export default function SpamExpertsIncomingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products/spam-experts" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to Spam Experts
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Incoming Email Filter</h1>
            <p className="text-sm text-zinc-400">Advanced inbound spam filtering</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Advanced inbound spam filtering with 99%+ accuracy. Protect your inbox from spam, viruses, and phishing attacks.
          </p>

          <h2>Benefits</h2>
          <ul>
            <li>99%+ spam detection rate</li>
            <li>Zero false positives guarantee</li>
            <li>Real-time threat protection</li>
            <li>Reduced bandwidth usage</li>
            <li>Clean email delivery</li>
            <li>Detailed reporting</li>
          </ul>

          <h2>Features</h2>
          <ul>
            <li>Advanced spam filtering</li>
            <li>Virus protection</li>
            <li>Phishing detection</li>
            <li>Attachment filtering</li>
            <li>Content filtering</li>
            <li>Allow/block lists</li>
            <li>Quarantine management</li>
            <li>Email continuity</li>
          </ul>

          <h2>Pricing</h2>
          <p>Starting from $2.99/mailbox/month</p>

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
