'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, MicOff } from 'lucide-react'

interface ChatInputProps {
  input: string
  isLoading: boolean
  isListening: boolean
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onVoiceToggle: () => void
}

export default function ChatInput({
  input,
  isLoading,
  isListening,
  onInputChange,
  onSubmit,
  onKeyDown,
  onVoiceToggle,
}: ChatInputProps) {
  return (
    <div className="border-t border-zinc-800 p-4">
      <form onSubmit={onSubmit} className="flex items-end gap-2">
        <button
          type="button"
          onClick={onVoiceToggle}
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
            isListening
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <div className="flex-1">
          <textarea
            value={input}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="max-h-32 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            style={{ minHeight: '44px' }}
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>

      {isListening && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center text-xs text-red-400"
        >
          🔴 Listening... Speak now
        </motion.p>
      )}
    </div>
  )
}
