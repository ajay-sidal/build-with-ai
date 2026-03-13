/// <reference types="vitest" />
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

test('renders Button and responds to click', async () => {
  const user = userEvent.setup()
  const handle = vi.fn()
  render(<Button onClick={handle}>Click me</Button>)
  const btn = screen.getByRole('button', { name: /click me/i })
  await user.click(btn)
  expect(handle).toHaveBeenCalled()
})
