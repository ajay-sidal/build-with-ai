"use client"

import React from 'react'

type Result = { message: string; leadId?: string } | null

type Props = {
  open: boolean
  result: Result
  onClose: () => void
  onOpenLead?: (id: string) => void
}

export default function LeadModal({ open, result, onClose, onOpenLead }: Props) {
  if (!open || !result) return null
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const container = containerRef.current
    if (!container) return

    const focusable = Array.from(
      container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null)

    if (focusable.length) {
      focusable[0].focus()
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab') {
        if (focusable.length === 0) return
        const idx = focusable.indexOf(document.activeElement as HTMLElement)
        if (e.shiftKey) {
          if (idx === 0) {
            e.preventDefault()
            focusable[focusable.length - 1].focus()
          }
        } else {
          if (idx === focusable.length - 1) {
            e.preventDefault()
            focusable[0].focus()
          }
        }
      }
    }

    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('keydown', onKey)
      try {
        prev?.focus()
      } catch (e) {
        // ignore
      }
    }
  }, [open, onClose])

  return (
    <div ref={containerRef} role="dialog" aria-modal="true" className="mt-4 rounded-md border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-semibold">{result.message}</div>
          {result.leadId && <div className="text-xs text-zinc-400">Lead ID: {result.leadId}</div>}
        </div>
        <div className="flex items-center gap-2">
          {result.leadId && (
            <button
              className="rounded-md px-2 py-1 text-sm bg-zinc-800 hover:bg-zinc-700"
              onClick={() => onOpenLead?.(result.leadId!)}
            >
              Open
            </button>
          )}
          <button className="rounded-md px-2 py-1 text-sm bg-transparent hover:bg-zinc-800" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
