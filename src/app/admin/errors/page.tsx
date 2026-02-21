import type { Metadata } from 'next'
import ErrorsClient from './ErrorsClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Errors',
  description: 'Client-side crash log viewer.',
  robots: { index: false, follow: false },
}

export default function AdminErrorsPage() {
  return <ErrorsClient />
}
