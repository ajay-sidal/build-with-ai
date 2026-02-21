import { Suspense } from 'react'
import SignupForm from './SignupForm'

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-16 text-sm text-zinc-500">
          Loading…
        </main>
      }
    >
      <SignupForm />
    </Suspense>
  )
}
