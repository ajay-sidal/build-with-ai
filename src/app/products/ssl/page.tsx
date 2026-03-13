import type { Metadata } from 'next'
import SSLProductsClient from './SSLProductsClient'

export const metadata: Metadata = {
  title: 'SSL Certificates | Secure Your Website',
  description:
    'SSL certificates from trusted CAs: Domain Validation, Organization Validation, Extended Validation, Wildcard, and Multi-Domain. Instant issuance, 99.9% compatibility. Starting at $9.99/year.',
  keywords: [
    'SSL certificate',
    'HTTPS',
    'TLS',
    'domain validation',
    'extended validation',
    'wildcard SSL',
    'multi-domain SSL',
    'code signing',
    'email certificate',
  ],
  openGraph: {
    title: 'SSL Certificates | BuildWithAI',
    description: 'Secure your website with SSL certificates from $9.99/year.',
    url: '/products/ssl',
  },
}

export default function SSLProductsPage() {
  return <SSLProductsClient />
}
