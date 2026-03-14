import Link from 'next/link'
import { Sparkles, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <Sparkles size={48} className="text-zinc-400" />
            </div>
          </div>

          <h1 className="text-sovereign-title text-balance text-6xl text-zinc-100">404</h1>
          <p className="mt-4 text-balance text-lg text-zinc-400">
            Sorry, we couldn't find the page you're looking for.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-6 py-3 text-sm font-medium text-zinc-50 transition hover:bg-zinc-900"
            >
              <Home size={16} />
              Back to Home
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
            >
              <Search size={16} />
              Browse Products
            </Link>
          </div>

          <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 text-left">
            <h2 className="text-sm font-medium text-zinc-200">Quick Links</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">
                Domain Search
              </Link>
              <Link href="/ssl" className="text-sm text-zinc-400 hover:text-zinc-200">
                SSL Vault
              </Link>
              <Link href="/products" className="text-sm text-zinc-400 hover:text-zinc-200">
                Products
              </Link>
              <Link href="/services" className="text-sm text-zinc-400 hover:text-zinc-200">
                Services
              </Link>
              <Link href="/developers" className="text-sm text-zinc-400 hover:text-zinc-200">
                Developers
              </Link>
              <Link href="/partners" className="text-sm text-zinc-400 hover:text-zinc-200">
                Partners
              </Link>
              <Link href="/about" className="text-sm text-zinc-400 hover:text-zinc-200">
                About
              </Link>
              <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-200">
                Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-800/80 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} BuildWithAI.digital</span>
          <span>Infrastructure for AI-native teams</span>
        </div>
      </footer>
    </div>
  )
}
