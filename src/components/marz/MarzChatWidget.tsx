'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Import sub-components
import FloatingActionButton from './FloatingActionButton'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import SuggestionChips from './SuggestionChips'
import ChatInput from './ChatInput'

// Storage key for chat persistence
const MARZ_CHAT_HISTORY_KEY = 'marz_chat_history'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

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
      content: "👋 Hi! I'm **MARZ**, your personal AI assistant for BUILD WITH AI. I can help you register domains, secure your website with SSL certificates, set up DNS hosting, and much more. What would you like to work on today?",
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
  const [isVoiceChatActive, setIsVoiceChatActive] = React.useState(false)
  const [isSpeaking, setIsSpeaking] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')

  // Refs
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [recognition, setRecognition] = React.useState<SpeechRecognition | null>(null)
  const synthRef = React.useRef<SpeechSynthesis | null>(null)
  const transcriptRef = React.useRef('')

  // Initialize speech synthesis ref
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Phase 3: Proactive Welcome - Auto-open MARZ on first visit
  React.useEffect(() => {
    const hasBeenWelcomed = localStorage.getItem('marz_has_welcomed')
    
    if (!hasBeenWelcomed && messages.length === 0) {
      const initialMessages = getInitialMessages()
      if (initialMessages.length > 0) {
        setMessages(initialMessages)
      } else {
        setMessages(getDefaultWelcomeMessage())
      }

      const welcomeTimer = setTimeout(() => {
        setIsOpen(true)
        setHasWelcomed(true)
        localStorage.setItem('marz_has_welcomed', 'true')
        
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
  }, [messages.length])

  // Text-to-speech with enhanced control
  const speakResponse = React.useCallback((text: string, onEnd?: () => void) => {
    if (!speechEnabled || !synthRef.current) return

    if (synthRef.current.speaking) {
      synthRef.current.cancel()
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

    const voices = synthRef.current.getVoices()
    const preferredVoice = voices.find(
      (v) => v.name.includes('Female') || v.name.includes('Google US English')
    )
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => {
      setIsSpeaking(false)
      onEnd?.()
    }
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current.speak(utterance)
  }, [speechEnabled])

  // Voice Introduction
  const handleVoiceIntroduction = React.useCallback(() => {
    if (!isOpen) {
      setIsOpen(true)
    }

    setIsVoiceChatActive(true)
    setSpeechEnabled(true)

    const introductionText = "Hello! I'm MARZ, your personal AI assistant for BUILD WITH AI. I can help you register domains, secure your website with SSL certificates, set up DNS hosting, and much more. What would you like to work on today?"

    speakResponse(introductionText, () => {
      if (recognition) {
        try {
          recognition.start()
          setIsListening(true)
        } catch (error) {
          console.log('Recognition already started')
        }
      }
    })
  }, [isOpen, speakResponse, recognition])

  // Save messages to localStorage
  React.useEffect(() => {
    if (messages.length > 1 && typeof window !== 'undefined') {
      try {
        localStorage.setItem(MARZ_CHAT_HISTORY_KEY, JSON.stringify(messages))
      } catch (error) {
        console.error('[MARZ] Failed to save chat history:', error)
      }
    }
  }, [messages])

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

        // Store transcript in ref for access in onend
        transcriptRef.current = transcript

        // Update input field with transcript
        setInput(transcript)

        if (event.results[0].isFinal) {
          setIsListening(false)
        }
      }

      recognitionInstance.onerror = (event: any) => {
        console.error('[MARZ] Speech recognition error:', event.error)
        setIsListening(false)
        
        // Provide helpful error messages
        if (event.error === 'not-allowed') {
          console.warn('[MARZ] Microphone permission denied by user')
        } else if (event.error === 'no-speech') {
          console.warn('[MARZ] No speech detected')
        } else if (event.error === 'audio-capture') {
          console.warn('[MARZ] No microphone found')
          alert('No microphone detected. Please ensure a microphone is connected to your device.')
        } else if (event.error === 'network') {
          console.warn('[MARZ] Network error occurred')
        }
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
        // Auto-submit the transcript when recognition ends
        const finalTranscript = transcriptRef.current
        if (finalTranscript.trim()) {
          // Small delay to ensure input is updated
          setTimeout(() => {
            handleSendMessage(finalTranscript)
          }, 100)
        }
      }

      setRecognition(recognitionInstance)
    } else {
      console.warn('[MARZ] Web Speech API not supported in this browser. Please use Chrome or Edge.')
    }
  }, [])

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
      // Start recognition directly - browser will prompt for permission if needed
      transcriptRef.current = ''
      setIsListening(true)
      
      try {
        recognition.start()
      } catch (error: any) {
        console.error('[MARZ] Recognition start error:', error)
        setIsListening(false)
        
        // Handle specific error cases
        if (error.message?.includes('permission') || error.message?.includes('not-allowed')) {
          alert('Microphone access denied. Please click the microphone icon in your browser address bar and allow microphone access, then try again.')
        } else if (error.message?.includes('already started')) {
          // Recognition already running, stop and restart
          recognition.stop()
          setTimeout(() => {
            transcriptRef.current = ''
            setIsListening(true)
            recognition.start()
          }, 100)
        } else {
          alert('Unable to start voice recognition. Please ensure your browser supports the Web Speech API and try again.')
        }
      }
    }
  }, [recognition, isListening])

  // Send message to MARZ API
  const handleSendMessage = React.useCallback(async (messageText: string) => {
    if (!messageText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    transcriptRef.current = ''

    // Call MARZ API
    try {
      const response = await fetch('/api/marz/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'I apologize, but I couldn\'t process that request.',
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Speak response if speech is enabled
      if (speechEnabled) {
        speakResponse(assistantMessage.content)
      }
    } catch (error) {
      console.error('[MARZ] Send message error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }, [speechEnabled, speakResponse])

  // Handle form submission
  const handleSubmit = React.useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleSendMessage(input)
    }
  }, [input, handleSendMessage])

  // Handle keyboard events
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        handleSendMessage(input)
      }
    }
  }, [input, handleSendMessage])

  // Handle suggestion chip click
  const handleSuggestionClick = React.useCallback((suggestion: string) => {
    setSuggestions([])
    // In a real implementation, this would send the suggestion as a message
    console.log('Suggestion clicked:', suggestion)
  }, [])

  // Clear chat history
  const handleClearChat = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(MARZ_CHAT_HISTORY_KEY)
      localStorage.removeItem('marz_has_welcomed')
      setMessages(getDefaultWelcomeMessage())
      setSuggestions([])
    }
  }, [])

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
      <FloatingActionButton 
        isOpen={isOpen} 
        onToggle={handleToggle}
        isProactive={!hasWelcomed}
        onVoiceIntroduce={handleVoiceIntroduction}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/95 backdrop-blur shadow-2xl shadow-black/50 sm:right-6"
          >
            <ChatHeader
              speechEnabled={speechEnabled}
              onSpeechToggle={handleSpeechToggle}
              onClose={handleClose}
              onClearChat={handleClearChat}
              onVoiceIntroduce={handleVoiceIntroduction}
            />

            <MessageList
              messages={messages}
              isLoading={false}
              isHistoryLoading={isHistoryLoading}
              messagesEndRef={messagesEndRef}
            />

            <SuggestionChips
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              isLoading={false}
            />

            <ChatInput
              input={input}
              isLoading={false}
              isListening={isListening}
              onInputChange={(e) => setInput(e.target.value)}
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
