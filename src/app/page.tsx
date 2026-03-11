"use client";
import { useState } from "react";

interface SearchResult {
  domain: string;
  available: boolean;
}

export default function Home() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!domain) return;
    setLoading(true);
    try {
      const res = await fetch("/api/cms/api/domains/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainName: domain }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000a12] text-white font-sans">
      <nav className="flex justify-between items-center px-10 py-8 border-b border-white/5">
        <div className="text-2xl font-black tracking-tighter text-blue-500">BUILD WITH AI</div>
        <div className="hidden md:flex space-x-8 text-sm font-bold text-blue-200/40 uppercase tracking-widest">
          <a href="#" className="hover:text-white transition">Registry</a>
          <a href="#" className="hover:text-white transition">Insights</a>
          <a href="#" className="hover:text-white transition">API</a>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto pt-40 px-6 text-center">
        <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-blue-600 bg-clip-text text-transparent">
          DOMAINS FOR <br /> THE AI ERA
        </h1>
        <p className="text-xl text-blue-100/40 mb-12 max-w-2xl mx-auto font-medium">
          The ultimate search and acquisition engine for .ai assets.
        </p>
        
        <div className="flex bg-white/5 rounded-3xl p-3 max-w-2xl mx-auto border border-white/10 shadow-2xl backdrop-blur-3xl">
          <input 
            type="text" 
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="visionary-idea.ai" 
            className="flex-grow bg-transparent p-5 text-white outline-none text-xl placeholder:text-blue-200/10"
          />
          <button 
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            {loading ? "SEARCHING..." : "SEARCH"}
          </button>
        </div>

        {result && (
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
             <div className="p-12 bg-blue-900/10 rounded-[2.5rem] max-w-2xl mx-auto border border-blue-400/10">
                <p className="text-4xl font-black mb-6 tracking-tight">{result.domain}</p>
                <div className={`inline-block px-10 py-3 rounded-full font-black text-sm tracking-widest ${result.available ? "bg-green-500 text-black shadow-lg shadow-green-500/40" : "bg-red-500/20 text-red-500 border border-red-500/30"}`}>
                  {result.available ? "✓ AVAILABLE FOR ACQUISITION" : "✕ ALREADY REGISTERED"}
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
