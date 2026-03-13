/// <reference types="vitest" />
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './switch'

test('Switch toggles checked state via user interaction', async () => {
  const user = userEvent.setup()
  render(<Switch data-testid="sw" />)
  const sw = screen.getByTestId('sw') as HTMLInputElement
  expect(sw.checked).toBe(false)
  await user.click(sw)
  expect(sw.checked).toBe(true)
})
