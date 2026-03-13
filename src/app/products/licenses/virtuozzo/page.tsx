import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Virtuozzo Licenses | Containerization & Virtualization',
  description: 'Virtuozzo containerization and virtualization licenses. Efficient server resource utilization and management.',
  openGraph: { title: 'Virtuozzo Licenses | BuildWithAI', url: '/products/licenses/virtuozzo' },
}

export default function VirtuozzoLicensesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">Virtuozzo Licenses</h1>
        <p className="mt-2 text-zinc-400">Containerization and virtualization solutions</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { title: 'Virtuozzo Containers', desc: 'High-density container-based virtualization', price: 'From $9.99/mo' },
          { title: 'Virtuozzo Automation', desc: 'Complete hosting automation platform', price: 'Custom pricing' },
          { title: 'Storage Licensing', desc: 'Per-100GB block licensing', price: 'Flexible' },
          { title: 'CPU Licensing', desc: 'Per-CPU core licensing options', price: 'Volume discounts' },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h3 className="font-medium text-zinc-100">{f.title}</h3>
            <p className="mt-1 text-sm text-zinc-400">{f.desc}</p>
            <div className="mt-2 text-sm font-medium text-zinc-300">{f.price}</div>
          </div>
        ))}
      </div>

          <Link href="/products/licenses" className="inline-flex items-center text-zinc-300 hover:text-zinc-100">
            Back to Licenses
          </Link>
    </main>
  )
}
