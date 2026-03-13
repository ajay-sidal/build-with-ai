import type { Metadata } from 'next'
import DNSHostingClient from './DNSHostingClient'

export const metadata: Metadata = {
  title: 'DNS Hosting | Free DNS Management',
  description:
    'Free, reliable DNS hosting with global anycast network. Manage all your DNS records through an intuitive interface or API. 99.99% uptime, DNSSEC support, and instant propagation.',
  keywords: ['DNS hosting', 'DNS management', 'nameservers', 'DNSSEC', 'zone management', 'free DNS'],
  openGraph: {
    title: 'DNS Hosting | BuildWithAI',
    description: 'Free DNS hosting with global anycast network.',
    url: '/products/dns/hosting',
  },
}

export default function DNSHostingPage() {
  return <DNSHostingClient />
}
