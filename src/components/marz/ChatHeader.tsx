'use client'

import * as React from 'react'
import { X, Volume2, VolumeX, Trash2, Sparkles, Mic } from 'lucide-react'

interface ChatHeaderProps {
  speechEnabled: boolean
  onSpeechToggle: () => void
  onClose: () => void
  onClearChat: () => void
  onVoiceIntroduce?: () => void
}

export default function ChatHeader({
  speechEnabled,
  onSpeechToggle,
  onClose,
  onClearChat,
  onVoiceIntroduce,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-zinc-100">MARZ</h3>
          <p className="text-xs text-zinc-400">AI Assistant {speechEnabled && '• Voice Active'}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onVoiceIntroduce && (
          <button
            onClick={onVoiceIntroduce}
            className="rounded-lg p-2 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
            title="Activate voice chat - MARZ will speak and listen"
          >
            <Mic size={16} />
          </button>
        )}
        <button
          onClick={onClearChat}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          title="Clear chat history"
        >
          <Trash2 size={16} />
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
