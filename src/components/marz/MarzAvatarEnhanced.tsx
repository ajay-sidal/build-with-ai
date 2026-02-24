"use client"

"use client"

import React from 'react'

export default function MarzAvatarEnhanced({ className }: { className?: string }) {
  // Try to require the Lottie Player at runtime; fall back if not installed
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let LottiePlayer: any = null
  try {
    // require may fail if package not installed; catch and ignore
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    LottiePlayer = require('@lottiefiles/react-lottie-player').Player
  } catch (e) {
    LottiePlayer = null
  }

  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-pink-500 to-indigo-500" />
      <div>
        <div className="text-sm font-semibold">Marz</div>
        <div className="text-xs text-zinc-400">Assistant</div>
      </div>
    </div>
  )
}
