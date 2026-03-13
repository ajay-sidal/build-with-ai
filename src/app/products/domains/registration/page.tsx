import type { Metadata } from 'next'
import DomainRegistrationClient from './DomainRegistrationClient'

export const metadata: Metadata = {
  title: 'Domain Registration | Register Your Perfect Domain',
  description:
    'Register your perfect domain name from over 1,500+ TLDs worldwide. Instant activation, competitive pricing, free WHOIS privacy, and comprehensive management tools. Start from $8.06/year.',
  keywords: [
    'domain registration',
    'buy domain',
    'register domain',
    '.com domain',
    'cheap domains',
    'domain names',
    'TLD',
    'OpenProvider',
  ],
  openGraph: {
    title: 'Domain Registration | BuildWithAI',
    description: 'Register your perfect domain from 1,500+ TLDs. Starting at $8.06/year.',
    url: '/products/domains/registration',
  },
}

export default function DomainRegistrationPage() {
  return <DomainRegistrationClient />
}
