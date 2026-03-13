"use client"

import * as React from 'react'

export default function LeadSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = React.useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch(q)
      }}
      className="flex w-full items-center gap-2"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search leads by company, keyword, or tech"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-100"
      />
      <button type="submit" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white">
        Search
      </button>
    </form>
  )
}
