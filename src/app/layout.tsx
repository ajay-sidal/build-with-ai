import type { Metadata } from 'next'
import React, { Suspense } from 'react'
import SessionProvider from '../components/providers/SessionProvider'
import { ThemeProvider } from '../components/providers/ThemeProvider'
import { NotificationProvider } from '../lib/notifications'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AffiliateRefTracker from '../components/AffiliateRefTracker'
import MarzChatWidget from '../components/marz/MarzChatWidget'
import { CartProvider } from '../components/providers/CartProvider'
import CookieConsent from '../components/CookieConsent'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://buildwithai.digital'),
  title: {
    template: '%s | BUILD WITH AI',
    default: 'BUILD WITH AI | Futuristic AI Domain & Infrastructure Hub',
  },
  description:
    "The world's first AI-driven domain registrar and security vault. Search, secure, and scale your digital assets with zero-knowledge SSL and instant DNS.",
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'BUILD WITH AI | Futuristic AI Domain & Infrastructure Hub',
    description:
      "The world's first AI-driven domain registrar and security vault. Search, secure, and scale your digital assets with zero-knowledge SSL and instant DNS.",
    url: '/',
    siteName: 'BUILD WITH AI',
    type: 'website',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'BUILD WITH AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BUILD WITH AI | Futuristic AI Domain & Infrastructure Hub',
    description:
      "The world's first AI-driven domain registrar and security vault. Search, secure, and scale your digital assets with zero-knowledge SSL and instant DNS.",
    images: ['/icon.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    componentDidCatch(error: any, info: any) {
      // Log error to monitoring service
      console.error('Global Error:', error, info);
    }
    render() {
      if (this.state.hasError) {
        return <div className="p-8 text-center text-red-600">Something went wrong. Please refresh.</div>;
      }
      return this.props.children;
    }
  }
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
        <ErrorBoundary>
          <SessionProvider>
            <ThemeProvider>
              <NotificationProvider>
                <CartProvider>
                  <Navbar />
                  <Suspense fallback={null}>
                    <AffiliateRefTracker />
                  </Suspense>
                  <div className="flex-1">{children}</div>
                  <Footer />
                  <MarzChatWidget />
                  <CookieConsent />
                </CartProvider>
              </NotificationProvider>
            </ThemeProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
