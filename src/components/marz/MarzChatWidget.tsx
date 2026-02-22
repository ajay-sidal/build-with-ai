'use client'

import * as React from 'react'
import { useChat } from 'ai/react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message } from 'ai/react'

// Import sub-components
import FloatingActionButton from './FloatingActionButton'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import SuggestionChips from './SuggestionChips'
import ChatInput from './ChatInput'

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

// Helper function to load initial messages from localStorage
function getInitialMessages(): Message[] {
  if (typeof window === 'undefined') {
    return []
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

  return []
}

// Helper function to get default welcome message
function getDefaultWelcomeMessage(): Message[] {
  return [
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hi! I'm **MARZ**, your personal AI guide. Welcome to **BUILD WITH AI**! Are you looking to register a new domain or secure an existing one today?",
    },
  ]
}

export default function MarzChatWidget() {
  // UI State
  const [isOpen, setIsOpen] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)
  const [speechEnabled, setSpeechEnabled] = React.useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = React.useState(true)
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const [hasWelcomed, setHasWelcomed] = React.useState(false)

  // Refs
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [recognition, setRecognition] = React.useState<SpeechRecognition | null>(null)

  // Vercel AI SDK useChat hook
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    data,
    setMessages
  } = useChat({
    api: '/api/marz/chat',
    initialMessages: [],
    initialInput: '',
  })

  // Phase 3: Proactive Welcome - Auto-open MARZ on first visit
  React.useEffect(() => {
    // Check if user has already been welcomed
    const hasBeenWelcomed = localStorage.getItem('marz_has_welcomed')
    
    if (!hasBeenWelcomed && messages.length === 0) {
      // Load initial messages
      const initialMessages = getInitialMessages()
      if (initialMessages.length > 0) {
        setMessages(initialMessages)
      } else {
        setMessages(getDefaultWelcomeMessage())
      }
      
      // Auto-open chat after a short delay
      const welcomeTimer = setTimeout(() => {
        setIsOpen(true)
        setHasWelcomed(true)
        localStorage.setItem('marz_has_welcomed', 'true')
        
        // Auto-close after 7 seconds if user doesn't interact
        const closeTimer = setTimeout(() => {
          if (messages.length <= 1) {
            setIsOpen(false)
          }
        }, 7000)
        
        return () => clearTimeout(closeTimer)
      }, 1500)
      
      setIsHistoryLoading(false)
      return () => clearTimeout(welcomeTimer)
    }
  }, [])

  // Text-to-speech
  const speakResponse = React.useCallback((text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return

    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/```[\s\S]*?```/g, '')
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

  // Save messages to localStorage on update
  React.useEffect(() => {
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

  // Handle voice input toggle
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
  const handleSuggestionClick = React.useCallback((suggestion: string) => {
    setSuggestions([])
    append({
      role: 'user',
      content: suggestion,
    })
  }, [append])

  // Handle Enter key
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }, [handleSubmit])

  // Clear chat history
  const handleClearChat = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(MARZ_CHAT_HISTORY_KEY)
      localStorage.removeItem('marz_has_welcomed')
      setMessages(getDefaultWelcomeMessage())
      setSuggestions([])
    }
  }, [setMessages])

  // Toggle chat visibility
  const handleToggle = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  // Toggle speech output
  const handleSpeechToggle = React.useCallback(() => {
    setSpeechEnabled((prev) => !prev)
  }, [])

  // Close chat
  const handleClose = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <>
      {/* Floating Action Button with Pulse Animation */}
      <FloatingActionButton 
        isOpen={isOpen} 
        onToggle={handleToggle}
        isProactive={!hasWelcomed}
      />

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/95 backdrop-blur shadow-2xl shadow-black/50 sm:right-6"
          >
            {/* Header */}
            <ChatHeader
              speechEnabled={speechEnabled}
              onSpeechToggle={handleSpeechToggle}
              onClose={handleClose}
              onClearChat={handleClearChat}
            />

            {/* Messages */}
            <MessageList
              messages={messages}
              isLoading={isLoading}
              isHistoryLoading={isHistoryLoading}
              messagesEndRef={messagesEndRef}
            />

            {/* Suggestion Chips */}
            <SuggestionChips
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              isLoading={isLoading}
            />

            {/* Input Area */}
            <ChatInput
              input={input}
              isLoading={isLoading}
              isListening={isListening}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyDown}
              onVoiceToggle={toggleVoiceInput}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
