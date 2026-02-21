import type { Metadata } from 'next'
import AiDesignClient from './AiDesignClient'

export const metadata: Metadata = {
  title: 'Bespoke AI‑Native Web Design',
  description:
    'Premium dark-mode web design for AI-native brands. Bespoke, conversion-first, and production-ready.',
  keywords: ['AI Web Design', 'Bespoke AI Sites', 'Next-Gen Agency', 'AI-first UX', 'Dark Mode SaaS Design'],
  openGraph: {
    title: 'Bespoke AI‑Native Web Design',
    description:
      'Premium dark-mode web design for AI-native brands. Bespoke, conversion-first, and production-ready.',
    url: '/services/ai-design',
  },
}

export default function AiDesignServicePage() {
  return <AiDesignClient />
}
