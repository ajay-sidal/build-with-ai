'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bot } from 'lucide-react'

interface FloatingActionButtonProps {
  isOpen: boolean
  position: 'left' | 'right'
  setIsOpen: (isOpen: boolean) => void
}

export default function FloatingActionButton({ isOpen, position, setIsOpen }: FloatingActionButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsOpen(!isOpen)}
      className={`fixed bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 ${position === 'right' ? 'right-6' : 'left-6'}`}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
          >
            <X size={24} />
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
          >
            <Bot size={24} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
