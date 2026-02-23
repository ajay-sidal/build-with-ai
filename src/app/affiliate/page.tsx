export const runtime = 'nodejs'

import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'

export default function AffiliatePage() {
  const router = useRouter()
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Affiliate Management</h1>
      <p className="mt-1 text-sm text-zinc-400">Manage affiliate partners, payouts, and referral tracking.</p>
      {/* TODO: Add affiliate stats, payout requests, referral links, etc. */}
      <ul className="mt-6 space-y-4">
        <li>
          <Button variant="secondary" onClick={() => router.push('/admin/payouts')} className="text-blue-400 underline">
            Payout Requests
          </Button>
        </li>
        <li>
          <Button variant="secondary" onClick={() => router.push('/dashboard/billing')} className="text-blue-400 underline">
            Billing & Assets
          </Button>
        </li>
        <li>
          <Button variant="secondary" onClick={() => router.push('/partners/dashboard')} className="text-blue-400 underline">
            Partner Dashboard
          </Button>
        </li>
        {/* Add more affiliate features as needed */}
      </ul>
    </main>
  )
}
