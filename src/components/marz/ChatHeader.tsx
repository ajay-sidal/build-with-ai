'use client'

import { X, Sparkles, Trash2, Settings, PanelLeft, PanelRight } from 'lucide-react'
import { Button } from '../ui/button'

interface ChatHeaderProps {
  handleClearChat: () => void
  onToggleSettings?: () => void
  position: 'left' | 'right'
  onTogglePosition: () => void
  setIsOpen: (isOpen: boolean) => void
}

export default function ChatHeader({
  handleClearChat,
    onToggleSettings = () => {}, // Default to a no-op function if not provided
  position,
  onTogglePosition,
  setIsOpen,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h3 id="marz-chat-header" className="text-sm font-semibold text-zinc-100">MARZ</h3>
          <p className="text-xs text-zinc-400">AI Assistant</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleClearChat} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors" title="Clear chat history" aria-label="Clear chat history" variant="secondary">
          <Trash2 size={16} />
        </Button>
          <Button
            onClick={onToggleSettings}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title="Settings"
            aria-label="Settings"
            disabled={!onToggleSettings}
            style={!onToggleSettings ? { opacity: 0.5, pointerEvents: 'none' } : {}}
            variant="secondary"
          >
            <Settings size={16} />
          </Button>
        <Button onClick={onTogglePosition} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors" title={`Dock to ${position === 'right' ? 'left' : 'right'}`} aria-label={`Dock to ${position === 'right' ? 'left' : 'right'}`} variant="secondary">
          {position === 'right' ? <PanelLeft size={16} /> : <PanelRight size={16} />}
        </Button>
        <div className="h-4 w-px bg-zinc-700 mx-1"></div>
        <Button onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors" title="Close chat" aria-label="Close chat" variant="secondary">
          <X size={16} />
        </Button>
      </div>
    </div>
  )
}
