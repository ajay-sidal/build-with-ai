import type { Metadata } from 'next'
import PayoutsClient from './PayoutsClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Payouts',
  description: 'Review and approve partner payout requests.',
  robots: { index: false, follow: false },
}

export default function AdminPayoutsPage() {
  return <PayoutsClient />
}
