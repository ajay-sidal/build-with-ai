import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exclusive Promotions | BUILDWITHAI',
  description: 'Limited-time sovereign infrastructure offers. Claim your .marz identity, migrate SSL/Domains, and unlock lifetime academy access at founder pricing.',
};

const offers = [
  {
    badge: 'GENESIS MINT',
    badgeColor: 'bg-teal-500/20 text-teal-400 border border-teal-500/30',
    glowColor: 'from-teal-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-teal-500/50',
    iconGlow: 'shadow-[0_0_30px_rgba(45,212,191,0.4)]',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'The Genesis Mint',
    description: 'Claim your .marz identity. $0 Gas Fees for the first 100 Sovereign Members.',
    detail: 'Be among the first sovereign identities on the MARZ Protocol. Your on-chain handle, zero friction, zero cost. This window closes forever once 100 mints are claimed.',
    spotsLabel: '100 spots',
    spotsRemaining: '100 remaining',
    cta: 'Claim Your Identity',
    ctaStyle: 'bg-teal-500 hover:bg-teal-400 text-neutral-950 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]',
    href: '/identity',
    stat: '$0 Gas',
    statLabel: 'First 100 only',
  },
  {
    badge: 'INFRASTRUCTURE BRIDGE',
    badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    glowColor: 'from-blue-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-blue-500/50',
    iconGlow: 'shadow-[0_0_30px_rgba(59,130,246,0.4)]',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
      </svg>
    ),
    title: 'Infrastructure Bridge',
    description: 'Migrate your SSL or Domain. Get 1 year of Premium DNS on us.',
    detail: 'Switch your existing infrastructure to The Sanctuary and receive a full year of Premium DNS at no charge. Enterprise-grade DNS propagation. Instant.',
    spotsLabel: 'Limited offer',
    spotsRemaining: 'Active now',
    cta: 'Start Migration',
    ctaStyle: 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]',
    href: '/signup?next=%2Fproducts%2Fssl',
    stat: '1 Year',
    statLabel: 'Premium DNS free',
  },
  {
    badge: 'ACADEMY FOUNDER',
    badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    glowColor: 'from-purple-500/10 via-transparent to-transparent',
    borderHover: 'hover:border-purple-500/50',
    iconGlow: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Academy Founder',
    description: 'Lifetime access to the MARZ Academy. 50% discount for early adopters.',
    detail: 'Lock in founder pricing before the public launch. Get every course, every module, every future drop — forever. The MARZ curriculum is the sovereign infrastructure playbook.',
    spotsLabel: 'Early adopter',
    spotsRemaining: 'Closing soon',
    cta: 'Unlock Lifetime Access',
    ctaStyle: 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]',
    href: '/signup?next=%2Facademy',
    stat: '50% Off',
    statLabel: 'Lifetime founders rate',
  },
];

export default function PromotionsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Ambient glow layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">

        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Limited Time — Sovereign Pricing Active
          </div>

          <h1 className="text-sovereign-header normal-case text-5xl md:text-7xl lg:text-8xl text-white mb-6">
            Exclusive <span className="text-gradient">Promotions</span>
          </h1>

          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Three offers. Zero compromise. The infrastructure of the decentralized future — at founding prices that will never exist again.
          </p>
        </div>

        {/* Trinity Offer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {offers.map((offer) => (
            <div
              key={offer.badge}
              className={`card-glass ${offer.borderHover} transition-all duration-300 group flex flex-col relative overflow-hidden`}
            >
              {/* Card inner glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${offer.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[16px]`} />

              <div className="relative z-10 p-8 md:p-10 flex flex-col flex-1">

                {/* Badge */}
                <div className="mb-6">
                  <span className={`inline-block text-[10px] font-black tracking-widest px-3 py-1 rounded-full ${offer.badgeColor}`}>
                    {offer.badge}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center mb-6 text-white transition-all duration-300 group-hover:${offer.iconGlow}`}>
                  {offer.icon}
                </div>

                {/* Stat pill */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl font-black text-gradient">{offer.stat}</span>
                  <span className="text-xs text-neutral-500 uppercase tracking-wider leading-tight">{offer.statLabel}</span>
                </div>

                {/* Title */}
                <h2 className="text-sovereign-title text-xl text-white mb-3">
                  {offer.title}
                </h2>

                {/* Tagline */}
                <p className="text-gradient text-sm font-semibold mb-4 leading-snug">
                  {offer.description}
                </p>

                {/* Detail */}
                <p className="text-neutral-400 text-sm leading-relaxed flex-1 mb-8">
                  {offer.detail}
                </p>

                {/* Spots indicator */}
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-6">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    {offer.spotsRemaining}
                  </span>
                  <span className="uppercase tracking-wider">{offer.spotsLabel}</span>
                </div>

                {/* CTA */}
                <Link
                  href={offer.href}
                  className={`w-full text-center px-6 py-3.5 rounded-xl text-sm font-black tracking-wide transition-all duration-300 ${offer.ctaStyle}`}
                >
                  {offer.cta} →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="max-w-4xl mx-auto">
          <div className="card-glass px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="text-teal-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">All offers fully guaranteed.</p>
                <p className="text-neutral-500 text-xs">No hidden fees. No contracts. Cancel anytime.</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5"><span className="text-teal-400">✓</span> Enterprise SLA</span>
              <span className="flex items-center gap-1.5"><span className="text-teal-400">✓</span> 99.9% Uptime</span>
              <span className="flex items-center gap-1.5"><span className="text-teal-400">✓</span> On-chain Verified</span>
            </div>
            <Link
              href="/signup?next=%2Fidentity"
              className="shrink-0 border border-teal-500/50 text-teal-400 hover:bg-teal-500/10 px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
            >
              Start your signup →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
