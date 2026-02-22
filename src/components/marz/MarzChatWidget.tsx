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
const WIDGET_SIZE_KEY = 'marz_widget_size'
const WIDGET_POSITION_KEY = 'marz_widget_position'
const SELECTED_VOICE_KEY = 'marz_selected_voice'

// Constants for resizing
const DEFAULT_SIZE = { width: 400, height: 600 }
const MIN_SIZE = { width: 320, height: 400 }
const MAX_SIZE = { width: 600, height: 800 }

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
      content: "👋 Hi! I'm **MARZ**, your AI assistant. I can help you with questions about our Domains, SSL Certificates, DNS Services, Licenses, and more. What would you like to know?",
    },
  ]
}

export default function MarzChatWidget() {
  // UI State
  const [isOpen, setIsOpen] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)
  const [speechEnabled, setSpeechEnabled] = React.useState(false)
  const [size, setSize] = React.useState(DEFAULT_SIZE)
  const [position, setPosition] = React.useState<'left' | 'right'>('right')
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [availableVoices, setAvailableVoices] = React.useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = React.useState<string | null>(null)
  const [isHistoryLoading, setIsHistoryLoading] = React.useState(true)
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  
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

  // Load chat history from localStorage on mount
  React.useEffect(() => {
    const initialMessages = getInitialMessages()
    
    if (initialMessages.length > 0) {
      setMessages(initialMessages)
    } else {
      setMessages(getDefaultWelcomeMessage())
    }
    
    setIsHistoryLoading(false)
  }, [setMessages])

  // Load widget size from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(WIDGET_SIZE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.width && parsed.height) {
            setSize({
              width: Math.max(MIN_SIZE.width, Math.min(MAX_SIZE.width, parsed.width)),
              height: Math.max(MIN_SIZE.height, Math.min(MAX_SIZE.height, parsed.height)),
            })
          }
        }
      } catch (error) {
        console.error('[MARZ] Failed to load widget size:', error)
      }
    }
  }, [])

  // Load widget position from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPosition = localStorage.getItem(WIDGET_POSITION_KEY)
      if (storedPosition === 'left' || storedPosition === 'right') {
        setPosition(storedPosition)
      }
    }
  }, [])

  // Load and save selected voice
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVoice = localStorage.getItem(SELECTED_VOICE_KEY)
      if (storedVoice) {
        setSelectedVoice(storedVoice)
      }

      const getVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) setAvailableVoices(voices)
      }
      getVoices()
      window.speechSynthesis.onvoiceschanged = getVoices
    }
  }, [])

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

  // Save widget size to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem(WIDGET_SIZE_KEY, JSON.stringify(size))
  }, [size])

  // Save widget position to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem(WIDGET_POSITION_KEY, position)
  }, [position])

  React.useEffect(() => {
    if (typeof window !== 'undefined' && selectedVoice) localStorage.setItem(SELECTED_VOICE_KEY, selectedVoice)
  }, [selectedVoice])

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
    } else {
      setSuggestions([])
    }
  }, [data, messages, speechEnabled, speakResponse])

  // Text-to-speech
  const speakResponse = React.useCallback((text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }

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
    const preferredVoice = voices.find((v) => v.voiceURI === selectedVoice) || voices.find((v) => v.name.includes('Female') || v.name.includes('Google US English'))
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    window.speechSynthesis.speak(utterance)
  }, [speechEnabled, selectedVoice])

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
    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
      e.preventDefault()
      handleSubmit(e as any)
      setSuggestions([])
    }
  }, [handleSubmit, input])

  // Clear chat history
  const handleClearChat = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(MARZ_CHAT_HISTORY_KEY)
      setMessages(getDefaultWelcomeMessage())
      setSuggestions([])
      setIsSettingsOpen(false)
    }
  }, [setMessages])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    handleSubmit(e)
    setSuggestions([])
  }

  return (
    <>
      <FloatingActionButton isOpen={isOpen} position={position} setIsOpen={setIsOpen} />

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{ width: size.width, height: size.height }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-24 z-50 flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur shadow-2xl shadow-black/50 ${position === 'right' ? 'right-6' : 'left-6'}`}
          >
            <ChatHeader
              handleClearChat={handleClearChat}
              onToggleSettings={() => setIsSettingsOpen(true)}
              position={position}
              onTogglePosition={() => setPosition(p => p === 'right' ? 'left' : 'right')}
              setIsOpen={setIsOpen}
            />

            <MessageList
              messages={messages}
              isLoading={isLoading}
              isHistoryLoading={isHistoryLoading}
              messagesEndRef={messagesEndRef}
            />

            <SuggestionChips
              suggestions={suggestions}
              handleSuggestionClick={handleSuggestionClick}
              isLoading={isLoading}
            />

            <ChatInput
              handleSubmit={handleFormSubmit}
              input={input}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              isLoading={isLoading}
              isListening={isListening}
              toggleVoiceInput={toggleVoiceInput}
            />

            <AnimatePresence>
              {isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} speechEnabled={speechEnabled} setSpeechEnabled={setSpeechEnabled} availableVoices={availableVoices} selectedVoice={selectedVoice} setSelectedVoice={setSelectedVoice} />}
            </AnimatePresence>

            <motion.div
              drag="x,y"
              onDrag={(event, info) => {
                setSize(prev => ({
                  width: Math.max(MIN_SIZE.width, Math.min(MAX_SIZE.width, prev.width + info.delta.x)),
                  height: Math.max(MIN_SIZE.height, Math.min(MAX_SIZE.height, prev.height + info.delta.y))
                }))
              }}
              dragMomentum={false}
              className="absolute bottom-0 right-0 z-10 h-4 w-4 cursor-se-resize"
            >
              <div className={`h-full w-full border-r-2 border-b-2 border-zinc-600/50 rounded-br-xl ${position === 'left' ? 'transform -scale-x-100' : ''}`}></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
