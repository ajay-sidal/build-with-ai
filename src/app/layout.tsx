import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://buildwithai.digital'),
  title: {
    template: '%s | BuildWithAI.digital',
    default: 'Build With AI | Futuristic AI Domain & Infrastructure Hub',
  },
  description:
    "The world's first AI-driven domain registrar and security vault. Search, secure, and scale your digital assets with zero-knowledge SSL and instant DNS.",
  openGraph: {
    title: 'Build With AI | Futuristic AI Domain & Infrastructure Hub',
    description:
      "The world's first AI-driven domain registrar and security vault. Search, secure, and scale your digital assets with zero-knowledge SSL and instant DNS.",
    url: '/',
    siteName: 'BuildWithAI.digital',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Build With AI | Futuristic AI Domain & Infrastructure Hub',
    description:
      "The world's first AI-driven domain registrar and security vault. Search, secure, and scale your digital assets with zero-knowledge SSL and instant DNS.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-50">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
