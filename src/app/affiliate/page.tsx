import { Button } from '../../components/ui/button'
import ClientRouterLinkButtons from '@/components/ClientRouterLinkButtons'

export default function AffiliatePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Affiliate Management</h1>
      <p className="mt-1 text-sm text-zinc-400">Manage affiliate partners, payouts, and referral tracking.</p>
      {/* TODO: Add affiliate stats, payout requests, referral links, etc. */}
      <div className="mt-6">
        <ClientRouterLinkButtons
          items={[
            { href: '/admin/payouts', label: 'Payout Requests', variant: 'secondary', className: 'text-blue-400 underline' },
            { href: '/dashboard/billing', label: 'Billing & Assets', variant: 'secondary', className: 'text-blue-400 underline' },
            { href: '/partners/dashboard', label: 'Partner Dashboard', variant: 'secondary', className: 'text-blue-400 underline' },
          ]}
        />
      </div>
    </main>
  )
}
