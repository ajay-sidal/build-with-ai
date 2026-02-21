export default function LoadingBilling() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <div>
        <div className="h-6 w-48 rounded bg-zinc-900/60" />
        <div className="mt-2 h-4 w-72 rounded bg-zinc-900/40" />
      </div>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60">
        <div className="px-5 pt-5">
          <div className="h-4 w-24 rounded bg-zinc-900/60" />
          <div className="mt-2 h-3 w-56 rounded bg-zinc-900/40" />
        </div>
        <div className="px-5 pb-5 pt-4">
          <div className="h-40 w-full rounded bg-zinc-900/30" />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60">
        <div className="px-5 pt-5">
          <div className="h-4 w-28 rounded bg-zinc-900/60" />
          <div className="mt-2 h-3 w-48 rounded bg-zinc-900/40" />
        </div>
        <div className="px-5 pb-5 pt-4">
          <div className="h-40 w-full rounded bg-zinc-900/30" />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60">
        <div className="px-5 pt-5">
          <div className="h-4 w-40 rounded bg-zinc-900/60" />
          <div className="mt-2 h-3 w-64 rounded bg-zinc-900/40" />
        </div>
        <div className="px-5 pb-5 pt-4">
          <div className="h-36 w-full rounded bg-zinc-900/30" />
        </div>
      </section>
    </main>
  )
}
