import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import SilasChat from '@/components/ui/SilasChat';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'BUILDWITHAI Enterprise',
  description: 'Sovereign Infrastructure for the Decentralized Future',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className} flex flex-col min-h-screen bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] relative`}>
        <ThemeProvider>
          <Navbar />
          <main id="main-content" className="flex-grow">{children}</main>
          <Footer />
          <ScrollToTop />
          <SilasChat />
        </ThemeProvider>
      </body>
    </html>
  );
}
