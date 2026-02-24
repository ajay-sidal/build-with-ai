'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { X } from 'lucide-react'

// Lottie animation URLs
const ROBOT_IDLE_URL = "https://lottie.host/c2d736b9-d543-49f2-a149-099a349913c9/pS2sI5n7sQ.lottie";
const ROBOT_ACTIVE_URL = "https://lottie.host/4f70a259-4e94-43b6-8f32-5a995383325c/2JkGoa5e3k.lottie";

interface MarzAvatarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  position: 'left' | 'right'
  isLoading: boolean
  isSpeaking: boolean
}

const MarzAvatar = React.forwardRef<HTMLButtonElement, MarzAvatarProps>(
  ({ isOpen, setIsOpen, position, isLoading, isSpeaking }, ref) => {
  const lottieSrc = (isLoading || isSpeaking) ? ROBOT_ACTIVE_URL : ROBOT_IDLE_URL;
  const [lottieAvailable, setLottieAvailable] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    let mounted = true
    async function check() {
      try {
        const res = await fetch(lottieSrc, { method: 'GET', mode: 'cors' })
        if (!mounted) return
        setLottieAvailable(res.ok)
      } catch (e) {
        if (!mounted) return
        setLottieAvailable(false)
      }
    }
    check()
    return () => { mounted = false }
  }, [lottieSrc])

  return (
    <motion.button
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsOpen(!isOpen)}
      className={`fixed bottom-6 z-50 flex h-24 w-24 items-center justify-center rounded-full bg-transparent transition-all ${position === 'right' ? 'right-4' : 'left-4'}`}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 text-white shadow-lg"
          >
            <X size={32} />
          </motion.div>
        ) : (
          <motion.div
            key="avatar"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            {lottieAvailable === false ? (
              // Fallback simple avatar when Lottie resource is unavailable
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white">
                🤖
              </div>
            ) : (
              <DotLottieReact
                src={lottieSrc}
                loop
                autoplay
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
)

MarzAvatar.displayName = 'MarzAvatar'
export default MarzAvatar