import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileCode } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Code Signing Certificate | Sign Your Software',
  description: 'Eliminate "Unknown Publisher" warnings. Sign your software, applications, and scripts to verify authenticity.',
  openGraph: { title: 'Code Signing Certificate | BuildWithAI', url: '/products/ssl/code-signing' },
}

export default function CodeSigningPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/products/ssl" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to SSL Certificates
      </Link>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
            <FileCode size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Code Signing Certificate</h1>
            <p className="text-sm text-zinc-400">Verify software authenticity and eliminate warnings</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-zinc-300">
            Sign your software, applications, and scripts to verify authenticity and prevent security warnings. Essential for software publishers.
          </p>

          <h2>Benefits</h2>
          <ul>
            <li>Eliminate "Unknown Publisher" warnings</li>
            <li>Verify software authenticity</li>
            <li>Timestamp support for long-term validity</li>
            <li>Compatible with Microsoft, Java, Adobe</li>
            <li>Increased download confidence</li>
            <li>Malware protection indicator</li>
          </ul>

          <h2>Popular Options</h2>
          <ul>
            <li><strong>Standard Code Signing:</strong> $89.99/year - Basic signing</li>
            <li><strong>EV Code Signing:</strong> $299/year - EV validation with SmartScreen reputation</li>
            <li><strong>Microsoft IHV:</strong> $199/year - Kernel driver signing</li>
          </ul>

          <div className="mt-8">
            <Link href="/ssl" className="inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200">
              Get Code Signing Certificate
              <ArrowLeft size={16} className="ml-2 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
