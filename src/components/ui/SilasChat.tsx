"use client";

export default function SilasChat() {
  return (
    <button 
      aria-label="Open Silas chat assistant"
      onClick={() => console.log('Silas Chat Initiated')} 
      className="fixed bottom-24 right-6 z-50 bg-teal-500 text-neutral-950 p-4 rounded-full shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:bg-teal-400 hover:scale-110 transition-all flex items-center justify-center group"
    >
      {/* Wizard Bot Icon */}
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      
      {/* Hover Tooltip */}
      <span className="absolute -top-12 right-0 bg-[#0a0a0a] border border-teal-500/50 text-teal-400 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
        Ask The Wizard
      </span>
    </button>
  );
}
