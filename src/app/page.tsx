import Link from 'next/link'
import { ArrowRight, Sparkles, Globe, Shield, Server, Zap, Mail, CheckCircle, Code } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-400 mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Powered by Advanced AI</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Build Your Digital
              <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Future Today
              </span>
            </h1>
            <p className="mt-8 text-lg leading-8 text-zinc-400 max-w-2xl mx-auto">
              The world's first AI-driven domain registrar and infrastructure hub.
              Search, secure, and scale your digital assets with zero-knowledge SSL
              and instant DNS provisioning.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/products"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-blue-500/25"
              >
                Explore Products
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/developers"
                className="text-base font-semibold leading-7 text-zinc-300 hover:text-white transition-colors"
              >
                Developers →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              A complete ecosystem of tools and services for your digital presence
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-blue-500/50 hover:bg-zinc-800/50">
              <Globe className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Domain Services</h3>
              <p className="text-zinc-400">
                Register, transfer, and manage domains with AI-powered recommendations 
                and instant provisioning.
              </p>
              <Link href="/products/domains" className="mt-4 inline-flex items-center text-blue-400 hover:text-blue-300">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-blue-500/50 hover:bg-zinc-800/50">
              <Shield className="h-12 w-12 text-emerald-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">SSL Certificates</h3>
              <p className="text-zinc-400">
                Zero-knowledge SSL certificates with instant issuance. From DV to EV, 
                we've got you covered.
              </p>
              <Link href="/products/ssl" className="mt-4 inline-flex items-center text-emerald-400 hover:text-emerald-300">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-blue-500/50 hover:bg-zinc-800/50">
              <Server className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">DNS & Security</h3>
              <p className="text-zinc-400">
                Advanced DNS management with DDoS protection, DNSSEC, and AI-optimized 
                routing.
              </p>
              <Link href="/products/dns" className="mt-4 inline-flex items-center text-purple-400 hover:text-purple-300">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-blue-500/50 hover:bg-zinc-800/50">
              <Mail className="h-12 w-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email Security</h3>
              <p className="text-zinc-400">
                Spam filtering, email signing, and DMARC management to keep your 
                communications secure.
              </p>
              <Link href="/products/email" className="mt-4 inline-flex items-center text-orange-400 hover:text-orange-300">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-blue-500/50 hover:bg-zinc-800/50">
              <Zap className="h-12 w-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Licenses</h3>
              <p className="text-zinc-400">
                Plesk, Virtuozzo, and other essential licenses for your hosting 
                infrastructure.
              </p>
              <Link href="/products/licenses" className="mt-4 inline-flex items-center text-yellow-400 hover:text-yellow-300">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all hover:border-blue-500/50 hover:bg-zinc-800/50">
              <Code className="h-12 w-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Developer API</h3>
              <p className="text-zinc-400">
                Full API access to automate your entire digital infrastructure 
                management.
              </p>
              <Link href="/developers" className="mt-4 inline-flex items-center text-cyan-400 hover:text-cyan-300">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-16 text-center shadow-2xl sm:px-16 sm:py-24">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-blue-100">
              Join thousands of developers and businesses building with AI-powered infrastructure.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signup"
                className="rounded-lg bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-lg transition-all hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                href="/about"
                className="text-base font-semibold leading-7 text-white hover:text-blue-100 transition-colors"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
