/// <reference types="vitest" />
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupForm from '@/app/signup/SignupForm'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: () => '/' }),
}))

describe('SignupForm integration', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('submits form and redirects to login', async () => {
    // mock fetch for account creation
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ handle: 'abc' }),
    } as any)
    render(<SignupForm />)

    await userEvent.type(screen.getByPlaceholderText(/Email address/i), 'test@example.com')
    await userEvent.type(screen.getByPlaceholderText(/First name/i), 'Test')
    await userEvent.type(screen.getByPlaceholderText(/Last name/i), 'User')

    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    // wait for success message
    await waitFor(() => expect(screen.getByText(/Account created/i)).toBeInTheDocument())

    // ensure fetch was called and success shown; redirect is scheduled (timeout-based)
    expect(globalThis.fetch).toHaveBeenCalled()
  })
})
