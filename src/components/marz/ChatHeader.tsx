'use client'

import * as React from 'react'
import { X, Volume2, VolumeX, Code2 } from 'lucide-react'

interface ChatHeaderProps {
  speechEnabled: boolean
  onSpeechToggle: () => void
  onClose: () => void
  onClearChat: () => void
}

export default function ChatHeader({
  speechEnabled,
  onSpeechToggle,
  onClose,
  onClearChat,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
          <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">MARZ</h3>
          <p className="text-xs text-zinc-400">AI Assistant</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClearChat}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          title="Clear chat history"
        >
          <Code2 size={16} />
        </button>
        <button
          onClick={onSpeechToggle}
          className={`rounded-lg p-2 transition-colors ${
            speechEnabled
              ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title={speechEnabled ? 'Disable voice output' : 'Enable voice output'}
        >
          {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
