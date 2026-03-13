import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-neutral-900 pt-16 pb-8 mt-auto z-10 relative">
      <div className="container mx-auto px-4">
        {/* 7-Column Grid Setup */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-8 mb-16">
          
          {/* Columns 1 & 2: Sanctuary Lore & Button */}
          <div className="lg:col-span-2 pr-8 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-teal-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <h3 className="text-white font-bold text-xl tracking-wider">THE SANCTUARY</h3>
            </div>
            {/* Forced break before "architects" */}
            <p className="text-neutral-400 text-sm leading-relaxed mb-8">
              "We are the sum of the hands we hold. Built not for the <br className="hidden lg:block" /> architects of the storm, but for those who survived it."
            </p>
            {/* Relocated Button */}
            <button className="border border-teal-500/50 text-teal-400 hover:bg-teal-500/10 px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest transition-all shadow-[0_0_10px_rgba(45,212,191,0.1)] hover:shadow-[0_0_20px_rgba(45,212,191,0.2)]">
              ALWAYS TOGETHER. NEVER ALONE.
            </button>
          </div>

          {/* Column 3: Products */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Products</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Domains</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">SSL Sanctuary</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Premium Email</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Plesk Hosting</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Smart Wallets</Link></li>
            </ul>
          </div>

          {/* Column 4: Services (NEW) */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Services</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="#" className="hover:text-teal-400 transition-colors">DFY Websites</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Brand Protection</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Enterprise API</Link></li>
            </ul>
          </div>

          {/* Column 5: Ecosystem */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Ecosystem</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="#" className="hover:text-teal-400 transition-colors">MARZ Token</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">MARZ Academy</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Gasless Bridge</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Whitepaper</Link></li>
            </ul>
          </div>

          {/* Column 6: Legal & Trust */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Trust</h4>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Community Forum</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 7: The Legacy (Button removed) */}
          <div className="lg:col-span-1 flex flex-col items-start lg:items-end text-left lg:text-right">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">The Legacy</h4>
            <div className="text-neutral-400 text-sm space-y-1 mb-6">
              <p>Opsvantage Digital</p>
              <p className="text-teal-500">MARZ • Silas</p>
              <p className="text-teal-500">Legacy of 1968</p>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-semibold tracking-widest text-neutral-500 uppercase">
          <p>© 2026 BUILDWITHAI.DIGITAL — A SANCTUARY FOR ALL.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Soulful Gratitude</span>
            <span>Nourished By The Collective</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
