"use client"

import * as React from 'react'

export interface SearchBarProps {
  placeholder?: string
  onSearch?: (value: string) => void
  suggestions?: string[]
}

export default function SearchBar({ placeholder = 'Search domains, e.g. brilliant.ai', onSearch, suggestions = [] }: SearchBarProps) {
  const [value, setValue] = React.useState('')
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const listRef = React.useRef<HTMLUListElement | null>(null)

  const visible = value.length > 0 && suggestions.length > 0

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!visible) return
    if (e.key === 'ArrowDown') {
      setActiveIndex((i) => (i === null ? 0 : Math.min(suggestions.length - 1, i + 1)))
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((i) => (i === null ? suggestions.length - 1 : Math.max(0, i - 1)))
      e.preventDefault()
    } else if (e.key === 'Enter') {
      const chosen = activeIndex !== null ? suggestions[activeIndex] : value
      onSearch?.(chosen)
      setValue('')
      setActiveIndex(null)
      e.preventDefault()
    } else if (e.key === 'Escape') {
      setActiveIndex(null)
    }
  }

  return (
    <div className="relative w-full max-w-xl">
      <input
        aria-label="Search"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setActiveIndex(null), 150)}
      />

      {visible && (
        <ul ref={listRef} role="listbox" className="absolute z-40 mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-950/90 p-2 shadow-lg">
          {suggestions.map((s, idx) => (
            <li
              key={s}
              role="option"
              aria-selected={activeIndex === idx}
              onMouseDown={(ev) => {
                ev.preventDefault()
                onSearch?.(s)
                setValue('')
              }}
              className={`cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 ${activeIndex === idx ? 'bg-zinc-800' : ''}`}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
