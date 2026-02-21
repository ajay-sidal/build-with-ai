export default function LoadingInfrastructure() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <div>
        <div className="h-4 w-32 rounded bg-zinc-900/40" />
        <div className="mt-3 h-6 w-44 rounded bg-zinc-900/60" />
        <div className="mt-2 h-4 w-80 rounded bg-zinc-900/40" />
      </div>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60">
        <div className="px-5 pt-5">
          <div className="h-4 w-28 rounded bg-zinc-900/60" />
          <div className="mt-2 h-3 w-56 rounded bg-zinc-900/40" />
        </div>
        <div className="px-5 pb-5 pt-4">
          <div className="h-44 w-full rounded bg-zinc-900/30" />
        </div>
      </section>
    </main>
  )
}
