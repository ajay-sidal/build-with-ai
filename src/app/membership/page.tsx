import MembershipClient from './MembershipClient'

export const runtime = 'nodejs'

export default function MembershipPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Membership</h1>
        <p className="mt-1 text-sm text-zinc-400">Choose your pricing tier for domain markups.</p>
      </div>

      <MembershipClient />

      <div className="text-xs text-zinc-500">
        Note: This selection is stored in a cookie for this browser as a preview. Actual pricing entitlements
        are managed server-side via subscription billing.
      </div>
    </main>
  )
}
