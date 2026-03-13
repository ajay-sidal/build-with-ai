import type { Metadata } from 'next'
import LeadsClient from './LeadsClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Leads',
  description: 'Internal CRM view for AI Design prospects.',
  robots: { index: false, follow: false },
}

export default function AdminLeadsPage() {
  return <LeadsClient />
}
