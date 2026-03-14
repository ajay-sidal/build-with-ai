'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const NAV_ITEMS = [
  { label: 'Mission Control', href: '/dashboard' },
  { label: 'MARZ Identity', href: '/dashboard/marz' },
  { label: 'Sovereign CRM', href: '/dashboard/leads', active: true },
  { label: 'Infrastructure', href: '/dashboard/infrastructure' },
  { label: 'Billing', href: '/dashboard/billing' },
  { label: 'API Console', href: '/dashboard/api' },
];

type DashboardLead = {
  id: string;
  name: string;
  service: string;
  budgetUsd: number;
  status: 'Discovery' | 'Proposal Sent' | 'Active Mission';
  email: string;
  createdAt: string;
};

function StatusPill({ status }: { status: string }) {
  if (status === 'Active Mission') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-400 border border-teal-500/30 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
        Active Mission
      </span>
    );
  }

  if (status === 'Proposal Sent') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        Proposal Sent
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      Discovery
    </span>
  );
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [potentialValueUsd, setPotentialValueUsd] = useState(0);
  const [activeMissions, setActiveMissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/dashboard/leads', { cache: 'no-store' });
        const data = (await res.json().catch(() => null)) as
          | { leads?: DashboardLead[]; potentialContractValueUsd?: number; activeMissions?: number; error?: string }
          | null;

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to load CRM pipeline');
        }

        if (!cancelled) {
          setLeads(Array.isArray(data?.leads) ? data.leads : []);
          setPotentialValueUsd(Number(data?.potentialContractValueUsd || 0));
          setActiveMissions(Number(data?.activeMissions || 0));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load CRM pipeline');
          setLeads([]);
          setPotentialValueUsd(0);
          setActiveMissions(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const liveIntakeLabel = useMemo(() => (loading ? 'Syncing database…' : 'Live Intake: database / leads.jsonl'), [loading]);

  return (
    <div className="min-h-screen bg-[#070709] text-white flex">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[520px] h-[320px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[380px] h-[380px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <aside className="relative z-10 hidden lg:flex flex-col w-64 min-h-screen bg-[#0a0a0c]/80 border-r border-neutral-800/60 backdrop-blur-xl">
        <div className="px-6 py-6 border-b border-neutral-800/60">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-teal-400">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-base tracking-tight">Sovereign CRM</p>
              <p className="text-teal-500 text-[10px] font-bold tracking-widest uppercase">Growth Command</p>
            </div>
          </Link>
        </div>

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
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="relative z-10 flex-1 px-4 md:px-8 py-10 max-w-6xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">Ajay Command Center</p>
            <h1 className="text-sovereign-header normal-case text-3xl md:text-5xl text-white mb-3">Sovereign CRM Mission Console</h1>
            <p className="text-neutral-400 text-sm md:text-base max-w-2xl">Manage inbound growth from your lead funnel and convert opportunities into active missions.</p>
          </div>
          <Link href="/leads" className="border border-teal-500/40 text-teal-400 hover:bg-teal-500/10 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
            Open Public Leads Form
          </Link>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-glass p-6">
            <h2 className="text-sovereign-title text-lg text-white mb-3">Potential Contract Value</h2>
            <p className="text-4xl font-black text-gradient mb-2">{formatUsd(potentialValueUsd)}</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">Across current pipeline</p>
          </div>
          <div className="card-glass p-6">
            <h2 className="text-sovereign-title text-lg text-white mb-3">Active Missions</h2>
            <p className="text-4xl font-black text-teal-400 mb-2">{activeMissions}</p>
            <p className="text-neutral-500 text-xs uppercase tracking-wider">In progress this cycle</p>
          </div>
        </section>

        <section className="card-glass p-6 md:p-8 overflow-x-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sovereign-title text-lg text-white">Lead Pipeline</h2>
            <span className="text-xs text-neutral-500 uppercase tracking-wider">{liveIntakeLabel}</span>
          </div>

          {error ? <div className="mb-4 rounded-xl border border-red-800/40 bg-red-950/20 p-4 text-sm text-red-200">{error}</div> : null}

          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-neutral-800/80 text-left">
                <th className="py-3 px-2 text-[10px] font-black tracking-widest uppercase text-neutral-500">Name</th>
                <th className="py-3 px-2 text-[10px] font-black tracking-widest uppercase text-neutral-500">Service</th>
                <th className="py-3 px-2 text-[10px] font-black tracking-widest uppercase text-neutral-500">Budget</th>
                <th className="py-3 px-2 text-[10px] font-black tracking-widest uppercase text-neutral-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="py-8 text-neutral-500" colSpan={4}>Syncing live leads…</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td className="py-8 text-neutral-500" colSpan={4}>No leads found in the live intake store.</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-neutral-800/40 hover:bg-white/[0.02]">
                    <td className="py-3 px-2 text-sm font-semibold text-white">{lead.name}</td>
                    <td className="py-3 px-2 text-sm text-neutral-300">{lead.service}</td>
                    <td className="py-3 px-2 text-sm font-bold text-teal-400">{formatUsd(lead.budgetUsd)}</td>
                    <td className="py-3 px-2">
                      <StatusPill status={lead.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
