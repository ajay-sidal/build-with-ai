import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/ui/ScrollToTop';
import SilasChat from '@/components/ui/SilasChat';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BUILDWITHAI Enterprise',
  description: 'Sovereign Infrastructure for the Decentralized Future',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-[#0a0a0a] text-white relative`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ScrollToTop />
        <SilasChat />
      </body>
    </html>
  );
}
