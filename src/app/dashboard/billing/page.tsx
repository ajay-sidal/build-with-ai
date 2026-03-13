import { opClient } from '../../../lib/openprovider'
import RenewalManagement from './RenewalManagement'
import { unstable_cache } from 'next/cache'
import { getCurrentUserTier } from '../../../lib/entitlements'
import { tierLabel } from '../../../utils/membership'
import { calculateCustomerPrice, formatCurrency } from '../../../utils/pricing'
import ExternalLink from '../../../components/ExternalLink'

function formatMoney(currency?: string, amount?: number) {
  if (!currency || amount == null) return '—'
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const getInvoicesCached = unstable_cache(async () => opClient.listInvoices(), ['op-invoices'], { revalidate: 60 })
const getTransactionsCached = unstable_cache(async () => opClient.listTransactions(), ['op-transactions'], { revalidate: 60 })
const getDomainsCached = unstable_cache(async () => opClient.listDomains(), ['op-domains'], { revalidate: 60 })

export default async function BillingPage() {
  const userTier = await getCurrentUserTier()

  let invoices: Awaited<ReturnType<typeof opClient.listInvoices>> = []
  let transactions: Awaited<ReturnType<typeof opClient.listTransactions>> = []
  let domains: Awaited<ReturnType<typeof opClient.listDomains>> = []
  let loadError: string | null = null

  try {
    ;[invoices, transactions, domains] = await Promise.all([
      getInvoicesCached(),
      getTransactionsCached(),
      getDomainsCached(),
    ])
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Failed to load billing data'
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing & Assets</h1>
        <p className="mt-1 text-sm text-zinc-400">Invoices, transactions, and renewal risk at a glance.</p>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-red-800/40 bg-red-950/20 p-4 text-sm text-red-200">
          {loadError}
        </div>
      ) : null}

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60">
        <div className="px-5 pt-5">
          <h2 className="text-sm font-medium text-zinc-200">Potential Savings</h2>
          <p className="mt-1 text-xs text-zinc-500">Estimated domain pricing impact by tier.</p>
        </div>
        <div className="px-5 pb-5 pt-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-sm text-zinc-200">
              Current tier: <span className="font-medium text-zinc-100">{tierLabel(userTier)}</span>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {(['AI_EXPLORER', 'AI_ARCHITECT', 'ENTERPRISE_AI'] as const).map((t) => {
                const wholesale = 12
                const explorer = calculateCustomerPrice(wholesale, 'DOMAIN', { userTier: 'AI_EXPLORER' })
                const price = calculateCustomerPrice(wholesale, 'DOMAIN', { userTier: t })
                const savings = Math.max(0, explorer - price)

                return (
                  <div key={t} className="rounded-lg border border-zinc-800 p-3">
                    <div className="text-xs uppercase tracking-widest text-zinc-500">{tierLabel(t)}</div>
                    <div className="mt-1 text-sm text-zinc-200">
                      Example: {formatCurrency('USD', price)} on a {formatCurrency('USD', wholesale)} wholesale domain
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      vs Explorer: saves {formatCurrency('USD', savings)}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-3 text-xs text-zinc-500">
              This is an estimate based on markup policy; exact savings depend on the TLD wholesale price.
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60">
        <div className="px-5 pt-5">
          <h2 className="text-sm font-medium text-zinc-200">Invoices</h2>
          <p className="mt-1 text-xs text-zinc-500">Your direct infrastructure costs.</p>
        </div>
        <div className="px-5 pb-5 pt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                <th className="py-2 pr-4">Invoice</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Issued</th>
                <th className="py-2 pr-4">Due</th>
                <th className="py-2">Link</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td className="py-6 text-zinc-500" colSpan={6}>
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={String(inv.id ?? inv.number)} className="border-b border-zinc-900/80 hover:bg-zinc-950">
                    <td className="py-3 pr-4 font-medium text-zinc-100">{inv.number || inv.id || '—'}</td>
                    <td className="py-3 pr-4 text-zinc-300">{inv.status || '—'}</td>
                    <td className="py-3 pr-4 text-zinc-300">{formatMoney(inv.currency, inv.amount)}</td>
                    <td className="py-3 pr-4 text-zinc-300">{inv.issued_at || '—'}</td>
                    <td className="py-3 pr-4 text-zinc-300">{inv.due_at || '—'}</td>
                    <td className="py-3">
                      {inv.url ? (
                        <ExternalLink className="text-zinc-200 underline underline-offset-4" href={inv.url} target="_blank">
                          View
                        </ExternalLink>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60">
        <div className="px-5 pt-5">
          <h2 className="text-sm font-medium text-zinc-200">Transactions</h2>
          <p className="mt-1 text-xs text-zinc-500">Ledger-style activity.</p>
        </div>
        <div className="px-5 pb-5 pt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs text-zinc-500">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Description</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td className="py-6 text-zinc-500" colSpan={4}>
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={String(t.id ?? t.created_at ?? Math.random())} className="border-b border-zinc-900/80 hover:bg-zinc-950">
                    <td className="py-3 pr-4 text-zinc-300">{t.created_at || '—'}</td>
                    <td className="py-3 pr-4 text-zinc-200">{t.description || '—'}</td>
                    <td className="py-3 pr-4 text-zinc-300">{formatMoney(t.currency, t.amount)}</td>
                    <td className="py-3 text-zinc-300">{t.status || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <RenewalManagement
        domains={(domains || [])
          .filter((d) => typeof d.domain === 'string')
          .map((d) => ({
            domain: d.domain as string,
            expiration_date: d.expiration_date,
            is_auto_renew_enabled: d.is_auto_renew_enabled,
          }))}
      />
    </main>
  )
}
