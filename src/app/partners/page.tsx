import type { Metadata } from 'next'
import PartnersClient from './PartnersClient'

export const metadata: Metadata = {
  title: 'Partners',
  description: 'Join the BuildWithAI partner program and earn commission on referrals.',
}

export default function PartnersPage() {
  return <PartnersClient />
}
