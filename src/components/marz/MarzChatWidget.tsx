'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, X, Volume2, VolumeX, Trash2 } from 'lucide-react'

// Storage key for chat persistence
const MARZ_CHAT_HISTORY_KEY = 'marz_chat_history'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
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

export default function MarzChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)
  const [speechEnabled, setSpeechEnabled] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const recognitionRef = React.useRef<SpeechRecognition | null>(null)
  const synthRef = React.useRef<SpeechSynthesis | null>(null)
  const messagesRef = React.useRef<Message[]>([])

  // Keep messagesRef in sync
  React.useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  // Initialize speech synthesis
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Initialize speech recognition
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        console.log('[MARZ] Voice recognition started')
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('')
        
        console.log('[MARZ] Voice transcript:', transcript)
        setInput(transcript)

        if (event.results[0].isFinal) {
          setIsListening(false)
          // Auto-submit after short delay
          setTimeout(() => {
            if (transcript.trim()) {
              handleSendMessage(transcript)
            }
          }, 500)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('[MARZ] Voice recognition error:', event.error)
        setIsListening(false)
        
        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone access in your browser settings.')
        } else if (event.error === 'no-speech') {
          setError('No speech detected. Please try again.')
        }
      }

      recognition.onend = () => {
        console.log('[MARZ] Voice recognition ended')
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } else {
      console.warn('[MARZ] Web Speech API not supported in this browser')
    }
  }, [])

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load chat history
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem(MARZ_CHAT_HISTORY_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
          return
        }
      } catch (e) {
        console.error('[MARZ] Failed to load chat history:', e)
      }
    }
    
    // Default welcome message
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hi! I'm **MARZ**, your personal AI assistant for BUILD WITH AI. I can help you register domains, secure your website with SSL certificates, set up DNS hosting, and much more. What would you like to work on today?",
    }])
  }, [])

  // Save chat history
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (messages.length > 0) {
      localStorage.setItem(MARZ_CHAT_HISTORY_KEY, JSON.stringify(messages))
    }
  }, [messages])

  const speakResponse = React.useCallback((text: string) => {
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
      (v) => v.name.includes('Google US English') || v.name.includes('Female')
    )
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    synthRef.current.speak(utterance)
  }, [speechEnabled])

  const handleSendMessage = React.useCallback(async (messageText: string) => {
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setError(null)
    setIsLoading(true)

    try {
      const currentMessages = messagesRef.current
      const apiMessages = [...currentMessages, userMessage].slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      }))

      console.log('[MARZ] Sending to API:', messageText)
      
      const response = await fetch('/api/marz/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      console.log('[MARZ] API response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[MARZ] API error:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log('[MARZ] API response data:', data)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I couldn\'t process that request.',
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (speechEnabled) {
        speakResponse(assistantMessage.content)
      }
    } catch (err) {
      console.error('[MARZ] Send error:', err)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${err instanceof Error ? err.message : 'Please try again.'}`,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [speechEnabled, speakResponse])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      handleSendMessage(input)
    }
  }

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setError('Voice recognition is not supported in your browser. Please use Chrome or Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      // Request microphone permission first
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          recognitionRef.current?.start()
        })
        .catch((err) => {
          console.error('[MARZ] Microphone access error:', err)
          setError('Microphone access denied. Please allow microphone access in your browser settings.')
        })
    }
  }

  const handleClearChat = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(MARZ_CHAT_HISTORY_KEY)
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "👋 Hi! I'm **MARZ**, your personal AI assistant. How can I help you today?",
      }])
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg transition-all hover:shadow-xl hover:shadow-blue-500/30"
      >
        {isOpen ? <X size={24} /> : (
          <div className="relative">
            <span className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative">🤖</span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900/95 backdrop-blur shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-semibold text-zinc-100">MARZ AI Assistant</h3>
                  <p className="text-xs text-zinc-400">Build With AI</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  title={speechEnabled ? 'Disable voice' : 'Enable voice'}
                >
                  {speechEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                <button
                  onClick={handleClearChat}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  title="Clear chat"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                        : 'bg-zinc-800 text-zinc-100'
                    }`}
                  >
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/^- /gm, '• ')}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="mb-4 flex justify-start">
                  <div className="rounded-2xl bg-zinc-800 px-4 py-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '0.1s' }}></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="mb-4 rounded-lg bg-red-900/20 p-3 text-xs text-red-400">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-4">
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={isLoading}
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-all ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                  placeholder="Ask me anything..."
                  rows={1}
                  disabled={isLoading}
                  className="max-h-32 flex-1 resize-none rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-50"
                  style={{ minHeight: '44px' }}
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
              {isListening && (
                <p className="mt-2 text-center text-xs text-red-400 animate-pulse">
                  🔴 Listening... Speak now
                </p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
