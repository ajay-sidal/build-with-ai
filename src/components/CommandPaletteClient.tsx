"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '../lib/notifications'
import LeadModal from './LeadModal'

type Command = {
  id: string
  title: string
  action: 'search' | 'createLead' | 'navigate' | 'noop'
  payload?: string
}

const RECENT_KEY = 'bwai:recentCommands'

export default function CommandPaletteClient() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [recent, setRecent] = React.useState<Command[]>([])
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY)
      if (raw) setRecent(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K to toggle
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
      // Escape to close
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    } else {
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  const suggestions: Command[] = React.useMemo(() => {
    const q = query.trim()
    if (!q) {
      return [
        { id: 'recent', title: 'Recent commands', action: 'noop' },
        ...recent.slice(0, 5),
      ]
    }
    return [
      { id: `search:${q}`, title: `Search: ${q}`, action: 'search', payload: q },
      { id: `create:${q}`, title: `Create lead: ${q}@example.com`, action: 'createLead', payload: `${q}@example.com` },
      { id: `goto:${q}`, title: `Go to: /${q}`, action: 'navigate', payload: `/${q}` },
    ]
  }, [query, recent])

  const { addNotification } = useNotifications()

  const runCommand = React.useCallback(
    async (c: Command) => {
      try {
        if (c.action === 'search' && c.payload) {
          router.push(`/leads?q=${encodeURIComponent(c.payload)}`)
        } else if (c.action === 'createLead' && c.payload) {
          // call API to create/enqueue lead
          try {
            const res = await fetch('/api/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: c.payload }),
            })
            const js = await res.json().catch(() => ({}))
            // Prefer leadId if returned from processing
            const leadId = js?.result?.leadId || js?.leadId || js?.lead?.id || js?.id
            if (leadId) {
              addNotification({ type: 'success', title: 'Lead created', message: `Lead ${leadId} created` })
              setLastResult({ message: 'Lead created', leadId })
              // show modal with details rather than immediate navigation
              setShowModal(true)
            } else {
              addNotification({ type: 'success', title: 'Lead queued', message: js?.jobId ? `Job ${js.jobId} enqueued` : 'Lead processed' })
              setLastResult({ message: js?.jobId ? `Job ${js.jobId} enqueued` : 'Lead processed', leadId: undefined })
              setShowModal(true)
            }
          } catch (e) {
            console.error('create lead failed', e)
            addNotification({ type: 'error', title: 'Lead failed', message: 'Could not enqueue lead' })
          }
        } else if (c.action === 'navigate' && c.payload) {
          router.push(c.payload)
        }

        // persist recent
        const next = [{ id: c.id, title: c.title, action: c.action, payload: c.payload }, ...recent.filter((r) => r.id !== c.id)].slice(0, 20)
        setRecent(next)
        try {
          localStorage.setItem(RECENT_KEY, JSON.stringify(next))
        } catch (e) {
          /* ignore */
        }
      } catch (e) {
        console.error('command failure', e)
      } finally {
        setOpen(false)
        setQuery('')
      }
    },
    [router, recent, addNotification]
  )

  const [lastResult, setLastResult] = React.useState<{ message: string; leadId?: string } | null>(null)
  const [showModal, setShowModal] = React.useState(false)

  // keyboard nav inside list
  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
      e.preventDefault()
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((i) => Math.max(i - 1, 0))
      e.preventDefault()
    } else if (e.key === 'Enter') {
      const sel = suggestions[activeIndex]
      if (sel) runCommand(sel)
      e.preventDefault()
    }
  }

  if (!open) {
    return (
      <div aria-hidden className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-700"
          aria-label="Open command palette"
        >
          ⌘K
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
      <div className="relative z-10 w-full max-w-2xl rounded-lg bg-zinc-950 p-4 shadow-lg">
        <label className="sr-only">Command palette</label>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Type a command or search..."
          className="w-full rounded-md border border-zinc-800 bg-transparent px-4 py-3 text-sm text-zinc-100 focus:outline-none"
          aria-label="Command palette input"
        />

        <ul className="mt-3 max-h-60 overflow-auto">
          {suggestions.map((s, idx) => {
            if (s.id === 'recent') {
              return (
                <li key="recent-header" className="px-3 py-2 text-xs uppercase text-zinc-500">
                  {s.title}
                </li>
              )
            }
            return (
              <li
                key={s.id}
                className={`cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 ${idx === activeIndex ? 'bg-zinc-800' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => runCommand(s)}
              >
                {s.title}
              </li>
            )
          })}
        </ul>
        <LeadModal
          open={showModal}
          result={lastResult}
          onClose={() => setShowModal(false)}
          onOpenLead={(id) => {
            setShowModal(false)
            router.push(`/leads/${id}`)
          }}
        />
      </div>
    </div>
  )
}
