'use client';

import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Mission Control', href: '/dashboard' },
  { label: 'MARZ Identity', href: '/dashboard/marz' },
  { label: 'Sovereign CRM', href: '/dashboard/leads', active: true },
  { label: 'Infrastructure', href: '/dashboard/infrastructure' },
  { label: 'Billing', href: '/dashboard/billing' },
  { label: 'API Console', href: '/dashboard/api' },
];

const leads = [
  { name: 'A. Patel', service: 'SSL Migration', budget: '$4,800', status: 'Discovery' },
  { name: 'M. Rivers', service: 'Domain Portfolio Bridge', budget: '$12,000', status: 'Proposal Sent' },
  { name: 'N. Ortega', service: 'Premium DNS Setup', budget: '$2,400', status: 'Discovery' },
  { name: 'K. Johnson', service: 'Enterprise API Integration', budget: '$18,500', status: 'Proposal Sent' },
  { name: 'S. Kim', service: 'Brand Protection Package', budget: '$9,200', status: 'Discovery' },
];

function StatusPill({ status }: { status: string }) {
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

export default function DashboardLeadsPage() {
  const potentialValue = '$46,900';
  const activeMissions = '5';

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
            <p className="text-4xl font-black text-gradient mb-2">{potentialValue}</p>
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
            <span className="text-xs text-neutral-500 uppercase tracking-wider">Live Intake: /leads</span>
          </div>

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
              {leads.map((lead) => (
                <tr key={`${lead.name}-${lead.service}`} className="border-b border-neutral-800/40 hover:bg-white/[0.02]">
                  <td className="py-3 px-2 text-sm font-semibold text-white">{lead.name}</td>
                  <td className="py-3 px-2 text-sm text-neutral-300">{lead.service}</td>
                  <td className="py-3 px-2 text-sm font-bold text-teal-400">{lead.budget}</td>
                  <td className="py-3 px-2">
                    <StatusPill status={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
