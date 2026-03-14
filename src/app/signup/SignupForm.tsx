'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Loader2, Mail, Globe } from 'lucide-react'

export default function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/'

  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  const [form, setForm] = React.useState({
    email: '',
    first_name: '',
    last_name: '',
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          first_name: form.first_name,
          last_name: form.last_name,
        }),
      })

      const data = (await res.json()) as { handle?: string; error?: string }
      if (!res.ok) {
        throw new Error('error' in data ? data.error : 'Signup failed')
      }

      if (data.handle && typeof window !== 'undefined') {
        window.localStorage.setItem('op_customer_handle', data.handle)
      }

      setSuccess('Account created! Redirecting to sign in...')
      setTimeout(() => {
        router.push('/login?next=' + encodeURIComponent(next))
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-6 py-16">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-zinc-400">Simple signup to get started.</p>
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
          {success ? <p className="mt-3 text-sm text-emerald-300">{success}</p> : null}
        </CardHeader>

        <CardContent className="grid gap-4">
          {/* OAuth Signup Options */}
          <div className="grid gap-2">
            <Button 
              type="button" 
              variant="secondary" 
              className="h-12"
              onClick={() => signIn('google', { callbackUrl: next })}
            >
              <Globe className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-950 px-2 text-zinc-500">Or sign up with email</span>
            </div>
          </div>

          {/* Email Signup Form */}
          <form onSubmit={onSubmit} className="grid gap-3">
            <Input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                id="signup-first-name"
                name="first_name"
                placeholder="First name"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                required
              />
              <Input
                id="signup-last-name"
                name="last_name"
                placeholder="Last name"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="h-12">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Create account
                </>
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Button
              variant="secondary"
              onClick={() => router.push('/login?next=' + encodeURIComponent(next))}
              className="text-zinc-200 underline hover:text-zinc-100 p-0"
            >
              Sign in
            </Button>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
