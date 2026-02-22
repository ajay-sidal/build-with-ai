import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { redirect } from 'next/navigation'

export const runtime = 'nodejs'

export default async function AdminDashboardPage() {
  // Get session using NextAuth
  const session = await getServerSession(authOptions)
  
  // Check if user is authenticated as admin
  const isAdmin = session?.user?.email === 'admin@buildwithai.digital'
  
  if (!session || !isAdmin) {
    redirect('/login?admin=1')
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-400">Enterprise admin features for subscribers, affiliates, investors, agencies.</p>
      {/* TODO: Add links to affiliate management, subscriber management, investor tools, agency tools, payout requests, audit logs, etc. */}
      <ul className="mt-6 space-y-4">
        <li><a href="/admin/leads" className="text-blue-400 underline">Leads Management</a></li>
        <li><a href="/admin/payouts" className="text-blue-400 underline">Payout Requests</a></li>
        <li><a href="/admin/errors" className="text-blue-400 underline">Error Logs</a></li>
        <li><a href="/partners/dashboard" className="text-blue-400 underline">Partner Dashboard</a></li>
        <li><a href="/dashboard/api" className="text-blue-400 underline">API Keys</a></li>
        <li><a href="/dashboard/billing" className="text-blue-400 underline">Billing & Assets</a></li>
        <li><a href="/dashboard/infrastructure" className="text-blue-400 underline">Infrastructure</a></li>
        <li><a href="/affiliate" className="text-blue-400 underline">Affiliate Management</a></li>
        {/* Add more admin features as needed */}
      </ul>
    </main>
  )
}
