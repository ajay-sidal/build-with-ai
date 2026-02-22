'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface SettingsPanelProps {
  onClose: () => void
  speechEnabled: boolean
  setSpeechEnabled: (enabled: boolean) => void
  availableVoices: SpeechSynthesisVoice[]
  selectedVoice: string | null
  setSelectedVoice: (voiceURI: string) => void
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onClose,
  speechEnabled,
  setSpeechEnabled,
  availableVoices,
  selectedVoice,
  setSelectedVoice,
}) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="absolute inset-0 z-20 flex flex-col bg-zinc-950"
    >
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
        <button onClick={onClose} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <h3 className="text-sm font-semibold text-zinc-100">Settings</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase text-zinc-500">Voice Output</h4>
          <div className="flex items-center justify-between rounded-lg bg-zinc-900 p-3">
            <label htmlFor="speech-toggle" className="text-sm text-zinc-200">Enable Voice Responses</label>
            <button onClick={() => setSpeechEnabled(!speechEnabled)} id="speech-toggle" className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${speechEnabled ? 'bg-blue-600' : 'bg-zinc-700'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${speechEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          {speechEnabled && (
            <div className="rounded-lg bg-zinc-900 p-3">
              <label htmlFor="voice-select" className="block text-sm text-zinc-200 mb-2">Preferred Voice</label>
              <select id="voice-select" value={selectedVoice || ''} onChange={(e) => setSelectedVoice(e.target.value)} className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                {availableVoices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}