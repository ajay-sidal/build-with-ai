import type { Metadata } from 'next'
import SslVaultClient from './SslVaultClient'

export const metadata: Metadata = {
  title: 'SSL Vault',
  description: 'Zero-knowledge SSL: generate private keys and CSRs locally, then order secure certificates.',
  keywords: ['Zero-Knowledge SSL', 'Private CSR Generation', 'Secure Certificates', 'CSR PEM', 'SSL Approver Emails'],
  openGraph: {
    title: 'SSL Vault',
    description: 'Zero-knowledge SSL: generate private keys and CSRs locally, then order secure certificates.',
    url: '/ssl',
  },
}

export default function SslVaultPage() {
  return <SslVaultClient />
}
