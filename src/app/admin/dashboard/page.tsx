import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const runtime = 'nodejs'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''

export default async function AdminDashboardPage() {
  // Gate access by ADMIN_SECRET cookie
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get('admin_secret')?.value || ''
  
  if (!adminCookie || adminCookie !== ADMIN_SECRET) {
    redirect('/login?admin=1')
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-400">Enterprise admin features for subscribers, affiliates, investors, agencies.</p>
      <ul className="mt-6 space-y-4">
        <li><Link href="/dashboard/admin" className="text-blue-400 underline">FOUNDER Dashboard</Link></li>
        <li><Link href="/admin/leads" className="text-blue-400 underline">Leads Management</Link></li>
        <li><Link href="/admin/payouts" className="text-blue-400 underline">Payout Requests</Link></li>
        <li><Link href="/admin/errors" className="text-blue-400 underline">Error Logs</Link></li>
        <li><Link href="/partners/dashboard" className="text-blue-400 underline">Partner Dashboard</Link></li>
        <li><Link href="/dashboard/api" className="text-blue-400 underline">API Keys</Link></li>
        <li><Link href="/dashboard/billing" className="text-blue-400 underline">Billing & Assets</Link></li>
        <li><Link href="/dashboard/infrastructure" className="text-blue-400 underline">Infrastructure</Link></li>
        <li><Link href="/affiliate" className="text-blue-400 underline">Affiliate Management</Link></li>
      </ul>
    </main>
  )
}
