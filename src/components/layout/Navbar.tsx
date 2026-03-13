"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  return (
    <nav className="w-full bg-[#0a0a0a]/90 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-3">
          <div className="text-teal-400">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl tracking-wide leading-tight">BUILDWITHAI</span>
            <span className="text-teal-500 text-[10px] tracking-widest font-semibold uppercase">Enterprise</span>
          </div>
        </Link>

        {/* Desktop Links Container */}
        <div className="hidden xl:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
          {/* Dropdown 1: Products */}
          <div className="relative group py-8">
            <button className="hover:text-teal-400 transition-colors flex items-center gap-1">Products <span className="text-[10px]">&#9660;</span></button>
            <div className="absolute top-20 left-0 w-56 bg-[#0a0a0a] border border-neutral-800 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden flex flex-col">
              <Link href="#" className="px-4 py-3 hover:bg-neutral-900 hover:text-teal-400 border-b border-neutral-800/50">Domain Registration</Link>
              <Link href="#" className="px-4 py-3 hover:bg-neutral-900 hover:text-teal-400 border-b border-neutral-800/50">SSL Certificates</Link>
              <Link href="#" className="px-4 py-3 hover:bg-neutral-900 hover:text-teal-400 border-b border-neutral-800/50">Premium Email</Link>
              <Link href="#" className="px-4 py-3 hover:bg-neutral-900 hover:text-teal-400 border-b border-neutral-800/50">Plesk Hosting</Link>
              <Link href="#" className="px-4 py-3 hover:bg-neutral-900 hover:text-teal-400">Smart Wallets</Link>
            </div>
          </div>

          {/* Dropdown 2: Services */}
          <div className="relative group py-8">
            <button className="hover:text-teal-400 transition-colors flex items-center gap-1">Services <span className="text-[10px]">&#9660;</span></button>
            <div className="absolute top-20 left-0 w-48 bg-[#0a0a0a] border border-neutral-800 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden flex flex-col">
              <Link href="#" className="px-4 py-3 hover:bg-neutral-900 hover:text-teal-400 border-b border-neutral-800/50">DFY Websites</Link>
              <Link href="#" className="px-4 py-3 hover:bg-neutral-900 hover:text-teal-400 border-b border-neutral-800/50">Brand Protection</Link>
              <Link href="#" className="px-4 py-3 hover:bg-neutral-900 hover:text-teal-400">Enterprise API</Link>
            </div>
          </div>
          {/* Dropdown 3: Protocol */}
          <div className="relative group py-8">
            <button className="hover:text-teal-400 transition-colors flex items-center gap-1">Protocol <span className="text-[10px]">&#9660;</span></button>
            <div className="absolute top-20 left-0 w-48 bg-[#0a0a0a] border border-neutral-800 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden flex flex-col">
              <Link href="#" className="px-4 py-3 hover:bg-neutral-900 hover:text-teal-400 border-b border-neutral-800/50">MARZ Token</Link>
              <Link href="#" className="px-4 py-3 hover:bg-neutral-900 hover:text-teal-400 border-b border-neutral-800/50">Gasless Bridge</Link>
              <Link href="#" className="px-4 py-3 hover:bg-neutral-900 hover:text-teal-400">Whitepaper</Link>
            </div>
          </div>

          <Link href="#" className="hover:text-teal-400 transition-colors flex items-center gap-1">
            <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            MARZ Academy
          </Link>
          <Link href="#" className="hover:text-teal-400 transition-colors">Contact Us</Link>
        </div>

        {/* Right Actions & Theme Toggle */}
        <div className="flex items-center gap-3 lg:gap-5">
          
          {/* Theme Toggle Button */}
          <button onClick={() => setIsDark(!isDark)} className="text-neutral-400 hover:text-teal-400 transition-colors p-2" aria-label="Toggle Theme">
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            )}
          </button>

          <Link href="#" className="hidden lg:block border border-teal-500/50 text-teal-400 hover:bg-teal-500/10 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_10px_rgba(45,212,191,0.05)]">
            Book Appointment
          </Link>
          <Link href="#" className="hidden lg:block text-sm font-medium text-neutral-300 hover:text-white transition-colors">Login</Link>
          <button className="hidden lg:block bg-[#2dd4bf] hover:bg-teal-300 text-neutral-950 text-sm font-bold px-6 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)]">Sign Up</button>
          
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="xl:hidden text-teal-400 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileOpen && (
        <div className="xl:hidden bg-[#0a0a0a] border-b border-neutral-800 px-4 py-4 flex flex-col gap-4 text-sm z-50">
          <Link href="/" className="text-neutral-300 hover:text-teal-400">Home</Link>
          <Link href="#" className="text-neutral-300 hover:text-teal-400">Products</Link>
          <Link href="#" className="text-neutral-300 hover:text-teal-400">Services & DFY</Link>
          <Link href="#" className="text-neutral-300 hover:text-teal-400">Protocol</Link>
          <Link href="#" className="text-neutral-300 hover:text-teal-400">MARZ Academy</Link>
          <Link href="#" className="text-neutral-300 hover:text-teal-400">Contact Us</Link>
          <hr className="border-neutral-800" />
          <button className="border border-teal-500 text-teal-400 font-bold py-2 rounded-lg w-full">Book an Appointment</button>
          <Link href="#" className="text-neutral-300 hover:text-teal-400 text-center py-2">Login</Link>
          <button className="bg-teal-500 text-neutral-950 font-bold py-2 rounded-lg w-full">Sign Up</button>
        </div>
      )}
    </nav>
  );
}
