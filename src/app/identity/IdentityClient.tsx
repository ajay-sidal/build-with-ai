"use client";

import Link from 'next/link'

const pillars = [
  {
    title: 'Privacy',
    body: 'Zero-Knowledge WHOIS. Your personal data never touches the public ledger.',
  },
  {
    title: 'Sovereignty',
    body: 'Censorship-Resistant DNS. Your assets are immune to centralized seizure.',
  },
  {
    title: 'Utility',
    body: 'One Domain, Total Control. Resolve your website, wallet, and social identity through one sovereign point.',
  },
]

const manifestoSteps = [
  {
    step: 'Step 1: Pointing',
    body: 'Update your records to the Sovereign Nameservers.',
  },
  {
    step: 'Step 2: Minting',
    body: 'The Protocol generates a Unique Identity Token (UIT) bound to your domain.',
  },
  {
    step: 'Step 3: Sovereignty',
    body: 'Access your domain through any Web3-enabled gateway, immune to regional censorship.',
  },
]

export default function IdentityClient() {
  return (
    <div className="w-full bg-[#0a0a0a] text-white">
      <section className="relative overflow-hidden border-b border-neutral-900 px-6 py-24 sm:px-10 lg:px-16">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/10 blur-[140px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-tight text-teal-400/90">Protocol Destination</p>
          <h1 className="text-sovereign-header mt-6 text-4xl uppercase text-white sm:text-6xl">
            SOVEREIGN IDENTITY
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-lg text-neutral-300 sm:text-xl">
            Stop Renting Your Identity. Bridge Your Domain to the Protocol.
          </p>

          <div className="mt-10">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-teal-400/60 bg-teal-500/15 px-8 py-3 text-sm font-black uppercase tracking-tight text-teal-300 shadow-[0_0_24px_rgba(20,184,166,0.28)] transition hover:bg-teal-500/25"
            >
              INITIATE BRIDGE
            </button>
          </div>

          <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-tight text-neutral-400">Bridge Progress Tracker</p>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm">
              <div className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-200">Web2 Domain</div>
              <div className="text-teal-400">→</div>
              <div className="rounded-lg border border-teal-500/40 bg-teal-500/10 px-3 py-2 text-teal-200">Web3 Sovereign Identity</div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-800">
              <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-teal-600 to-teal-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-sovereign-title text-center text-3xl uppercase text-white sm:text-4xl">The Three Pillars</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-7 transition hover:border-teal-500/50"
              >
                <h3 className="text-sovereign-title text-xl uppercase text-white">{pillar.title}</h3>
                <p className="mt-4 leading-relaxed text-neutral-300">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-neutral-900 bg-neutral-950/50 px-6 py-20 sm:px-10 lg:px-16">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-48 w-2/3 rounded-full bg-teal-500/10 blur-[110px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl">
          <h2 className="text-sovereign-header text-center text-3xl uppercase text-white sm:text-4xl">THE PROTOCOL MANIFESTO</h2>

          <article className="mx-auto mt-12 max-w-4xl rounded-2xl border border-neutral-800 bg-[#0a0a0a]/90 p-8 sm:p-10">
            <h3 className="text-sovereign-title text-2xl uppercase text-teal-400">DECENTRALIZED DNS WRAPPING</h3>
            <p className="mt-6 text-base leading-relaxed text-neutral-300 sm:text-lg">
              Traditional registrars are central points of failure. The Sanctuary Protocol wraps your existing DNS in a non-custodial cryptographic vault. This process detaches your identity from corporate oversight and anchors it to the MARZ Ledger.
            </p>
          </article>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {manifestoSteps.map((item, index) => (
              <article key={item.step} className="rounded-2xl border border-neutral-800 bg-[#0a0a0a] p-7">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-teal-500/60 bg-teal-500/10 text-sm font-black text-teal-300">
                  {index + 1}
                </div>
                <h4 className="text-sovereign-title mt-5 text-lg uppercase text-white">{item.step}</h4>
                <p className="mt-4 leading-relaxed text-neutral-300">{item.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-teal-400 hover:text-teal-300"
            >
              View Protocol Academy
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
