import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getDashboardLeadsData } from '@/lib/dashboardLeads'
import { getMarzDashboardData } from '@/lib/marzStore'
import { getOpenProviderHealth } from '@/lib/openproviderHealth'
import { getViewerContext } from '@/lib/viewerContext'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export default async function FounderDashboardPage() {
  const viewer = await getViewerContext()
  if (!viewer.isMasterAdmin) {
    redirect('/dashboard')
  }

  const [leads, marz, reseller] = await Promise.all([
    getDashboardLeadsData({ includeAll: true }),
    getMarzDashboardData(null),
    getOpenProviderHealth(),
  ])

  return (
    <main className="min-h-screen bg-[#070709] px-6 py-12 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="card-glass overflow-hidden p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-teal-400">Founder Command</p>
              <h1 className="text-sovereign-header text-4xl text-white">FOUNDER Dashboard</h1>
              <p className="mt-3 max-w-3xl text-sm text-neutral-400">
                Global authority view for mission leaders. CRM intake, MARZ registry, and OpenProvider reseller health are aggregated here without member-level filters.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/leads" className="rounded-lg border border-neutral-700 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-200 transition hover:border-teal-500/50 hover:text-teal-300">
                Sovereign CRM
              </Link>
              <Link href="/dashboard/marz" className="rounded-lg border border-neutral-700 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-200 transition hover:border-teal-500/50 hover:text-teal-300">
                MARZ Vault
              </Link>
              <Link href="/admin/dashboard" className="rounded-lg border border-teal-500/40 bg-teal-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-teal-300 transition hover:bg-teal-500/15">
                Admin Hub
              </Link>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="card-glass p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Lead Intake</p>
            <p className="mt-3 text-4xl font-black text-white">{leads.leads.length}</p>
            <p className="mt-2 text-sm text-neutral-400">Global CRM records</p>
          </div>
          <div className="card-glass p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Pipeline Value</p>
            <p className="mt-3 text-4xl font-black text-teal-400">{formatUsd(leads.potentialContractValueUsd)}</p>
            <p className="mt-2 text-sm text-neutral-400">Across all Sovereign Member submissions</p>
          </div>
          <div className="card-glass p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">MARZ Registry</p>
            <p className="mt-3 text-4xl font-black text-white">{marz.totalIdentities}</p>
            <p className="mt-2 text-sm text-neutral-400">Total minted identities</p>
          </div>
          <div className="card-glass p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Reseller Health</p>
            <p className={`mt-3 text-4xl font-black ${reseller.ok ? 'text-teal-400' : 'text-red-300'}`}>{reseller.ok ? 'LIVE' : 'DEGRADED'}</p>
            <p className="mt-2 text-sm text-neutral-400">Checked {new Date(reseller.checkedAt).toLocaleString()}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="card-glass overflow-hidden p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Global Leads</p>
                <h2 className="mt-2 text-2xl font-black text-white">Sovereign CRM</h2>
              </div>
              <p className="text-xs uppercase tracking-wider text-neutral-500">Active missions: {leads.activeMissions}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500">
                    <th className="px-2 py-3">Lead</th>
                    <th className="px-2 py-3">Service</th>
                    <th className="px-2 py-3">Budget</th>
                    <th className="px-2 py-3">Status</th>
                    <th className="px-2 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.leads.length === 0 ? (
                    <tr>
                      <td className="px-2 py-8 text-neutral-500" colSpan={5}>No lead records found.</td>
                    </tr>
                  ) : (
                    leads.leads.slice(0, 10).map((lead) => (
                      <tr key={lead.id} className="border-b border-neutral-900/80 text-neutral-300">
                        <td className="px-2 py-3">
                          <div className="font-semibold text-white">{lead.name}</div>
                          <div className="text-xs text-neutral-500">{lead.email}</div>
                        </td>
                        <td className="px-2 py-3">{lead.service}</td>
                        <td className="px-2 py-3 font-bold text-teal-400">{formatUsd(lead.budgetUsd)}</td>
                        <td className="px-2 py-3">{lead.status}</td>
                        <td className="px-2 py-3 text-xs text-neutral-500">{new Date(lead.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="card-glass p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">OpenProvider Reseller</p>
              <h2 className="mt-2 text-2xl font-black text-white">Authority Health</h2>
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500">Credentials</p>
                  <p className={reseller.credentialsConfigured ? 'text-teal-400' : 'text-red-300'}>{reseller.credentialsConfigured ? 'Configured' : 'Missing'}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Reseller ID</p>
                  <p className="text-white">{reseller.resellerId ?? 'Unavailable'}</p>
                </div>
                <div>
                  <p className="text-neutral-500">SSL Products</p>
                  <p className="text-white">{reseller.sslProductCount}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Plesk Licenses</p>
                  <p className="text-white">{reseller.pleskLicenseCount}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Domains</p>
                  <p className="text-white">{reseller.domainCount}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Transactions</p>
                  <p className="text-white">{reseller.transactionCount}</p>
                </div>
              </div>
              {reseller.error ? <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/20 p-3 text-sm text-red-200">{reseller.error}</div> : null}
            </div>

            <div className="card-glass p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">MARZ Global</p>
              <h2 className="mt-2 text-2xl font-black text-white">Registry Feed</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-black/20 px-4 py-3">
                  <span className="text-neutral-400">Gas Sponsored</span>
                  <span className="font-black text-teal-400">{formatUsd(marz.gasSponsoredUsd)}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-black/20 px-4 py-3">
                  <span className="text-neutral-400">Visible Assets</span>
                  <span className="font-black text-white">{marz.assets.length}</span>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {marz.assets.length === 0 ? (
                  <div className="rounded-xl border border-neutral-800 bg-black/20 px-4 py-4 text-sm text-neutral-500">No MARZ assets minted yet.</div>
                ) : (
                  marz.assets.map((asset) => (
                    <div key={asset.id} className="rounded-xl border border-teal-500/20 bg-black/20 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-white">{asset.identity}.marz</p>
                          <p className="text-xs uppercase tracking-wider text-neutral-500">{asset.status}</p>
                        </div>
                        <div className="text-right text-xs text-neutral-500">
                          <p>{formatUsd(asset.gasSponsoredUsd)}</p>
                          <p>{new Date(asset.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}