export default function AcademyPage() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white pt-24">
      <section className="relative py-20 overflow-hidden border-b border-neutral-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-teal-500/5 blur-[120px]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="text-teal-500 font-bold text-xs tracking-widest uppercase mb-4 block">Knowledge Protocol Active</span>
          <h1 className="text-4xl md:text-6xl font-black mb-6">MARZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600">Academy</span></h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">Master the art of Digital Sovereignty. Learn how to bridge, tokenize, and scale your assets on the MARZ Protocol.</p>
        </div>
      </section>
      <section className="py-12 bg-[#050505]">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="flex gap-4">
            {['All Units', 'Foundations', 'Technical', 'Governance'].map((tab) => (
              <button key={tab} className="px-4 py-2 rounded-full border border-neutral-800 text-xs font-bold hover:border-teal-500/50 transition-all">
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <input type="text" placeholder="Search Protocol..." className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal-500" />
          </div>
        </div>
      </section>
    </main>
  );
}
