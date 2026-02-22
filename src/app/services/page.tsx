import type { Metadata } from 'next'
import ServicesOverviewClient from './ServicesOverviewClient'

export const metadata: Metadata = {
  title: 'Services | Domain Management, SSL, API & More',
  description:
    'Professional services for your digital infrastructure: domain portfolio management, SSL lifecycle management, API integration, and white-label solutions for resellers.',
  keywords: [
    'domain management',
    'SSL management',
    'API integration',
    'white label',
    'reseller services',
    'infrastructure services',
  ],
  openGraph: {
    title: 'Services | BuildWithAI',
    description: 'Professional services for your digital infrastructure needs.',
    url: '/services',
  },
}

export default function ServicesPage() {
  return <ServicesOverviewClient />
}
