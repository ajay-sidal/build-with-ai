import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Spam Experts | Email Filtering & Security',
  description: 'Advanced spam filtering with 99%+ accuracy. Incoming, outgoing, and archiving solutions for email security.',
  openGraph: { title: 'Spam Experts | BuildWithAI', url: '/products/spam-experts' },
}

export default function SpamExpertsPage() {
  const products = [
    { name: 'Incoming Filter', price: '$2.99', unit: '/mailbox/month', features: ['99%+ spam detection', 'Virus protection', 'Phishing detection', 'Quarantine management'] },
    { name: 'Outgoing Filter', price: '$0.99', unit: '/mailbox/month', features: ['Prevent spam outbreaks', 'Protect sender reputation', 'Detect compromised accounts', 'Policy enforcement'] },
    { name: 'Email Archiving', price: '$1.99', unit: '/mailbox/month', features: ['Regulatory compliance', 'Instant retrieval', 'Legal hold', 'Unlimited storage'] },
  ]

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">Spam Experts</h1>
        <p className="mt-2 text-zinc-400">Advanced email filtering and security solutions</p>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.name} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6">
            <h3 className="text-lg font-medium text-zinc-100">{p.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-zinc-50">{p.price}</span>
              <span className="text-zinc-400">{p.unit}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="mt-0.5 text-emerald-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/products/spam-experts/incoming" className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200">
              Get Started
            </Link>
          </div>
        ))}
      </div>

      <Link href="/products" className="inline-flex items-center text-zinc-300 hover:text-zinc-100">
        Back to Products →
      </Link>
    </main>
  )
}
