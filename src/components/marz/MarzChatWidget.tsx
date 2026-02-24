'use client'

import * as React from 'react'
import { useChat, type UIMessage } from '@ai-sdk/react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemo } from 'react'

// Import sub-components
import MarzAvatar from './MarzAvatar'
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
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}

// Helper function to load initial messages from localStorage
function getInitialMessages(): any[] {
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
function getDefaultWelcomeMessage(): any[] {
  return [
    {
      id: 'welcome',
      role: 'assistant',
      // Keep as any to avoid SDK typing differences
      content: "👋 Hi! I'm **MARZ**, your personal AI assistant for BUILD WITH AI. I can help you register domains, secure your website with SSL certificates, set up DNS hosting, and much more. What would you like to work on today?",
    } as any,
  ]
}

export default function MarzChatWidget() {
  // If tests want to disable the widget, set localStorage.marz_disable = '1'
  if (typeof window !== 'undefined') {
    try {
      if (localStorage.getItem('marz_disable') === '1') {
        return null
      }
    } catch (e) {
      // ignore
    }
  }

  // UI State
  const [isOpen, setIsOpen] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)
  const [speechEnabled, setSpeechEnabled] = React.useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = React.useState(true)
  const [suggestions, setSuggestions] = React.useState<string[]>([])
  const [position, setPosition] = React.useState<'left' | 'right'>('right')
  // Removed isSettingsOpen, SettingsPanel is not used
  const [availableVoices, setAvailableVoices] = React.useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = React.useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = React.useState(false)

  // Refs
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const avatarRef = React.useRef<HTMLButtonElement>(null)
  const [recognition, setRecognition] = React.useState<SpeechRecognition | null>(null)
  const synthRef = React.useRef<SpeechSynthesis | null>(null)
  const transcriptRef = React.useRef('')

  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const { messages, setMessages, sendMessage, error } = useChat()

  // Watch messages for assistant responses and extract suggestions + TTS
  // (moved below speakResponse definition to avoid using it before declaration)

  // Initialize speech synthesis ref
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Focus management for accessibility
  React.useEffect(() => {
    if (isOpen) {
      // When the chat opens, focus the input field after a short delay for the animation
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      // When the chat closes, return focus to the avatar button
      // This check prevents focus loss on initial page load
      if (document.activeElement !== avatarRef.current) avatarRef.current?.focus()
    }
  }, [isOpen])

  // Load history and handle proactive welcome
  React.useEffect(() => {
    const initialMessages = getInitialMessages()
    if (initialMessages.length > 0) {
      setMessages(initialMessages)
    } else {
      setMessages(getDefaultWelcomeMessage())
    }
    setIsHistoryLoading(false)

    const hasBeenWelcomed = localStorage.getItem('marz_has_welcomed')
    if (!hasBeenWelcomed && initialMessages.length === 0) {
      const welcomeTimer = setTimeout(() => {
        setIsOpen(true)
        localStorage.setItem('marz_has_welcomed', 'true')

        const closeTimer = setTimeout(() => {
          // Check if user has interacted
          if (messages.length <= 1 && input === '') {
            setIsOpen(false)
          }
        }, 7000)

        return () => clearTimeout(closeTimer)
      }, 1500)

      return () => clearTimeout(welcomeTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once on mount

  // Load widget position from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPosition = localStorage.getItem('marz_widget_position')
      if (storedPosition === 'left' || storedPosition === 'right') {
        setPosition(storedPosition)
      }
    }
  }, [])

  // Save widget position to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('marz_widget_position', position)
    }
  }, [position])

  // Load and save selected voice
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVoice = localStorage.getItem('marz_selected_voice')
      if (storedVoice) {
        setSelectedVoice(storedVoice)
      }

      const getVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          setAvailableVoices(voices)
        }
      }
      getVoices()
      window.speechSynthesis.onvoiceschanged = getVoices
    }
  }, [])

  React.useEffect(() => {
    if (typeof window !== 'undefined' && selectedVoice) {
      localStorage.setItem('marz_selected_voice', selectedVoice)
    }
  }, [selectedVoice])

  // Text-to-speech with enhanced control
  const speakResponse = React.useCallback((text: string, onEnd?: () => void) => {
    if (!speechEnabled || !synthRef.current) return

    if (synthRef.current.speaking) {
      synthRef.current.cancel()
    }

    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/```[\s\S]*?```/g, 'a code snippet is displayed.') // Replace code blocks with placeholder text for speech
      .replace(/💰|📋|🤖|💵|✨|🔍|⚠️/g, '')
      .replace(/\n/g, ' ')
      .trim()

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    const voices = synthRef.current.getVoices()
    const preferredVoice = voices.find(
      (v) => v.voiceURI === selectedVoice
    ) || voices.find(
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

    utterance.onend = onEnd ?? null

    synthRef.current.speak(utterance)
  }, [speechEnabled, selectedVoice])

  // Watch messages for assistant responses and extract suggestions + TTS
  React.useEffect(() => {
    const last = messages[messages.length - 1] as any | undefined
    if (!last) return
    if (last.role === 'assistant') {
      const content = last.content as string | undefined
      const suggestionMatch = content?.match?.(/SUGGESTIONS:(.*)/)
      if (suggestionMatch && suggestionMatch[1]) {
        try {
          const parsedSuggestions = JSON.parse(suggestionMatch[1])
          setSuggestions(parsedSuggestions)
        } catch (e) {
          console.error('Failed to parse suggestions:', e)
          setSuggestions([])
        }
      }
      if (speechEnabled && content) {
        speakResponse(content)
      }
      setIsLoading(false)
    }
  }, [messages, speechEnabled, speakResponse])

  // Initialize speech recognition
  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    console.log('[MARZ] SpeechRecognition available:', !!SpeechRecognition)
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = true
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onstart = () => {
        console.log('[MARZ] Speech recognition started')
      }

      recognitionInstance.onresult = (event: any) => {
        console.log('[MARZ] Speech recognition result:', event)
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('')

        // Store transcript in ref for access in onend
        transcriptRef.current = transcript

        // Update input field with transcript
        setInput(transcript)

        if (event.results[0].isFinal) {
          console.log('[MARZ] Final transcript:', transcript)
          setIsListening(false)
        }
      }

      recognitionInstance.onerror = (event: any) => {
        console.error('[MARZ] Speech recognition error:', event.error)
        setIsListening(false)
        
        // Provide helpful error messages
        if (event.error === 'not-allowed') {
          alert('Microphone access was denied. Please allow microphone access in your browser settings to use voice chat.')
        } else if (event.error === 'no-speech') {
          console.warn('[MARZ] No speech detected - please speak into the microphone')
        } else if (event.error === 'audio-capture') {
          console.warn('[MARZ] No microphone found')
          alert('No microphone was found. Please ensure a microphone is connected and enabled.')
        } else if (event.error === 'network') {
          console.warn('[MARZ] Network error occurred')
        }
      }

      recognitionInstance.onend = () => {
        console.log('[MARZ] Speech recognition ended')
        setIsListening(false)
        // Auto-submit the transcript when recognition ends
        const finalTranscript = transcriptRef.current
        if (finalTranscript.trim()) {
          console.log('[MARZ] Auto-submitting transcript:', finalTranscript)
          sendMessage({ role: 'user', content: finalTranscript } as any)
        }
      }

      setRecognition(recognitionInstance)
    } else {
      console.warn('[MARZ] Web Speech API not supported in this browser. Please use Chrome or Edge.')
    }
  }, [sendMessage, setInput])

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

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setSuggestions([])
    setIsLoading(true)
    await sendMessage(input as any)
    setInput('')
  }

  // Handle suggestion chip click
  const handleSuggestionClick = React.useCallback(async (suggestion: string) => {
    setSuggestions([])
    setInput(suggestion)
    setIsLoading(true)
    await sendMessage(suggestion as any)
    setInput('')
  }, [sendMessage])

  // Clear chat history
  const handleClearChat = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(MARZ_CHAT_HISTORY_KEY)
      localStorage.removeItem('marz_has_welcomed')
      setMessages(getDefaultWelcomeMessage())
      setSuggestions([])
      // Removed setIsSettingsOpen(false), SettingsPanel is not used
    }
  }, [setMessages])

  // Toggle chat visibility
  const handleToggle = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  // Toggle speech output and provide immediate feedback
  const handleSpeechToggle = React.useCallback(() => {
    setSpeechEnabled((prev) => {
      const isEnabling = !prev
      if (isEnabling) {
        const lastMessage = messages[messages.length - 1]
        if (lastMessage && lastMessage.role === 'assistant') {
          speakResponse((lastMessage as any).content)
        }
      } else if (synthRef.current?.speaking) {
        synthRef.current.cancel()
      }
      return isEnabling
    })
  }, [messages, speakResponse])

  // Close chat
  const handleClose = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <>
      <MarzAvatar
        ref={avatarRef}
        isOpen={isOpen}
        position={position}
        setIsOpen={setIsOpen}
        isLoading={isLoading}
        isSpeaking={isSpeaking}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="marz-chat-header"
            className={`fixed bottom-24 z-50 flex h-[600px] max-h-[80vh] w-[400px] max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/95 backdrop-blur shadow-2xl shadow-black/50 ${position === 'right' ? 'right-6' : 'left-6'}`}
          >
            <ChatHeader
              handleClearChat={handleClearChat}
              // Removed onToggleSettings, SettingsPanel is not used
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
              ref={inputRef}
              input={input}
              isLoading={isLoading}
              isListening={isListening}
              handleInputChange={e => setInput(e.target.value)}
              handleSubmit={handleFormSubmit}
              toggleVoiceInput={toggleVoiceInput}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
