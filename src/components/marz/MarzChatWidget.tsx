'use client'

import * as React from 'react'
import { useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Loader2,
  Bot,
  Copy,
  Check,
  Code2,
} from 'lucide-react'

// Storage key for chat persistence
const MARZ_CHAT_HISTORY_KEY = 'marz_chat_history'

interface SuggestionData {
  suggestions?: string[]
}

// Web Speech API types
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: (event: any) => void
  onerror: (event: any) => void
  onend: () => void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

// Phase 1.1: CodeBlock Component with Copy to Clipboard
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
        <span className="text-xs font-medium text-zinc-400">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-600 bg-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-zinc-100"
          title={isCopied ? 'Copied!' : 'Copy code'}
        >
          {isCopied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs text-zinc-100">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// Phase 1.2: Updated formatMessage with CodeBlock support
const formatMessage = (content: string) => {
  // Split content by code blocks using regex
  const parts = content.split(/```(\w*)\n([\s\S]*?)```/g)
  
  const elements: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < parts.length; i += 3) {
    // Text part (before code block)
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

    // Code block (if exists)
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

// Phase 2.1: Helper function to load initial messages from localStorage
function getInitialMessages() {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: "👋 Hi! I'm **MARZ**, your AI assistant. I can help you with questions about our Domains, SSL Certificates, DNS Services, Licenses, and more. What would you like to know?",
      },
    ]
  }

  try {
    const stored = localStorage.getItem(MARZ_CHAT_HISTORY_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.error('[MARZ] Failed to load chat history:', error)
  }

  // Default welcome message
  return [
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hi! I'm **MARZ**, your AI assistant. I can help you with questions about our Domains, SSL Certificates, DNS Services, Licenses, and more. What would you like to know?",
    },
  ]
}

export default function MarzChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)
  const [speechEnabled, setSpeechEnabled] = React.useState(false)
  const [recognition, setRecognition] = React.useState<SpeechRecognition | null>(null)
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Text-to-speech
  const speakResponse = React.useCallback((text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return

    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/💰|📋|🤖|💵|✨|🔍|⚠️/g, '')
      .replace(/\n/g, ' ')
      .trim()

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      (v) => v.name.includes('Female') || v.name.includes('Google US English')
    )
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    window.speechSynthesis.speak(utterance)
  }, [speechEnabled])

  // Vercel AI SDK useChat hook with persisted initial messages
  const { messages, input, handleInputChange, handleSubmit, isLoading, append, data, setMessages } = useChat({
    api: '/api/marz/chat',
    initialMessages: getInitialMessages(),
    initialInput: '',
  })

  // Phase 2.2: Save messages to localStorage on update
  React.useEffect(() => {
    // Only save if we have more than just the welcome message
    if (messages.length > 1 && typeof window !== 'undefined') {
      try {
        localStorage.setItem(MARZ_CHAT_HISTORY_KEY, JSON.stringify(messages))
      } catch (error) {
        console.error('[MARZ] Failed to save chat history:', error)
      }
    }
  }, [messages])

  // Extract suggestions from response data
  React.useEffect(() => {
    if (data && data.length > 0) {
      const lastData = data[data.length - 1] as SuggestionData | undefined
      if (lastData?.suggestions && lastData.suggestions.length > 0) {
        setSuggestions(lastData.suggestions)
        const lastMsg = messages[messages.length - 1]
        if (lastMsg && speechEnabled) {
          setTimeout(() => speakResponse(lastMsg.content), 300)
        }
      }
    }
  }, [data, messages, speechEnabled, speakResponse])

  // Initialize speech recognition
  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('')

        handleInputChange({ target: { value: transcript } } as any)

        if (event.results[0].isFinal) {
          setIsListening(false)
        }
      }

      recognitionInstance.onerror = () => {
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [handleInputChange])

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle voice input
  const toggleVoiceInput = React.useCallback(() => {
    if (!recognition) {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.')
      return
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      recognition.start()
    }
  }, [recognition, isListening])

  // Handle suggestion chip click
  const handleSuggestionClick = (suggestion: string) => {
    setSuggestions([])
    append({
      role: 'user',
      content: suggestion,
    })
  }

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  // Clear chat history helper
  const handleClearChat = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(MARZ_CHAT_HISTORY_KEY)
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "👋 Hi! I'm **MARZ**, your AI assistant. I can help you with questions about our Domains, SSL Certificates, DNS Services, Licenses, and more. What would you like to know?",
        },
      ])
      setSuggestions([])
    }
  }, [setMessages])

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Bot size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur shadow-2xl shadow-black/50 sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">MARZ</h3>
                  <p className="text-xs text-zinc-400">AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearChat}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                  title="Clear chat history"
                >
                  <Code2 size={16} />
                </button>
                <button
                  onClick={() => setSpeechEnabled(!speechEnabled)}
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
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="space-y-4">
                {messages.map((message) => (
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
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-2 rounded-2xl bg-zinc-800/80 px-4 py-3 text-sm text-zinc-400">
                      <Loader2 size={16} className="animate-spin" />
                      <span>MARZ is thinking...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Suggestion Chips */}
            <AnimatePresence>
              {suggestions.length > 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="border-t border-zinc-800/50 px-4 py-2"
                >
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="rounded-full border border-blue-600/50 bg-blue-600/10 px-3 py-1.5 text-xs text-blue-300 transition-all hover:bg-blue-600/20 hover:text-blue-200"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="border-t border-zinc-800 p-4">
              <form
                onSubmit={handleSubmit}
                className="flex items-end gap-2"
              >
                <button
                  type="button"
                  onClick={toggleVoiceInput}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
