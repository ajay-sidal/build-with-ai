"use client"

import React from 'react'
import { useTheme } from './providers/ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      aria-label="Toggle theme"
      aria-pressed={theme === 'light'}
      onClick={toggle}
      className="ml-3 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-200 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-700"
    >
      <span className="text-sm">{theme === 'dark' ? '🌙' : '☀️'}</span>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
