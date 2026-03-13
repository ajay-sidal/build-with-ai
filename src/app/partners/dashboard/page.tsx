import type { Metadata } from 'next'
import PartnersDashboardClient from './PartnersDashboardClient'

export const metadata: Metadata = {
  title: 'Partner Dashboard',
  description: 'View your referral performance and commissions.',
}

export default function PartnersDashboardPage() {
  return <PartnersDashboardClient />
}
