'use client'

import * as React from 'react'

export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-zinc-700/30 ${className}`} />
}
