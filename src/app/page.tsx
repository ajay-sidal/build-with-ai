import { Suspense } from 'react'
import DomainSearch from '../components/DomainSearch'
import LaunchMagnet from '../components/LaunchMagnet'

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16">
      <div className="mb-10">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Your AI registrar.
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-zinc-300">
          Describe what you’re building — we’ll suggest names, scan availability, and show instant pricing.
        </p>
      </div>

      <Suspense fallback={null}>
        <LaunchMagnet />
        <DomainSearch />
      </Suspense>

      <p className="mt-12 text-sm text-zinc-500">
        Tip: Try “I’m starting a sustainable fashion brand called Verde.”
      </p>
    </main>
  )
}
