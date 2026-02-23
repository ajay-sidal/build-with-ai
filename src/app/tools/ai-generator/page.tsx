import type { Metadata } from 'next'
import AIContentGenerator from '@/components/AIContentGenerator'

export const metadata: Metadata = {
  title: 'AI Content Generator | BUILD WITH AI',
  description: 'Generate professional content instantly using AI. Product descriptions, blog posts, emails, and more.',
}

export default function AIContentGeneratorPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-6 py-16">
      <AIContentGenerator />
    </main>
  )
}
