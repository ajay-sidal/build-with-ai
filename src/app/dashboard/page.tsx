'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { label: 'Mission Control', href: '/dashboard', active: true },
  { label: 'MARZ Identity', href: '/dashboard/marz' },
  { label: 'Sovereign CRM', href: '/dashboard/leads' },
  { label: 'Infrastructure', href: '/dashboard/infrastructure' },
  { label: 'Billing', href: '/dashboard/billing' },
  { label: 'API Console', href: '/dashboard/api' },
];

const quickActions = [
  {
    title: 'Open Ticket',
    description: 'Request immediate support from Sanctuary operators.',
    href: '/leads',
    accent: 'border-teal-500/30 hover:border-teal-400/60',
  },
  {
    title: 'Bridge Domain',
    description: 'Migrate your DNS and SSL stack into sovereign infrastructure.',
    href: '/products/domains/transfer',
    accent: 'border-blue-500/30 hover:border-blue-400/60',
  },
  {
    title: 'Enter Academy',
    description: 'Unlock tactical MARZ curriculum and operating doctrine.',
    href: '/academy',
    accent: 'border-purple-500/30 hover:border-purple-400/60',
  },
];

export default function DashboardPage() {
  const [membershipTier, setMembershipTier] = useState('Syncing profile');
  const [services, setServices] = useState<Array<{ name: string; status: 'Active' | 'Inactive' }>>([]);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSnapshot() {
      try {
        setSnapshotError(null);
        const res = await fetch('/api/dashboard/snapshot', { cache: 'no-store' });
        const data = (await res.json().catch(() => null)) as
          | { membershipTier?: string; securityServices?: Array<{ name: string; status: 'Active' | 'Inactive' }>; error?: string }
          | null;

        if (!res.ok) {
          throw new Error(data?.error || 'Failed to load account snapshot');
        }

        if (!cancelled) {
          setMembershipTier(data?.membershipTier || 'AI Explorer');
          setServices(Array.isArray(data?.securityServices) ? data.securityServices : []);
        }
      } catch (err) {
        if (!cancelled) {
          setSnapshotError(err instanceof Error ? err.message : 'Failed to load account snapshot');
          setMembershipTier('Unavailable');
          setServices([]);
        }
      }
    }

    loadSnapshot();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#070709] text-white flex">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 left-1/4 w-[560px] h-[360px] bg-teal-500/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-10 w-[420px] h-[360px] bg-purple-500/5 rounded-full blur-[120px]" />
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
              <p className="text-white font-bold text-base tracking-tight">User Mission Control</p>
              <p className="text-teal-500 text-[10px] font-bold tracking-widest uppercase">Sovereign Home Base</p>
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
              {item.active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="relative z-10 flex-1 px-4 md:px-8 py-10 max-w-6xl mx-auto w-full space-y-8">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 mb-2">Sovereign Operations</p>
            <h1 className="text-sovereign-header normal-case text-3xl md:text-5xl text-white mb-3">User Mission Control</h1>
            <p className="text-neutral-400 text-sm md:text-base max-w-2xl">This is your command deck for security, identity, and infrastructure actions across the Sanctuary network.</p>
          </div>
          <Link href="/dashboard/marz" className="border border-teal-500/40 text-teal-400 hover:bg-teal-500/10 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider w-fit">
            Open MARZ Vault
          </Link>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`card-glass p-6 border ${action.accent} transition-all group`}
            >
              <h2 className="text-sovereign-title text-lg text-white mb-2">{action.title}</h2>
              <p className="text-neutral-400 text-sm mb-5 leading-relaxed">{action.description}</p>
              <span className="text-xs text-teal-400 font-bold uppercase tracking-wider">Launch →</span>
            </Link>
          ))}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-glass p-6">
            <h2 className="text-sovereign-title text-lg text-white mb-4">Account Snapshot</h2>
            {snapshotError ? <div className="mb-4 rounded-lg border border-red-800/40 bg-red-950/20 px-3 py-2 text-xs text-red-200">{snapshotError}</div> : null}
            <div className="space-y-4">
              <div className="flex items-center justify-between border border-neutral-800 rounded-lg px-4 py-3 bg-black/20">
                <span className="text-neutral-400 text-sm">Membership Tier</span>
                <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  {membershipTier}
                </span>
              </div>
              <div className="border border-neutral-800 rounded-lg px-4 py-3 bg-black/20">
                <p className="text-neutral-400 text-sm mb-3">Security Services</p>
                <div className="space-y-2">
                  {services.length === 0 ? (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white">No live services found</span>
                      <span className="inline-flex items-center gap-1.5 text-neutral-500 text-[10px] font-black uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
                        Inactive
                      </span>
                    </div>
                  ) : services.map((service) => (
                    <div key={service.name} className="flex items-center justify-between text-sm">
                      <span className="text-white">{service.name}</span>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${service.status === 'Active' ? 'text-teal-400' : 'text-neutral-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${service.status === 'Active' ? 'bg-teal-400 animate-pulse' : 'bg-neutral-500'}`} />
                        {service.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card-glass p-6">
            <h2 className="text-sovereign-title text-lg text-white mb-4">Mission Shortcuts</h2>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/dashboard/leads" className="border border-neutral-800 hover:border-blue-500/50 rounded-lg px-4 py-3 transition-all bg-black/20">
                <p className="text-white font-semibold text-sm">Sovereign CRM</p>
                <p className="text-neutral-500 text-xs">Manage leads and proposal pipeline</p>
              </Link>
              <Link href="/dashboard/infrastructure" className="border border-neutral-800 hover:border-teal-500/50 rounded-lg px-4 py-3 transition-all bg-black/20">
                <p className="text-white font-semibold text-sm">Infrastructure Console</p>
                <p className="text-neutral-500 text-xs">DNS, SSL, and bridge operations</p>
              </Link>
              <Link href="/promotions" className="border border-neutral-800 hover:border-purple-500/50 rounded-lg px-4 py-3 transition-all bg-black/20">
                <p className="text-white font-semibold text-sm">Promotions Hub</p>
                <p className="text-neutral-500 text-xs">Active founder offers and mint opportunities</p>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
