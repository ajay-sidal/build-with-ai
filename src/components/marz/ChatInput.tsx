'use client'

import * as React from 'react'
import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, MicOff } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

interface ChatInputProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => void
  isLoading: boolean
  isListening: boolean
  toggleVoiceInput: () => void
}

const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(({
  input,
  isLoading,
  isListening,
  handleInputChange,
  handleSubmit,
  toggleVoiceInput,
}: ChatInputProps, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea based on content
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto' // Reset height to shrink if needed
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="border-t border-zinc-800 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Button
          type="button"
          onClick={toggleVoiceInput}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
            isListening
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
          variant="secondary"
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </Button>

        <div className="flex-1">
          <label htmlFor="marz-chat-input" className="sr-only">Chat message</label>
          <Textarea
            id="marz-chat-input"
            ref={ref}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="max-h-32 w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            style={{ minHeight: '44px' }}
          />
        </div>

        <Button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={18} />
        </Button>
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
})

ChatInput.displayName = 'ChatInput'
export default ChatInput
