import type { Metadata } from 'next'
import Link from 'next/link'
import { tldCategories } from '../../../lib/openprovider-products'

export const metadata: Metadata = {
  title: 'Domain Extensions | 1,500+ TLDs Available',
  description: 'Browse our complete catalog of 1,500+ domain extensions. Generic TLDs, country codes, new gTLDs, and premium extensions.',
  openGraph: { title: 'Domain Extensions | BuildWithAI', url: '/products/tlds' },
}

export default function TLDsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">Domain Extensions</h1>
        <p className="mt-2 text-zinc-400">Choose from over 1,500 TLDs worldwide</p>
      </div>

      {/* Stats */}
      <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total TLDs', value: '1,500+' },
          { label: 'Generic TLDs', value: '500+' },
          { label: 'Country Codes', value: '250+' },
          { label: 'New gTLDs', value: '750+' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-center">
            <div className="text-2xl font-semibold text-zinc-50">{stat.value}</div>
            <div className="text-sm text-zinc-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* TLD Categories */}
      <div className="space-y-12">
        {tldCategories.map((category) => (
          <section key={category.id}>
            <div className="mb-4">
              <h2 className="text-xl font-medium text-zinc-100">{category.name}</h2>
              <p className="text-sm text-zinc-400">{category.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {category.extensions.map((ext) => (
                <div
                  key={ext}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3 transition hover:border-zinc-700"
                >
                  <span className="font-mono text-sm text-zinc-200">{ext}</span>
                  <Link href="/products/domains/registration" className="text-xs text-zinc-500 hover:text-zinc-300">
                    Register →
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-3 text-sm text-zinc-500">Starting from {category.startingPrice}</div>
          </section>
        ))}
      </div>

      {/* Popular Extensions Table */}
      <section className="mt-16">
        <h2 className="mb-4 text-xl font-medium text-zinc-100">Most Popular Extensions</h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-4 py-3 text-left text-zinc-400">Extension</th>
                <th className="px-4 py-3 text-left text-zinc-400">Type</th>
                <th className="px-4 py-3 text-left text-zinc-400">Description</th>
                <th className="px-4 py-3 text-right text-zinc-400">Price</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ext: '.com', type: 'gTLD', desc: 'Commercial - Most popular worldwide', price: '$8.06/year' },
                { ext: '.net', type: 'gTLD', desc: 'Network - Tech and infrastructure', price: '$12.99/year' },
                { ext: '.org', type: 'gTLD', desc: 'Organization - Non-profits', price: '$11.99/year' },
                { ext: '.io', type: 'ccTLD', desc: 'British Indian Ocean Territory - Tech startups', price: '$35.00/year' },
                { ext: '.ai', type: 'ccTLD', desc: 'Anguilla - AI and tech companies', price: '$65.00/year' },
                { ext: '.co', type: 'ccTLD', desc: 'Colombia - Business alternative', price: '$24.99/year' },
                { ext: '.tech', type: 'new gTLD', desc: 'Technology companies', price: '$4.99/year' },
                { ext: '.store', type: 'new gTLD', desc: 'E-commerce and retail', price: '$4.99/year' },
                { ext: '.app', type: 'new gTLD', desc: 'Mobile and web applications', price: '$14.99/year' },
                { ext: '.dev', type: 'new gTLD', desc: 'Developers and development', price: '$12.99/year' },
              ].map((row) => (
                <tr key={row.ext} className="border-b border-zinc-800/50 last:border-0">
                  <td className="px-4 py-3 font-mono text-zinc-100">{row.ext}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.type}</td>
                  <td className="px-4 py-3 text-zinc-400">{row.desc}</td>
                  <td className="px-4 py-3 text-right text-zinc-300">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16">
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-950 to-zinc-900 p-8">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-100">Ready to Register?</h2>
              <p className="mt-2 text-zinc-400">Search for your perfect domain name now.</p>
            </div>
            <Link href="/" className="inline-flex items-center justify-center rounded-md bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200">
              Search Domains
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
