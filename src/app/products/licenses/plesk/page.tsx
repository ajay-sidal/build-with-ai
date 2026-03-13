import type { Metadata } from 'next'
import { Button } from '../../../../components/ui/button'
import ClientRouterLinkButtons from '@/components/ClientRouterLinkButtons'

export const metadata: Metadata = {
  title: 'Plesk Licenses | Web Hosting Control Panel',
  description: 'Official Plesk control panel licenses. Web Admin, Web Pro, and Web Host editions. Instant activation and volume discounts.',
  openGraph: { title: 'Plesk Licenses | BuildWithAI', url: '/products/licenses/plesk' },
}

export default function PleskLicensesPage() {
  const editions = [
    { name: 'Web Admin', price: '$6.99', unit: '/month', domains: '10 domains', features: ['WordPress toolkit', 'Git support', 'Basic support', 'Security updates'] },
    { name: 'Web Pro', price: '$12.99', unit: '/month', domains: '30 domains', features: ['All Web Admin features', 'All extensions', 'Priority support', 'Advanced security'] },
    { name: 'Web Host', price: '$24.99', unit: '/month', domains: 'Unlimited', features: ['All Web Pro features', 'Reseller tools', '24/7 support', 'White-label options'] },
  ]

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">Plesk Licenses</h1>
        <p className="mt-2 text-zinc-400">Official Plesk control panel licenses for web hosting</p>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {editions.map((e) => (
          <div key={e.name} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6">
            <h3 className="text-lg font-medium text-zinc-100">{e.name} Edition</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-zinc-50">{e.price}</span>
              <span className="text-zinc-400">{e.unit}</span>
            </div>
            <div className="mt-2 text-sm text-zinc-400">{e.domains}</div>
            <ul className="mt-4 space-y-2">
              {e.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="mt-0.5 text-emerald-500">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <ClientRouterLinkButtons
              items={[{ href: '/products/licenses', label: 'Get License', variant: 'primary', className: 'mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium' }]}
            />
          </div>
        ))}
      </div>

      <ClientRouterLinkButtons items={[{ href: '/products', label: 'Back to Products →', variant: 'secondary', className: 'inline-flex items-center text-zinc-300 hover:text-zinc-100' }]} />
    </main>
  )
}
