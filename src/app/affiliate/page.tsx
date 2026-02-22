export const runtime = 'nodejs'

export default function AffiliatePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Affiliate Management</h1>
      <p className="mt-1 text-sm text-zinc-400">Manage affiliate partners, payouts, and referral tracking.</p>
      {/* TODO: Add affiliate stats, payout requests, referral links, etc. */}
      <ul className="mt-6 space-y-4">
        <li><a href="/admin/payouts" className="text-blue-400 underline">Payout Requests</a></li>
        <li><a href="/dashboard/billing" className="text-blue-400 underline">Billing & Assets</a></li>
        <li><a href="/partners/dashboard" className="text-blue-400 underline">Partner Dashboard</a></li>
        {/* Add more affiliate features as needed */}
      </ul>
    </main>
  )
}
