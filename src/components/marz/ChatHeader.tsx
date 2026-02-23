'use client'

import { X, Sparkles, Trash2, Settings, PanelLeft, PanelRight } from 'lucide-react'

interface ChatHeaderProps {
  handleClearChat: () => void
  onToggleSettings: () => void
  position: 'left' | 'right'
  onTogglePosition: () => void
  setIsOpen: (isOpen: boolean) => void
}

export default function ChatHeader({
  handleClearChat,
  onToggleSettings,
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
          <h3 className="text-sm font-semibold text-zinc-100">MARZ</h3>
          <p className="text-xs text-zinc-400">AI Assistant</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onToggleSettings} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors" title="Settings">
          <Settings size={16} />
        </button>
        <button onClick={onTogglePosition} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors" title={`Dock to ${position === 'right' ? 'left' : 'right'}`}>
          {position === 'right' ? <PanelLeft size={16} /> : <PanelRight size={16} />}
        </button>
        <div className="h-4 w-px bg-zinc-700 mx-1"></div>
        <button onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors" title="Close chat">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
