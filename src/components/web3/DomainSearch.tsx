"use client";

import React, { useState } from "react";

export default function DomainSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Searching for domain:", searchQuery);
    // Phase 2 Open Provider API hook goes here!
  };

  return (
    <div className="relative bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl shadow-2xl p-2 mt-8 max-w-2xl mx-auto z-20 border border-teal-500/30">
      <form onSubmit={handleSearch} className="flex items-center">
        <input
          type="text"
          id="domainSearch"
          name="domainSearch"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for your Web3 Domain... (e.g. legacy.ai)"
          className="w-full bg-transparent text-white px-4 py-3 focus:outline-none placeholder-neutral-600"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-teal-500 text-neutral-950 font-bold px-8 py-3 rounded-xl shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:bg-teal-400 hover:shadow-[0_0_25px_rgba(45,212,191,0.4)] transition-all"
        >
          Search
        </button>
      </form>
    </div>
  );
}
