/// <reference types="vitest" />
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './input'

test('Input renders and updates value', async () => {
  const user = userEvent.setup()
  render(<Input data-testid="input" placeholder="Type" />)
  const input = screen.getByTestId('input') as HTMLInputElement
  await user.type(input, 'hello')
  expect(input.value).toBe('hello')
})
