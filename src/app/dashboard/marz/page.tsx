'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  {
    label: 'Mission Control',
    href: '/dashboard/mission-control',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: 'MARZ Identity',
    href: '/dashboard/marz',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    active: true,
  },
  {
    label: 'Infrastructure',
    href: '/dashboard/infrastructure',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
      </svg>
    ),
  },
  {
    label: 'Billing',
    href: '/dashboard/billing',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    label: 'API Console',
    href: '/dashboard/api',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
];

const EMPTY_SLOTS = Array.from({ length: 6 });

type MarzAsset = {
  id: string;
  identity: string;
  status: string;
  gasSponsoredUsd: number;
  createdAt: string;
};

type MarzDashboardResponse = {
  totalIdentities: number;
  gasSponsoredUsd: number;
  assets: MarzAsset[];
  error?: string;
};

export default function MARZDashboardPage() {
  const [identity, setIdentity] = useState('');
  const [minting, setMinting] = useState(false);
  const [mintedIdentity, setMintedIdentity] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalIdentities: 0, gasSponsoredUsd: 0, assets: [] as MarzAsset[] });
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        setDashboardError(null);
        const res = await fetch('/api/dashboard/marz', { cache: 'no-store' });
        const data = (await res.json().catch(() => null)) as MarzDashboardResponse | null;
        if (!res.ok) {
          throw new Error(data?.error || 'Failed to load MARZ dashboard');
        }
        if (!cancelled) {
          setStats({
            totalIdentities: Number(data?.totalIdentities || 0),
            gasSponsoredUsd: Number(data?.gasSponsoredUsd || 0),
            assets: Array.isArray(data?.assets) ? data.assets : [],
          });
        }
      } catch (err) {
        if (!cancelled) {
          setDashboardError(err instanceof Error ? err.message : 'Failed to load MARZ dashboard');
        }
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleMint(e: React.FormEvent) {
    e.preventDefault();
    if (!identity.trim()) return;
    setMinting(true);

    try {
      setDashboardError(null);
      const res = await fetch('/api/dashboard/marz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity }),
      });
      const data = (await res.json().catch(() => null)) as (MarzDashboardResponse & { minted?: { identity?: string }; error?: string }) | null;
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to mint identity');
      }

      setMintedIdentity(data?.minted?.identity ? `${data.minted.identity}.marz` : `${identity}.marz`);
      setStats({
        totalIdentities: Number(data?.totalIdentities || 0),
        gasSponsoredUsd: Number(data?.gasSponsoredUsd || 0),
        assets: Array.isArray(data?.assets) ? data.assets : [],
      });
      setIdentity('');
    } catch (err) {
      setDashboardError(err instanceof Error ? err.message : 'Failed to mint identity');
    } finally {
      setMinting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070709] text-white flex">

      {/* ── Ambient glow layer ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-teal-500/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/4 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-blue-500/3 rounded-full blur-[100px]" />
      </div>

      {/* ── Sidebar ── */}
      <aside className="relative z-20 hidden lg:flex flex-col w-64 min-h-screen bg-[#0a0a0c]/80 border-r border-neutral-800/60 backdrop-blur-xl">
        {/* Sidebar logo */}
        <div className="px-6 py-6 border-b border-neutral-800/60">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="text-teal-400 group-hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.6)] transition-all">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-base tracking-tight leading-tight">THE SANCTUARY</span>
              <span className="text-teal-500 text-[9px] tracking-widest font-bold uppercase">MARZ Protocol</span>
            </div>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                item.active
                  ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              {item.icon}
              {item.label}
              {item.active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer — protocol status */}
        <div className="px-4 py-4 border-t border-neutral-800/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 uppercase tracking-wider">Protocol</span>
            <span className="flex items-center gap-1.5 text-teal-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Active
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 uppercase tracking-wider">Gas</span>
            <span className="text-teal-400 font-bold">$0.00</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-500 uppercase tracking-wider">Chain</span>
            <span className="text-purple-400 font-bold">MARZ</span>
          </div>
          <Link href="/identity" className="block w-full text-center text-[10px] font-bold tracking-widest uppercase text-neutral-400 hover:text-teal-400 transition-colors py-2 border border-neutral-800 rounded-lg mt-2 hover:border-teal-500/30">
            View Protocol →
          </Link>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="relative z-10 flex-1 flex flex-col min-h-screen overflow-x-hidden">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#070709]/80 backdrop-blur-xl border-b border-neutral-800/60 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-teal-400">MARZ Protocol · Mission Control</span>
            </div>
            <h1 className="text-white font-black text-lg tracking-tight leading-none">Sovereign Identity Vault</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/promotions" className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-teal-400 border border-teal-500/30 hover:bg-teal-500/10 px-3 py-1.5 rounded-lg transition-all">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Genesis Mint Active
            </Link>
            <Link href="/dashboard" className="text-xs text-neutral-400 hover:text-white transition-colors font-medium">
              ← Dashboard
            </Link>
          </div>
        </header>

        <div className="flex-1 px-4 md:px-8 py-10 space-y-12 max-w-5xl mx-auto w-full">

          {/* ── Hero blurb ── */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">MARZ Protocol · Identity Layer</p>
              <h2 className="text-sovereign-header normal-case text-3xl md:text-5xl text-white mb-3">
                Mint Your <span className="text-gradient">Sovereign Identity</span>
              </h2>
              <p className="text-neutral-400 text-sm max-w-lg leading-relaxed">
                Your on-chain handle. Immutable. Gasless. Yours forever. The MARZ Protocol absorbs all network fees — you only pay with intention.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-4 text-xs text-neutral-500">
              <div className="text-center">
                <p className="text-white font-black text-2xl">{stats.totalIdentities}</p>
                <p className="uppercase tracking-wider">Minted identities</p>
              </div>
              <div className="w-px h-8 bg-neutral-800" />
              <div className="text-center">
                <p className="text-teal-400 font-black text-2xl">${stats.gasSponsoredUsd.toFixed(2)}</p>
                <p className="uppercase tracking-wider">Gas sponsored</p>
              </div>
            </div>
          </div>

          {dashboardError ? <div className="rounded-xl border border-red-800/40 bg-red-950/20 p-4 text-sm text-red-200">{dashboardError}</div> : null}

          {/* ── MINT CARD ── */}
          <div className="card-glass p-8 md:p-12 relative overflow-hidden">
            {/* Inner vault glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-purple-500/5 pointer-events-none rounded-[16px]" />
            {/* Top corner scan line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

            <div className="relative z-10 max-w-xl mx-auto">
              {/* Mint header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-black text-lg tracking-tight">Claim Your Identity</h3>
                  <p className="text-neutral-500 text-xs">Permanent · On-chain · Sovereign</p>
                </div>
                {/* Gasless pill */}
                <div className="ml-auto flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Protocol Covered: $0.00 Gas Fees
                </div>
              </div>

              {/* Input form */}
              {!mintedIdentity ? (
                <form onSubmit={handleMint} className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={identity}
                      onChange={(e) => setIdentity(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="your-identity"
                      maxLength={32}
                      className="w-full bg-[#0d0d10] border border-neutral-700 focus:border-teal-500/70 focus:outline-none text-white placeholder-neutral-600 text-lg font-bold tracking-tight pl-10 pr-24 py-4 rounded-xl transition-all focus:ring-1 focus:ring-teal-500/30 focus:shadow-[0_0_20px_rgba(45,212,191,0.08)]"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="text-teal-500/60 font-black text-sm tracking-tight">.marz</span>
                    </div>
                  </div>

                  {identity.length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      <span className="text-teal-400 font-bold">{identity}.marz</span>
                      <span className="text-neutral-500">· Available to mint</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!identity.trim() || minting}
                    className="w-full py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-teal-500 hover:bg-teal-400 text-neutral-950 shadow-[0_0_30px_rgba(45,212,191,0.25)] hover:shadow-[0_0_50px_rgba(45,212,191,0.45)] active:scale-[0.99]"
                  >
                    {minting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Broadcasting to MARZ Chain…
                      </span>
                    ) : (
                      '⬡  Mint Sovereign Identity'
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-400 shadow-[0_0_30px_rgba(45,212,191,0.3)]">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-teal-400 font-black text-xl mb-1">{mintedIdentity}</p>
                    <p className="text-neutral-400 text-sm">Identity minted and persisted to the live MARZ registry.</p>
                  </div>
                  <button onClick={() => { setMintedIdentity(null); setIdentity(''); }} className="text-xs text-neutral-500 hover:text-white transition-colors underline underline-offset-4">
                    Mint another identity
                  </button>
                </div>
              )}

              {/* Sub-trust strip */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[10px] text-neutral-600 uppercase tracking-wider">
                <span className="flex items-center gap-1"><span className="text-teal-500">✓</span> Gasless via Protocol</span>
                <span className="flex items-center gap-1"><span className="text-teal-500">✓</span> Non-custodial</span>
                <span className="flex items-center gap-1"><span className="text-teal-500">✓</span> Immutable on-chain</span>
                <span className="flex items-center gap-1"><span className="text-teal-500">✓</span> Transferable</span>
              </div>
            </div>
          </div>

          {/* ── Protocol stats bar ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Identities', value: stats.totalIdentities.toString(), sub: 'Live registry' },
              { label: 'Gas Sponsored', value: `$${stats.gasSponsoredUsd.toFixed(2)}`, sub: 'All time' },
              { label: 'Chain', value: 'MARZ', sub: 'Layer 1' },
              { label: 'Bridge Status', value: 'Live', sub: 'Gasless active', accent: true },
            ].map((s) => (
              <div key={s.label} className="card-glass px-5 py-4">
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">{s.label}</p>
                <p className={`font-black text-xl ${s.accent ? 'text-teal-400' : 'text-white'}`}>{s.value}</p>
                <p className="text-[10px] text-neutral-600 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* ── My Sovereign Assets ── */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-black text-lg tracking-tight">My Sovereign Assets</h3>
                <p className="text-neutral-500 text-xs mt-0.5">Your minted .marz identities and on-chain certificates will appear here</p>
              </div>
              <Link href="/identity" className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1">
                Browse Protocol →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.assets.length === 0
                ? EMPTY_SLOTS.map((_, i) => (
                    <div key={i} className="card-glass p-6 flex flex-col gap-3 relative overflow-hidden group">
                      <div className="flex items-center gap-3">
                        <div className="skeleton w-10 h-10 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <div className="skeleton h-3 w-3/4 rounded" />
                          <div className="skeleton h-2 w-1/2 rounded" />
                        </div>
                      </div>
                      <div className="skeleton h-2 w-full rounded" />
                      <div className="skeleton h-2 w-2/3 rounded" />
                      <div className="flex items-center justify-between mt-2">
                        <div className="skeleton h-5 w-16 rounded-full" />
                        <div className="skeleton h-5 w-10 rounded" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#0a0a0c]/80 rounded-[16px]">
                        <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Mint to populate</p>
                      </div>
                    </div>
                  ))
                : stats.assets.map((asset) => (
                    <div key={asset.id} className="card-glass p-6 flex flex-col gap-3 relative overflow-hidden border border-teal-500/20">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-white font-black text-base">{asset.identity}.marz</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Minted asset</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-teal-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                          {asset.status}
                        </span>
                      </div>
                      <div className="text-sm text-neutral-400">Gas sponsored: ${asset.gasSponsoredUsd.toFixed(2)}</div>
                      <div className="text-xs text-neutral-500">Created {new Date(asset.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
            </div>
          </div>

          {/* ── Quick links ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
            <Link href="/identity" className="card-glass hover:border-purple-500/40 transition-all p-6 flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">MARZ Token</p>
                <p className="text-neutral-500 text-xs">View tokenomics and governance</p>
              </div>
              <svg className="w-4 h-4 text-neutral-600 ml-auto group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/dashboard/infrastructure" className="card-glass hover:border-blue-500/40 transition-all p-6 flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                </svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Gasless Bridge</p>
                <p className="text-neutral-500 text-xs">Cross-chain asset infrastructure</p>
              </div>
              <svg className="w-4 h-4 text-neutral-600 ml-auto group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
