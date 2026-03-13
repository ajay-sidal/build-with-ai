"use client"
import React from 'react'
import AnimatedHero3D from '../../components/ui/hero/AnimatedHero3D'

export default function HeroDemoPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-8 px-6 py-16">
      <h1 className="text-3xl font-semibold">Animated Hero 3D Demo</h1>
      <p className="text-zinc-400">A lightweight demo of the rotating globe hero (React Three Fiber).</p>
      <div className="w-full rounded-xl border border-zinc-800 bg-zinc-950/40 p-6">
        <AnimatedHero3D />
      </div>
    </main>
  )
}
