/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Prepare environment and mocks for the checkout route
vi.mock('stripe', () => {
  // default export is a constructor function
  return {
    default: function StripeMock(_key: string, _opts: any) {
      return {
        checkout: {
          sessions: {
            create: vi.fn().mockResolvedValue({ id: 'sess_full_1' }),
          },
        },
      }
    }
  }
})

// Mock getServerSession to return a user email
vi.mock('next-auth/next', () => ({
  getServerSession: async () => ({ user: { email: 'u@e.com', id: 'user_1' } }),
}))

import * as routeModule from '@/app/api/checkout/route'

// Mock product catalog to include a product with id 'p1'
vi.mock('@/lib/openprovider-products', () => ({
  allProducts: [
    { id: 'p1', slug: 'p1', name: 'Test P1', pricing: { startingFrom: '10.00', currency: 'USD' }, description: 'x', category: 'Test' },
  ],
}))

describe('Checkout route handler', () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost'
  })

  it('returns a sessionId when POST called with cart items', async () => {
    const body = JSON.stringify({ cartItems: [{ id: 'p1', quantity: 1 }] })
    const req = new Request('http://localhost/api/checkout', { method: 'POST', body })

    // call the exported POST handler
    const res = await routeModule.POST(req as any)
    const json = await res.json()

    expect(json).toHaveProperty('sessionId')
  })
})
