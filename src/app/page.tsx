import type { Metadata, Viewport } from 'next'
import Link from "next/link";
import DomainSearch from "@/components/web3/DomainSearch";
import FAQ from "@/components/ui/FAQ";

export const metadata: Metadata = {
  title: 'BUILDWITHAI Enterprise',
  description: 'Sovereign Infrastructure for the Decentralized Future',
  alternates: {
    canonical: 'https://buildwithai.digital/',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function Home() {
  return (
    <div className="w-full">
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pb-12 pt-10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>
        <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-[10px] font-bold tracking-tight uppercase mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
            MARZ Web3 Interface Active
          </div>
          <h1 className="text-sovereign-header normal-case text-5xl md:text-7xl text-white mb-8">
            Sovereign Infrastructure for the <span className="text-teal-400">Decentralized Future</span>
          </h1>
          <p className="text-neutral-400 text-lg md:text-xl max-w-3xl mx-auto mb-12 opacity-90 font-medium leading-relaxed">The first SaaS platform to bridge Web2 Domains with the MARZ Protocol.</p>
          <div className="w-full max-w-3xl mb-12"><DomainSearch /></div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/promotions" className="bg-teal-500 hover:bg-teal-400 text-neutral-950 px-8 py-3 rounded-lg font-black text-sm transition-all shadow-[0_0_20px_rgba(45,212,191,0.3)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-pulse" />Limited Time Offers
            </Link>
            <Link href="/academy" className="bg-neutral-900 border border-neutral-800 hover:border-teal-500/50 text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-xl">Read Manifest</Link>
            <button className="bg-neutral-900 border border-neutral-800 hover:border-teal-500/50 text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-xl">Connect Wallet</button>
          </div>
        </div>
      </section>
      <section className="py-12 border-y border-neutral-900 bg-[#050505]/50 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] font-bold tracking-normal text-neutral-400 uppercase mb-8">Enterprise Infrastructure Secured By</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-50 grayscale hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-2 text-white">
              <svg aria-hidden="true" role="presentation" focusable="false" className="w-6 h-6 text-[#8247E5]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0l10.4 6v12L12 24l-10.4-6V6L12 0zm0 2.3L3.5 7.2v9.6L12 21.7l8.5-4.9V7.2L12 2.3z"/></svg>
              <span className="text-lg font-bold">polygon</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <svg aria-hidden="true" role="presentation" focusable="false" className="w-6 h-6 text-[#3B82F6]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2z"/></svg>
              <span className="text-lg font-bold">Alchemy</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <svg aria-hidden="true" role="presentation" focusable="false" className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9"></path></svg>
              <span className="text-lg font-bold">Global Registry</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <svg aria-hidden="true" role="presentation" focusable="false" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>
              <span className="text-lg font-bold">NEXT.js</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <svg aria-hidden="true" role="presentation" focusable="false" className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2"></path></svg>
              <span className="text-lg font-bold">Plesk</span>
            </div>
          </div>
        </div>
      </section>
      <section id="services-grid" className="py-24 relative z-10 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-sovereign-header text-4xl md:text-5xl text-white mb-4">The Sovereign <span className="text-teal-500">Ecosystem</span></h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto font-medium">Build, scale, and tokenize your digital presence.</p>
        </div>
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Sovereign Domains - 2 Col Span */}
          <Link href="/identity" className="md:col-span-2 block bg-neutral-900/40 border border-neutral-800 px-10 py-12 rounded-3xl group hover:border-teal-500/50 transition-all">
            <h3 className="text-sovereign-title text-2xl text-white mb-5">Sovereign Domains</h3>
            <p className="text-neutral-400 leading-relaxed mb-8">Every domain purchased natively bridges to a Web3 Smart Wallet.</p>
            <span className="text-teal-500 font-bold text-xs tracking-tight uppercase">Explore Engine →</span>
          </Link>
          {/* SSL Sanctuary - 1 Col Span */}
          <Link href="/products/ssl" className="block bg-neutral-900/40 border border-neutral-800 px-10 py-12 rounded-3xl group hover:border-teal-500/50 transition-all">
            <h3 className="text-sovereign-title text-xl text-white mb-5">SSL Sanctuary</h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">Bank-grade 256-bit encryption for total security.</p>
            <span className="text-teal-500 font-bold text-xs tracking-tight uppercase">Secure Now →</span>
          </Link>
          {/* Enterprise Hosting - 1 Col Span */}
          <Link href="/products/dns/hosting" className="block bg-neutral-900/40 border border-neutral-800 px-10 py-12 rounded-3xl group hover:border-teal-500/50 transition-all">
            <h3 className="text-sovereign-title text-xl text-white mb-5">Enterprise Hosting</h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">Dedicated server environments with premium architecture.</p>
            <span className="text-teal-500 font-bold text-xs tracking-tight uppercase">Deploy Server →</span>
          </Link>
          {/* DFY Agency - 2 Col Span */}
          <Link href="/agency" className="md:col-span-2 block bg-neutral-900/40 border border-neutral-800 px-10 py-12 rounded-3xl group hover:border-teal-500/50 transition-all">
            <h3 className="text-sovereign-title text-2xl text-white mb-5">DFY Agency Protocol</h3>
            <p className="text-neutral-400 leading-relaxed mb-8">Custom Web3-ready platforms designed by elite architects.</p>
            <span className="text-teal-400 font-bold text-xs tracking-tight uppercase">View Portfolio →</span>
          </Link>
          {/* MARZ Academy - 1 Col Span */}
          <Link href="/academy" className="block bg-neutral-900/40 border border-neutral-800 px-10 py-12 rounded-3xl group hover:border-teal-500/50 transition-all">
            <h3 className="text-sovereign-title text-xl text-white mb-5">MARZ Academy</h3>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">Master the protocol and unlock your sovereign infrastructure playbook.</p>
            <span className="text-teal-500 font-bold text-xs tracking-tight uppercase">Enter Academy →</span>
          </Link>
        </div>
      </section>
      <section className="py-24 bg-[#050505] border-y border-neutral-900 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-sovereign-header text-3xl text-white mb-12">The MARZ <span className="text-teal-500">Sovereignty Protocol</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="group"><div className="text-teal-500 font-bold text-xl mb-2">01. Bridge</div><p className="text-neutral-400 text-sm">Deploy via ICANN Elite backbone.</p></div>
            <div className="group"><div className="text-teal-500 font-bold text-xl mb-2">02. Tokenize</div><p className="text-neutral-400 text-sm">Mint RWA twin on-chain.</p></div>
            <div className="group"><div className="text-teal-400 font-bold text-xl mb-2">03. Earn</div><p className="text-neutral-400 text-sm">Claim 50 MARZ Credits instantly.</p></div>
          </div>
        </div>
      </section>
      <FAQ />
    </div>
  );
}
