'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { Input } from '../../components/ui/input'

type CreateCustomerResponse = { handle: string } | { error: string }

export default function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/'

  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [form, setForm] = React.useState({
    email: '',
    first_name: '',
    last_name: '',
    street: '',
    number: '',
    zipcode: '',
    city: '',
    country: 'US',
    state: '',
    phone_country_code: '1',
    phone_area_code: '',
    phone_subscriber_number: '',
  })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/customers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          state: form.state || undefined,
          phone_area_code: form.phone_area_code || undefined,
        }),
      })

      const data = (await res.json()) as CreateCustomerResponse
      if (!res.ok) {
        throw new Error('error' in data ? data.error : 'Signup failed')
      }

      if ('handle' in data && data.handle) {
        window.localStorage.setItem('op_customer_handle', data.handle)
        router.push(next)
        return
      }

      throw new Error('Signup failed')
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
          <p className="mt-1 text-sm text-zinc-400">One step to unlock instant purchase + provisioning.</p>
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-3">
            <Input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                id="signup-first-name"
                name="first_name"
                placeholder="First name"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />
              <Input
                id="signup-last-name"
                name="last_name"
                placeholder="Last name"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Input
                id="signup-street"
                name="street"
                placeholder="Street"
                className="sm:col-span-2"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
              <Input
                id="signup-number"
                name="number"
                placeholder="No."
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Input
                id="signup-zip"
                name="zipcode"
                placeholder="Zip"
                value={form.zipcode}
                onChange={(e) => setForm({ ...form, zipcode: e.target.value })}
              />
              <Input
                id="signup-city"
                name="city"
                placeholder="City"
                className="sm:col-span-2"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                id="signup-country"
                name="country"
                placeholder="Country (ISO2)"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value.toUpperCase() })}
              />
              <Input
                id="signup-state"
                name="state"
                placeholder="State (optional)"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Input
                id="signup-phone-country"
                name="phone_country_code"
                placeholder="Phone country"
                value={form.phone_country_code}
                onChange={(e) => setForm({ ...form, phone_country_code: e.target.value })}
              />
              <Input
                id="signup-phone-area"
                name="phone_area_code"
                placeholder="Area (optional)"
                value={form.phone_area_code}
                onChange={(e) => setForm({ ...form, phone_area_code: e.target.value })}
              />
              <Input
                id="signup-phone-subscriber"
                name="phone_subscriber_number"
                placeholder="Subscriber"
                value={form.phone_subscriber_number}
                onChange={(e) => setForm({ ...form, phone_subscriber_number: e.target.value })}
              />
            </div>

            <Button type="submit" disabled={isLoading} className="h-12">
              {isLoading ? 'Creating…' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
