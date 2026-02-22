'use client'

import * as React from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Loader2, Shield } from 'lucide-react'

type ProviderMap = Record<string, { id: string; name: string }>

export default function LoginClient() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/'
  const isAdmin = params.get('admin') === '1'

  const [providers, setProviders] = React.useState<Array<{ id: string; name: string }>>([])
  const [error, setError] = React.useState<string | null>(null)
  const [adminSecret, setAdminSecret] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    async function loadProviders() {
      try {
        const res = await fetch('/api/auth/providers', { cache: 'no-store' })
        const json = (await res.json().catch(() => null)) as ProviderMap | null
        if (!res.ok || !json) throw new Error('Failed to load providers')
        const list = Object.values(json).map((p) => ({ id: p.id, name: p.name }))
        if (!cancelled) {
          setProviders(list)
          setLoaded(true)
        }
      } catch (err) {
        if (!cancelled) {
          // Don't show error for provider loading - just continue without OAuth
          setProviders([])
          setLoaded(true)
        }
      }
    }

    loadProviders()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        adminSecret,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid admin secret')
      } else {
        router.push(next)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const oauthProviders = providers.filter((p) => p.id !== 'credentials' && p.id !== 'admin-secret')

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-16">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold tracking-tight">
            {isAdmin ? 'Admin Access' : 'Sign in'}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {isAdmin
              ? 'Enter your admin secret to access the dashboard.'
              : 'Sign in to BuildWithAI.digital'}
          </p>
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Admin Secret Login - Always show for admin access */}
          <form onSubmit={handleAdminLogin} className="grid gap-3">
            <div className="space-y-2">
              <label htmlFor="admin-secret" className="text-sm font-medium text-zinc-200">
                Admin Secret
              </label>
              <Input
                id="admin-secret"
                type="password"
                placeholder="Enter admin secret"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                className="h-12"
                autoComplete="off"
              />
            </div>
            <Button type="submit" disabled={isLoading || !adminSecret} className="h-12">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  {isAdmin ? 'Access Dashboard' : 'Sign in as Admin'}
                </>
              )}
            </Button>
          </form>

          {/* OAuth Providers (if configured) */}
          {!isAdmin && oauthProviders.length > 0 && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
                </div>
              </div>

              {oauthProviders.map((p) => (
                <Button
                  key={p.id}
                  type="button"
                  className="h-12"
                  variant="secondary"
                  onClick={() => signIn(p.id, { callbackUrl: next })}
                >
                  Continue with {p.name}
                </Button>
              ))}
            </>
          )}

          {/* Sign up link */}
          {!isAdmin && (
            <p className="text-center text-sm text-zinc-400">
              Don't have an account?{' '}
              <a href="/signup" className="text-zinc-200 underline hover:text-zinc-100">
                Sign up
              </a>
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
