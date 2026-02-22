'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Loader2, Copy, Check } from 'lucide-react'
import type { Message } from 'ai/react'

interface CodeBlockProps {
  language: string
  code: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [isCopied, setIsCopied] = React.useState(false)

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [code])

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800/50 px-3 py-2">
        <span className="text-xs font-medium text-zinc-400">{language || 'code'}</span>
        <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-md border border-zinc-600 bg-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-zinc-100" title={isCopied ? 'Copied!' : 'Copy code'}>
          {isCopied ? (<><Check size={12} className="text-emerald-400" /> <span className="text-emerald-400">Copied!</span></>) : (<><Copy size={12} /> <span>Copy</span></>)}
        </button>
      </div>
      <SyntaxHighlighter language={language} style={vscDarkPlus} customStyle={{ margin: 0, padding: '0.75rem', backgroundColor: 'transparent', fontSize: '0.75rem' }} codeTagProps={{ style: { fontFamily: 'inherit' } }}>
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

const formatMessage = (content: string) => {
  const parts = content.split(/```(\w*)\n([\s\S]*?)```/g)
  const elements: React.ReactNode[] = []
  let key = 0
  for (let i = 0; i < parts.length; i += 3) {
    const textPart = parts[i]
    if (textPart) {
      elements.push(...textPart.split('\n').map((line, lineIdx) => (
        <p key={`${key}-text-${lineIdx}`} className="mb-1 last:mb-0">
          {line.split('**').map((part, partIdx) => partIdx % 2 === 1 ? <strong key={partIdx} className="font-semibold text-zinc-100">{part}</strong> : <span key={partIdx}>{part}</span>)}
        </p>
      )))
    }
    if (i + 2 < parts.length) {
      elements.push(<CodeBlock key={`${key}-code`} language={parts[i + 1]} code={parts[i + 2].trim()} />)
      key++
    }
  }
  return <>{elements}</>
}

const MessageSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex justify-start"><div className="h-12 w-2/3 rounded-2xl bg-zinc-800"></div></div>
    <div className="flex justify-end"><div className="h-10 w-1/2 rounded-2xl bg-zinc-700"></div></div>
    <div className="flex justify-start"><div className="h-8 w-5/6 rounded-2xl bg-zinc-800"></div></div>
  </div>
)

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  isHistoryLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, isHistoryLoading, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      <div className="space-y-4">
        {isHistoryLoading ? (
          <MessageSkeleton />
        ) : (
          messages.map((message) => (
            <motion.div
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
                {formatMessage(message.content)}
              </div>
            </motion.div>
          ))
        )}
        {isLoading && !isHistoryLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-zinc-800/80 px-4 py-3 text-sm text-zinc-400">
              <Loader2 size={16} className="animate-spin" />
              <span>MARZ is thinking...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}