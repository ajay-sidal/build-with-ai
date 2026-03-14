"use client";
import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => window.scrollY > 300 ? setIsVisible(true) : setIsVisible(false);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return isVisible ? (
    <button 
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
      className="fixed bottom-24 left-6 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border border-teal-500/30 text-teal-400 p-3 rounded-full shadow-[0_0_15px_rgba(45,212,191,0.15)] hover:bg-teal-400 hover:text-neutral-950 transition-all group"
    >
      <svg className="w-6 h-6 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
    </button>
  ) : null;
}
