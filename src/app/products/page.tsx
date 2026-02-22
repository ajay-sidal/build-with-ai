import type { Metadata } from 'next'
import ProductsClient from './ProductsClient'

export const metadata: Metadata = {
  title: 'Products | Domain, SSL, DNS & More',
  description:
    'Complete catalog of OpenProvider products: domain registration, SSL certificates, DNS hosting, email security, spam filtering, and server licenses. Everything you need to build and secure your online presence.',
  keywords: [
    'domain registration',
    'SSL certificates',
    'DNS hosting',
    'email security',
    'spam filtering',
    'server licenses',
    'Plesk',
    'DMARC',
    'OpenProvider',
  ],
  openGraph: {
    title: 'Products | BuildWithAI',
    description:
      'Complete catalog of OpenProvider products for your digital infrastructure needs.',
    url: '/products',
  },
}

export default function ProductsPage() {
  return <ProductsClient />
}
