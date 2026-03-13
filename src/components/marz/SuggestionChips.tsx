'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

interface SuggestionChipsProps {
  suggestions: string[]
  handleSuggestionClick: (suggestion: string) => void
  isLoading: boolean
}

export default function SuggestionChips({
  suggestions,
  handleSuggestionClick,
  isLoading,
}: SuggestionChipsProps) {
  if (suggestions.length === 0 || isLoading) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="border-t border-zinc-800/50 px-4 py-2"
    >
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSuggestionClick(suggestion)}
            className="rounded-full border border-blue-600/50 bg-blue-600/10 px-3 py-1.5 text-xs text-blue-300 transition-all hover:bg-blue-600/20 hover:text-blue-200"
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
