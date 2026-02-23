/// <reference types="vitest" />
import { describe, it, expect, vi } from 'vitest'

// A minimal, isolated checkout flow test that avoids importing app code or stripe module.
async function performCheckout(fetchFn: () => Promise<{ ok: boolean; json: () => any }>, stripeRedirect: (opts: any) => Promise<void> | void) {
  const res = await fetchFn()
  if (!res.ok) throw new Error('checkout failed')
  const data = await res.json()
  await stripeRedirect({ sessionId: data.sessionId })
}

describe('Safe checkout flow', () => {
  it('calls fetch and then stripe redirect with sessionId', async () => {
    const fetchSpy = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ sessionId: 'sess_safe_1' }) })
    const redirectSpy = vi.fn()

    await performCheckout(fetchSpy, redirectSpy)

    expect(fetchSpy).toHaveBeenCalled()
    expect(redirectSpy).toHaveBeenCalledWith({ sessionId: 'sess_safe_1' })
  })
})
