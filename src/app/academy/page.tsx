'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'academy_v1_full_module_statuses';
const LEGACY_STORAGE_KEY = 'academy_alpha_completed_modules_v1';

type ModuleStatus = 'not-started' | 'in-progress' | 'completed';

type AcademyModule = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  accent: string;
  specialization: string;
  external?: boolean;
};

const modules: AcademyModule[] = [
  {
    id: '01',
    title: 'The Great Reset',
    subtitle: 'Foundational Sovereignty',
    description:
      'Rewire your operational mindset for post-platform ownership. Learn the frameworks behind identity-first sovereignty.',
    href: '/promotions',
    accent: 'border-teal-500/30',
    specialization: 'Foundation Specialization',
  },
  {
    id: '02',
    title: 'On-Chain Identity',
    subtitle: 'Mastering the MARZ Vault',
    description:
      'Deploy, secure, and manage your .marz identity stack. Move from registration to protocol-native command operations.',
    href: '/dashboard/marz',
    accent: 'border-blue-500/30',
    specialization: 'Identity Specialization',
  },
  {
    id: '03',
    title: 'Infrastructure Defense',
    subtitle: 'SSL & DNS Hardening',
    description:
      'Fortify your stack with resilient SSL and DNS architecture. Build continuity against disruption with enterprise controls.',
    href: '/dashboard/infrastructure',
    accent: 'border-purple-500/30',
    specialization: 'Security Specialization',
  },
  {
    id: '04',
    title: 'AI Architecture Stream',
    subtitle: 'Tactical LLM engineering & Sovereign AI deployment.',
    description:
      'Build resilient LLM systems for mission-critical operations and deploy private AI stacks with enterprise-grade controls.',
    href: 'https://github.com/anthropics/courses',
    accent: 'border-cyan-500/30',
    specialization: 'AI Specialization',
    external: true,
  },
  {
    id: '05',
    title: 'Smart Contract Forge',
    subtitle: 'Advanced Solidity engineering & Security Auditing.',
    description:
      'Engineer secure contracts, threat-model your protocol surface, and apply audit-grade patterns for sovereign execution layers.',
    href: 'https://updraft.cyfrin.io/',
    accent: 'border-emerald-500/30',
    specialization: 'Security Specialization',
    external: true,
  },
  {
    id: '06',
    title: 'Ethereum Core Protocol',
    subtitle: 'Mastering the EVM & Decentralized infrastructure.',
    description:
      'Gain command over EVM mechanics, node workflows, and protocol-level architecture powering robust decentralized platforms.',
    href: 'https://university.alchemy.com/',
    accent: 'border-indigo-500/30',
    specialization: 'Protocol Specialization',
    external: true,
  },
  {
    id: '07',
    title: 'DApp Architect Lab',
    subtitle: 'Interactive gamified build-out of sovereign decentralized apps.',
    description:
      'Train by building full-stack dApps through interactive scenarios and harden your delivery workflow from prototype to deployment.',
    href: 'https://cryptozombies.io/',
    accent: 'border-amber-500/30',
    specialization: 'DApp Specialization',
    external: true,
  },
];

function getBaseStatusMap(): Record<string, ModuleStatus> {
  return Object.fromEntries(modules.map((module) => [module.id, 'not-started'])) as Record<string, ModuleStatus>;
}

function getStatusWeight(status: ModuleStatus): number {
  if (status === 'completed') return 1;
  if (status === 'in-progress') return 0.5;
  return 0;
}

function getStatusStyles(status: ModuleStatus): string {
  if (status === 'completed') {
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  }
  if (status === 'in-progress') {
    return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  }
  return 'bg-neutral-900 text-neutral-500 border-neutral-700';
}

function getStatusLabel(status: ModuleStatus): string {
  if (status === 'completed') return 'Completed';
  if (status === 'in-progress') return 'In Progress';
  return 'Not Started';
}

