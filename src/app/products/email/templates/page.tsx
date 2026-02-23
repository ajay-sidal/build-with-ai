import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Email Templates | Custom Transactional Emails',
  description: 'Customize transactional emails for your brand. ICANN-mandated emails and custom notifications.',
  openGraph: { title: 'Email Templates | BuildWithAI', url: '/products/email/templates' },
}

export default function EmailTemplatesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">Email Templates</h1>
        <p className="mt-2 text-zinc-400">Customize transactional emails for your brand</p>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-medium">Template Types</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {['WDRP (Whois Data Reminder)', 'ERRP (Expiration Recovery)', 'FOA (Transfer Authorization)', 'IVE (Information Verification)', 'TCN (Trademark Claims)', 'Custom Notifications'].map((t) => (
            <div key={t} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-300">{t}</div>
          ))}
        </div>
      </div>

      <Link href="/products" className="inline-flex items-center text-zinc-300 hover:text-zinc-100">
        Back to Products →
      </Link>
    </main>
  )
}
