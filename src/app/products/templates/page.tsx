import type { Metadata } from 'next'
import TemplatesClient from './TemplatesClient'

export const metadata: Metadata = {
  title: 'Templates',
  description: 'Next.js boilerplates and Tailwind UI kits for AI-native SaaS teams.',
  keywords: ['Next.js Boilerplates', 'SaaS Templates', 'Tailwind UI Kits', 'Next.js App Router', 'UI Kits'],
  openGraph: {
    title: 'Templates',
    description: 'Next.js boilerplates and Tailwind UI kits for AI-native SaaS teams.',
    url: '/products/templates',
  },
}

export default function TemplatesStorefrontPage() {
  return <TemplatesClient />
}
