'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'academy_alpha_completed_modules_v1';

const modules = [
  {
    id: '01',
    title: 'The Great Reset',
    subtitle: 'Foundational Sovereignty',
    description:
      'Rewire your operational mindset for post-platform ownership. Learn the frameworks behind identity-first sovereignty.',
    href: '/promotions',
    accent: 'border-teal-500/30',
  },
  {
    id: '02',
    title: 'On-Chain Identity',
    subtitle: 'Mastering the MARZ Vault',
    description:
      'Deploy, secure, and manage your .marz identity stack. Move from registration to protocol-native command operations.',
    href: '/dashboard/marz',
    accent: 'border-blue-500/30',
  },
  {
    id: '03',
    title: 'Infrastructure Defense',
    subtitle: 'SSL & DNS Hardening',
    description:
      'Fortify your stack with resilient SSL and DNS architecture. Build continuity against disruption with enterprise controls.',
    href: '/dashboard/infrastructure',
    accent: 'border-purple-500/30',
  },
];

export default function AcademyPage() {
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setCompletedModules(parsed.filter((id) => typeof id === 'string'));
      }
    } catch {
      // Ignore invalid persisted state and start fresh.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedModules));
  }, [completedModules]);

  const masteryPercent = useMemo(() => {
    if (modules.length === 0) return 0;
    return Math.round((completedModules.length / modules.length) * 100);
  }, [completedModules]);

  const founderUnlocked = completedModules.length === modules.length;

  function toggleModule(moduleId: string) {
    setCompletedModules((prev) => {
      if (prev.includes(moduleId)) {
        return prev.filter((id) => id !== moduleId);
      }
      return [...prev, moduleId];
    });
  }

  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white pt-24">
      <section className="relative py-20 overflow-hidden border-b border-neutral-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-teal-500/5 blur-[140px]" />
          <div className="absolute -bottom-20 right-20 w-72 h-72 bg-purple-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-14">
            <span className="text-teal-500 font-bold text-xs tracking-widest uppercase mb-4 block">Intelligence Briefing Active</span>
            <h1 className="text-sovereign-header normal-case text-4xl md:text-6xl text-white mb-6">
              MARZ Academy: <span className="text-gradient">Sovereign Operating Doctrine</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-3xl mx-auto leading-relaxed">
              A private command curriculum for builders who refuse platform dependency. Learn doctrine, deploy identity, defend infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div key={module.id} className={`card-glass p-6 border ${module.accent} hover:border-teal-500/50 transition-all group`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-[10px] font-black tracking-widest uppercase text-neutral-500">Module {module.id}</p>
                    <button
                      type="button"
                      onClick={() => toggleModule(module.id)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border transition-all ${
                        completedModules.includes(module.id)
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-neutral-900 text-neutral-500 border-neutral-700 hover:border-teal-500/40 hover:text-teal-400'
                      }`}
                      aria-label={`Mark module ${module.id} as completed`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          completedModules.includes(module.id) ? 'bg-emerald-400' : 'bg-neutral-500'
                        }`}
                      />
                      {completedModules.includes(module.id) ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                  <h2 className="text-sovereign-title text-lg text-white mb-1 group-hover:text-teal-300 transition-colors">
                    {module.title}
                  </h2>
                  <p className="text-gradient text-xs font-bold uppercase tracking-wider mb-3">{module.subtitle}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">{module.description}</p>
                  <Link href={module.href} className="text-teal-400 font-bold text-xs uppercase tracking-wider hover:text-teal-300 transition-colors">
                    Enter Briefing →
                  </Link>
                </div>
              ))}
            </div>

            <div className="card-glass p-6 border border-neutral-800/80">
              <h2 className="text-sovereign-title text-lg text-white mb-4">Mastery Track</h2>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Doctrine Completion</span>
                  <span className="text-teal-400 font-black text-sm">{masteryPercent}%</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-blue-500"
                    style={{ width: `${masteryPercent}%` }}
                  />
                </div>
                <p className="text-neutral-500 text-xs mt-2">Complete all 3 alpha modules to unlock Founder's certification.</p>
              </div>

              <div className={`rounded-2xl p-5 text-center relative overflow-hidden border ${founderUnlocked ? 'border-teal-400/50 bg-teal-500/10' : 'border-teal-500/30 bg-teal-500/5'}`}>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-teal-500/5 to-purple-500/5" />
                <div className="relative z-10">
                  <div className={`mx-auto mb-3 w-14 h-14 rounded-full border bg-black/40 flex items-center justify-center text-teal-400 ${founderUnlocked ? 'border-teal-300/60 shadow-[0_0_30px_rgba(45,212,191,0.45)]' : 'border-teal-400/40 shadow-[0_0_24px_rgba(45,212,191,0.25)]'}`}>
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l2.8 5.6 6.2.9-4.5 4.4 1.1 6.2L12 17.2 6.4 20l1.1-6.2L3 9.5l6.2-.9L12 3z" />
                    </svg>
                  </div>
                  <p className="text-sovereign-title text-base text-white mb-1">Founder's Badge</p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {founderUnlocked
                      ? 'Unlocked. You have completed Academy Alpha doctrine.'
                      : 'Reserved for early survivors completing Academy Alpha doctrine.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
