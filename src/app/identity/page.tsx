import type { Metadata } from 'next'
import IdentityClient from './IdentityClient'

export const metadata: Metadata = {
  title: 'Sovereign Identity',
  description: 'Stop renting your identity. Bridge your domain to the protocol and claim sovereign control.',
  openGraph: {
    title: 'Sovereign Identity',
    description: 'Stop renting your identity. Bridge your domain to the protocol and claim sovereign control.',
    url: '/identity',
  },
}

export default function IdentityPage() {
  return <IdentityClient />
}
