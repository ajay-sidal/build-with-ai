import type { Metadata } from 'next'
import AboutHeroClient from './AboutHeroClient'
import ImpactTracker from './ImpactTracker'
import LaunchMagnet from '../../components/LaunchMagnet'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import ExternalLink from '../../components/ExternalLink'

export const runtime = 'nodejs'

export const metadata: Metadata = {
  title: 'Our Vision | The Mission Behind BuildWithAI.digital',
  description:
    "Learn why we built the world's first AI-native infrastructure hub and how every purchase fuels the MARZ Project.",
}

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <LaunchMagnet defaultOpen={false} />

      <AboutHeroClient />

      <ImpactTracker />

      <Card>
        <CardHeader>
          <div className="text-xs uppercase tracking-widest text-zinc-500">The Problem</div>
          <div className="mt-1 text-base font-medium text-zinc-100">Registrars stopped evolving.</div>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-zinc-300">
          Legacy registrars haven’t innovated since 2005. They prioritize margins over security and speed — and the
          experience reflects it.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-xs uppercase tracking-widest text-zinc-500">The Solution</div>
          <div className="mt-1 text-base font-medium text-zinc-100">Infrastructure that feels instant.</div>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-zinc-300">
          BuildWithAI.digital is a digital utility built by developers, for the future. We provide zero-knowledge security
          patterns and AI-native speeds because the next era of the internet demands it.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-xs uppercase tracking-widest text-zinc-500">The Mission</div>
          <div className="mt-1 text-base font-medium text-zinc-100">Every purchase fuels MARZ.</div>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-zinc-300">
          Revenue from this platform directly funds the MARZ Project — our moonshot initiative to revolutionize
          AI‑human collaboration and build tools that expand what small teams can achieve.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-xs uppercase tracking-widest text-zinc-500">Founder's Desk</div>
          <div className="mt-1 text-base font-medium text-zinc-100">Transparency over hype.</div>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-zinc-300">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-sm text-zinc-200">— Ajay Sidal</div>
            <div className="mt-1 text-xs text-zinc-500">Founder, BuildWithAI.digital</div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              <ExternalLink className="text-zinc-200 underline underline-offset-4" href="https://www.linkedin.com/" target="_blank">LinkedIn</ExternalLink>
              <ExternalLink className="text-zinc-200 underline underline-offset-4" href="https://x.com/" target="_blank">X</ExternalLink>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
