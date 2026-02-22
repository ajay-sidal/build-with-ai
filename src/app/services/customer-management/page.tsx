import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Management | Contact & Handle Management',
  description: 'Manage customer contacts and handles. ICANN-compliant contact management with verification, additional data support, and API access.',
  openGraph: { title: 'Customer Management | BuildWithAI', url: '/services/customer-management' },
}

export default function CustomerManagementPage() {
  const features = [
    { title: 'Contact Handles', desc: 'Create and manage customer contact objects' },
    { title: 'Verification', desc: 'Email verification for ICANN compliance' },
    { title: 'Additional Data', desc: 'TLD-specific required fields support' },
    { title: 'API Access', desc: 'Full CRUD operations via REST API' },
    { title: 'Bulk Operations', desc: 'Manage multiple contacts efficiently' },
    { title: 'Tag Management', desc: 'Organize contacts with custom tags' },
  ]

  const useCases = [
    { title: 'Domain Resellers', desc: 'Manage customer contacts for domain registrations' },
    { title: 'Web Agencies', desc: 'Centralized contact management for clients' },
    { title: 'Enterprises', desc: 'Organizational contact hierarchy' },
    { title: 'Compliance Teams', desc: 'Ensure ICANN and GDPR compliance' },
  ]

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold">Customer Management</h1>
        <p className="mt-2 text-zinc-400">Comprehensive contact and handle management</p>
      </div>

      <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
            <h3 className="font-medium text-zinc-100">{f.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mb-16">
        <h2 className="mb-4 text-xl font-medium text-zinc-100">Use Cases</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {useCases.map((u) => (
            <div key={u.title} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
              <h3 className="font-medium text-zinc-100">{u.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{u.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-6">
        <h2 className="text-lg font-medium text-zinc-100">API Endpoints</h2>
        <div className="mt-4 space-y-2 font-mono text-sm">
          <div className="flex items-center gap-3">
            <span className="rounded bg-emerald-950/50 px-2 py-1 text-emerald-400">GET</span>
            <span className="text-zinc-300">/v1beta/contacts</span>
            <span className="text-zinc-500">List contacts</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded bg-blue-950/50 px-2 py-1 text-blue-400">POST</span>
            <span className="text-zinc-300">/v1beta/contacts</span>
            <span className="text-zinc-500">Create contact</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded bg-amber-950/50 px-2 py-1 text-amber-400">PUT</span>
            <span className="text-zinc-300">/v1beta/contacts/&#123;id&#125;</span>
            <span className="text-zinc-500">Update contact</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded bg-red-950/50 px-2 py-1 text-red-400">DELETE</span>
            <span className="text-zinc-300">/v1beta/contacts/&#123;id&#125;</span>
            <span className="text-zinc-500">Delete contact</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <a href="/services" className="inline-flex items-center text-zinc-300 hover:text-zinc-100">
          Back to Services →
        </a>
      </div>
    </main>
  )
}