export default function AcademyPage() {
  const [moduleStatus, setModuleStatus] = useState<Record<string, ModuleStatus>>(getBaseStatusMap);

  useEffect(() => {
    const next = getBaseStatusMap();

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, ModuleStatus>;
        if (parsed && typeof parsed === 'object') {
          modules.forEach((module) => {
            const status = parsed[module.id];
            if (status === 'not-started' || status === 'in-progress' || status === 'completed') {
              next[module.id] = status;
            }
          });
          setModuleStatus(next);
          return;
        }
      }
    } catch {
      // Ignore invalid persisted state and start fresh.
    }

    // Migrate legacy completion array if present.
    try {
      const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (!legacyRaw) {
        setModuleStatus(next);
        return;
      }
      const legacyParsed = JSON.parse(legacyRaw);
      if (Array.isArray(legacyParsed)) {
        legacyParsed.forEach((id) => {
          if (typeof id === 'string' && next[id]) {
            next[id] = 'completed';
          }
        });
      }
      setModuleStatus(next);
    } catch {
      setModuleStatus(next);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(moduleStatus));
  }, [moduleStatus]);

  const masteryPercent = useMemo(() => {
    if (modules.length === 0) return 0;
    const masteryPoints = modules.reduce((total, module) => {
      const status = moduleStatus[module.id] ?? 'not-started';
      return total + getStatusWeight(status);
    }, 0);
    return Math.round((masteryPoints / modules.length) * 100);
  }, [moduleStatus]);

  const completedCount = useMemo(() => {
    return modules.filter((module) => moduleStatus[module.id] === 'completed').length;
  }, [moduleStatus]);

  const inProgressCount = useMemo(() => {
    return modules.filter((module) => moduleStatus[module.id] === 'in-progress').length;
  }, [moduleStatus]);

  const founderUnlocked = completedCount === modules.length;

  function setTrackInProgress(moduleId: string) {
    setModuleStatus((prev) => {
      if (prev[moduleId] === 'completed') return prev;
      return { ...prev, [moduleId]: 'in-progress' };
    });
  }

  function toggleComplete(moduleId: string) {
    setModuleStatus((prev) => {
      if (prev[moduleId] === 'completed') {
        return { ...prev, [moduleId]: 'not-started' };
      }
      return { ...prev, [moduleId]: 'completed' };
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
              A private command curriculum for builders who refuse platform dependency. A unified 7-module masterclass spanning doctrine, AI systems, Solidity security, and decentralized architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div key={module.id} className={`card-glass p-6 border ${module.accent} hover:border-teal-500/50 transition-all group`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-[10px] font-black tracking-widest uppercase text-neutral-500">Module {module.id}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border ${getStatusStyles(moduleStatus[module.id] ?? 'not-started')}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${(moduleStatus[module.id] ?? 'not-started') === 'completed' ? 'bg-emerald-400' : (moduleStatus[module.id] ?? 'not-started') === 'in-progress' ? 'bg-blue-400 animate-pulse' : 'bg-neutral-500'}`} />
                      {getStatusLabel(moduleStatus[module.id] ?? 'not-started')}
                    </span>
                  </div>
                  <p className="text-gradient text-[10px] font-bold uppercase tracking-wider mb-2">{module.specialization}</p>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <button
                      type="button"
                      onClick={() => toggleComplete(module.id)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-black tracking-wider uppercase border transition-all ${
                        moduleStatus[module.id] === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-neutral-900 text-neutral-500 border-neutral-700 hover:border-teal-500/40 hover:text-teal-400'
                      }`}
                      aria-label={`Mark module ${module.id} as completed`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          moduleStatus[module.id] === 'completed' ? 'bg-emerald-400' : 'bg-neutral-500'
                        }`}
                      />
                      {moduleStatus[module.id] === 'completed' ? 'Reset' : 'Mark Complete'}
                    </button>
                  </div>
                  <h2 className="text-sovereign-title text-lg text-white mb-1 group-hover:text-teal-300 transition-colors">
                    {module.title}
                  </h2>
                  <p className="text-gradient text-xs font-bold uppercase tracking-wider mb-3">{module.subtitle}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6">{module.description}</p>
                  {module.external ? (
                    <a
                      href={module.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setTrackInProgress(module.id)}
                      className="text-teal-400 font-bold text-xs uppercase tracking-wider hover:text-teal-300 transition-colors"
                    >
                      Launch Track ↗
                    </a>
                  ) : (
                    <Link
                      href={module.href}
                      onClick={() => setTrackInProgress(module.id)}
                      className="text-teal-400 font-bold text-xs uppercase tracking-wider hover:text-teal-300 transition-colors"
                    >
                      Launch Track →
                    </Link>
                  )}
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
                <p className="text-neutral-500 text-xs mt-2">Complete all 7 integrated modules to unlock Founder's certification.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="rounded-xl border border-neutral-800 bg-black/20 px-3 py-2 text-center">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Completed</p>
                  <p className="text-emerald-400 font-black text-lg">{completedCount}</p>
                </div>
                <div className="rounded-xl border border-neutral-800 bg-black/20 px-3 py-2 text-center">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider">In Progress</p>
                  <p className="text-blue-400 font-black text-lg">{inProgressCount}</p>
                </div>
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
                      ? 'Unlocked. You have completed all 7 modules in the integrated MARZ curriculum.'
                      : 'Reserved for Sovereign Members completing all 7 integrated MARZ Academy modules.'}
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
