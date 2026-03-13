import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'EasyDMARC | Email Authentication & Security',
  description: 'Simplified DMARC implementation and monitoring. Protect your domain from email spoofing and improve deliverability.',
  openGraph: { title: 'EasyDMARC | BuildWithAI', url: '/products/easy-dmarc' },
}

export default function EasyDMARCPage() {
  const plans = [
    { name: 'Starter', price: '$7.99', unit: '/month', features: ['1 domain', 'Daily DMARC reports', 'SPF & DKIM setup', 'Basic support'] },
    { name: 'Professional', price: '$19.99', unit: '/month', features: ['5 domains', 'Advanced reports', 'Threat detection', 'Priority support'], popular: true },
    { name: 'Enterprise', price: '$49.99', unit: '/month', features: ['Unlimited domains', 'Custom reports', 'API access', 'Dedicated support'] },
  ]

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">EasyDMARC</h1>
        <p className="mt-2 text-zinc-400">Simplified DMARC implementation and monitoring</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { title: 'Email Spoofing Protection', desc: 'Prevent unauthorized use of your domain' },
          { title: 'Improved Deliverability', desc: 'Ensure your emails reach the inbox' },
          { title: 'Brand Protection', desc: 'Monitor and protect your brand reputation' },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h3 className="font-medium text-zinc-100">{f.title}</h3>
            <p className="mt-1 text-sm text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`rounded-xl border p-6 ${p.popular ? 'border-zinc-600 bg-zinc-950' : 'border-zinc-800 bg-zinc-950/60'}`}>
            {p.popular && <div className="mb-2 text-xs font-medium text-amber-400">Most Popular</div>}
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
          </div>
        ))}
      </div>

      <Link href="/products" className="inline-flex items-center text-zinc-300 hover:text-zinc-100">
        Back to Products →
      </Link>
    </main>
  )
}
