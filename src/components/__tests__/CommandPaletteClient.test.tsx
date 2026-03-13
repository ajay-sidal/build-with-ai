import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CommandPaletteClient from '../CommandPaletteClient'

// Provide minimal NotificationProvider wrapper
import { NotificationProvider } from '../../lib/notifications'
import { vi } from 'vitest'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

function Wrapper({ children }: { children: React.ReactNode }) {
  return <NotificationProvider>{children}</NotificationProvider>
}

describe('CommandPaletteClient', () => {
  it('renders trigger button and opens palette', async () => {
    render(
      <Wrapper>
        <CommandPaletteClient />
      </Wrapper>
    )

    const btn = screen.getByLabelText(/open command palette/i)
    expect(btn).toBeInTheDocument()

    fireEvent.click(btn)

    const input = await screen.findByLabelText(/command palette input/i)
    expect(input).toBeInTheDocument()
  })
})
