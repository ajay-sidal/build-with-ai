'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

// Simple emoji-based avatar (no external dependencies)
// This avoids 403 errors from external Lottie CDN
const MARZ_EMOJI = "🤖";

interface MarzAvatarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  position: 'left' | 'right'
  isLoading: boolean
  isSpeaking: boolean
}

const MarzAvatar = React.forwardRef<HTMLButtonElement, MarzAvatarProps>(
  ({ isOpen, setIsOpen, position, isLoading, isSpeaking }, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.button
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsOpen(!isOpen)}
      className={`fixed bottom-6 z-50 flex items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 text-white shadow-lg transition-all ${position === 'right' ? 'right-4' : 'left-4'} ${isOpen ? 'h-16 w-16' : 'h-20 w-20'}`}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          >
            <X size={32} />
          </motion.div>
        ) : (
          <motion.div
            key="avatar"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center justify-center"
          >
            <motion.span
              animate={{
                scale: isHovered || isLoading || isSpeaking ? 1.1 : 1,
                rotate: isSpeaking ? [0, -5, 5, 0] : 0,
              }}
              transition={{
                rotate: {
                  repeat: isSpeaking ? Infinity : 0,
                  duration: 0.5,
                },
              }}
              className="text-4xl"
            >
              {MARZ_EMOJI}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
)

MarzAvatar.displayName = 'MarzAvatar'
export default MarzAvatar