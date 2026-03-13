import { opClient } from '../../../lib/openprovider'
import { Server } from 'lucide-react'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

export default async function InfrastructurePage(props: PageProps) {
  const domainParam = (() => {
    const v = props.searchParams?.domain
    if (Array.isArray(v)) return v[0]
    return v
  })()

  const filterDomain = (domainParam || '').toString().trim().toLowerCase()

  let licenses: Awaited<ReturnType<typeof opClient.listPleskLicenses>> = []
  let loadError: string | null = null

  try {
    licenses = await opClient.listPleskLicenses()
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Failed to load licenses'
  }

  const filtered = filterDomain
    ? licenses.filter((l) => String(l.domain_name || '').toLowerCase() === filterDomain)
    : licenses

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <div>
        <div className="inline-flex items-center gap-2 text-zinc-300">
          <Server size={18} />
          <span className="text-xs uppercase tracking-widest">Infrastructure</span>
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Licenses</h1>
        <p className="mt-1 text-sm text-zinc-400">Activation codes and expiration dates for your hosted utilities.</p>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-red-800/40 bg-red-950/20 p-4 text-sm text-red-200">{loadError}</div>
      ) : null}

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60">
        <div className="px-5 pt-5">
          <h2 className="text-sm font-medium text-zinc-200">Plesk Licenses</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {filterDomain ? `Filtered to ${filterDomain}` : 'All active licenses'}
          </p>
        </div>

        <div className="px-5 pb-5 pt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                <th className="py-2 pr-4">Domain</th>
                <th className="py-2 pr-4">Activation Code</th>
                <th className="py-2 pr-4">Expires</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className="py-8 text-zinc-500" colSpan={4}>
                    No licenses found.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr
                    key={String(l.id ?? l.activation_code ?? l.domain_name ?? Math.random())}
                    className="border-b border-zinc-900/80 hover:bg-zinc-950"
                  >
                    <td className="py-3 pr-4 text-zinc-200">{String(l.domain_name || '—')}</td>
                    <td className="py-3 pr-4 font-mono text-zinc-100">{String(l.activation_code || '—')}</td>
                    <td className="py-3 pr-4 text-zinc-300">{String(l.expiration_date || '—')}</td>
                    <td className="py-3 text-zinc-300">{String(l.status || '—')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
