import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Email Verification | ICANN Compliance',
  description: 'Verify domain ownership and customer email addresses. ICANN-compliant verification for all domain registrations.',
  openGraph: { title: 'Email Verification | BuildWithAI', url: '/products/email/verification' },
}

export default function EmailVerificationPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">Email Verification</h1>
        <p className="mt-2 text-zinc-400">ICANN-compliant email verification for domain registrations</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { title: 'Domain Ownership', desc: 'Verify registrant email addresses' },
          { title: 'ICANN Compliance', desc: 'Meet regulatory requirements' },
          { title: 'Automated Reminders', desc: 'Prevent domain suspension' },
          { title: 'Custom Templates', desc: 'Brand your verification emails' },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h3 className="font-medium text-zinc-100">{f.title}</h3>
            <p className="mt-1 text-sm text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </div>

      <Link href="/products" className="inline-flex items-center text-zinc-300 hover:text-zinc-100">
        Back to Products →
      </Link>
    </main>
  )
}
