'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, MicOff } from 'lucide-react'

interface ChatInputProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  isLoading: boolean
  isListening: boolean
  toggleVoiceInput: () => void
}

export const ChatInput: React.FC<ChatInputProps> = ({ handleSubmit, input, handleInputChange, handleKeyDown, isLoading, isListening, toggleVoiceInput }) => {
  return (
    <div className="border-t border-zinc-800 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
            isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <div className="flex-1">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
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

      {isListening && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-center text-xs text-red-400">🔴 Listening... Speak now</motion.p>}
    </div>
  )
}