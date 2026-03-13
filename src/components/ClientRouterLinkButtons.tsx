"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import React from 'react'

type Item = {
  href: string
  label: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
}

export default function ClientRouterLinkButtons({ items }: { items: Item[] }) {
  const router = useRouter()
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <Button
          key={i}
          variant={(it.variant as any) || 'secondary'}
          onClick={() => router.push(it.href)}
          className={it.className}
        >
          {it.label}
        </Button>
      ))}
    </div>
  )
}
