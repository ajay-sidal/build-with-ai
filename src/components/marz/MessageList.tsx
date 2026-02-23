'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import CodeBlock from './CodeBlock'
import ChatHistorySkeleton from './ChatHistorySkeleton'
import type { UIMessage } from '@ai-sdk/react'

interface MessageListProps {
  messages: UIMessage[]
  isLoading: boolean
  isHistoryLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

// Parse markdown with code block support
const formatMessage = (content: string | undefined) => {
  if (!content) return null;
  const parts = content.split(/```(\w*)\n([\s\S]*?)```/g)
  const elements: React.ReactNode[] = []
  let key = 0
  for (let i = 0; i < parts.length; i += 3) {
    const textPart = parts[i]
    if (textPart) {
      const textElements = textPart.split('\n').map((line, lineIdx) => (
        <p key={`${key}-text-${lineIdx}`} className="mb-1 last:mb-0">
          {line.split('**').map((part, partIdx) =>
            partIdx % 2 === 1 ? (
              <strong key={partIdx} className="font-semibold text-zinc-100">
                {part}
              </strong>
            ) : (
              <span key={partIdx}>{part}</span>
            )
          )}
        </p>
      ))
      elements.push(...textElements)
    }
    if (i + 2 < parts.length) {
      const language = parts[i + 1]
      const code = parts[i + 2].trim()
      elements.push(
        <CodeBlock
          key={`${key}-code`}
          language={language}
          code={code}
        />
      )
      key++
    }
  }
  return <>{elements}</>
}

export default function MessageList({
  messages,
  isLoading,
  isHistoryLoading,
  messagesEndRef,
}: MessageListProps) {
  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Show skeleton while loading history
  if (isHistoryLoading) {
    return <ChatHistorySkeleton />
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      <ul role="log" aria-live="polite" className="space-y-4">
        {messages.map((message) => (
          <motion.li
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                  : 'bg-zinc-800/80 text-zinc-200'
              }`}
            >
              {formatMessage((message as any).content)}
            </div>
          </motion.li>
        ))}
        {isLoading && (
          <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
            aria-label="MARZ is thinking"
          >
            <div className="flex items-center gap-2 rounded-2xl bg-zinc-800/80 px-4 py-3 text-sm text-zinc-400">
              <Loader2 size={16} className="animate-spin" />
              <span>MARZ is thinking...</span>
            </div>
          </motion.li>
        )}
        <div ref={messagesEndRef} />
      </ul>
    </div>
  )
}
