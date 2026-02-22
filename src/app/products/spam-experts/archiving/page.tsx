import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Archive } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Email Archiving | Compliant Email Storage',
  description: 'Compliant email archiving with instant search and retrieval. Meet regulatory requirements.',
  openGraph: { title: 'Email Archiving | BuildWithAI', url: '/products/spam-experts/archiving' },
}

export default function SpamExpertsArchivingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products/spam-experts" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to Spam Experts
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <Archive size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Email Archiving</h1>
            <p className="text-sm text-zinc-400">Compliant email storage and retrieval</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Compliant email archiving with instant search and retrieval. Meet regulatory requirements and protect against data loss.
          </p>

          <h2>Benefits</h2>
          <ul>
            <li>Regulatory compliance (GDPR, HIPAA, SOX)</li>
            <li>Instant email retrieval</li>
            <li>Legal hold capabilities</li>
            <li>Disaster recovery</li>
            <li>eDiscovery support</li>
            <li>Unlimited storage</li>
          </ul>

          <h2>Features</h2>
          <ul>
            <li>Automatic archiving</li>
            <li>Full-text search</li>
            <li>Legal hold</li>
            <li>Audit trails</li>
            <li>Export capabilities</li>
            <li>Retention policies</li>
            <li>Role-based access</li>
            <li>API access</li>
          </ul>

          <h2>Pricing</h2>
          <p>Starting from $1.99/mailbox/month</p>

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
