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
} from 'lucide-react'

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

  // Vercel AI SDK useChat hook
  const { messages, input, handleInputChange, handleSubmit, isLoading, append, data } = useChat({
    api: '/api/marz/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "👋 Hi! I'm **MARZ**, your AI assistant. I can help you with questions about our Domains, SSL Certificates, DNS Services, Licenses, and more. What would you like to know?",
      },
    ],
    initialInput: '',
  })

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

  // Format message with markdown
  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <p key={i} className="mb-1 last:mb-0">
        {line.split('**').map((part, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="font-semibold text-zinc-100">
              {part}
            </strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
      </p>
    ))
  }

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
