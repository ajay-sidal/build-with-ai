/// <reference types="vitest" />
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './textarea'

test('Textarea renders and accepts input', async () => {
  const user = userEvent.setup()
  render(<Textarea data-testid="ta" />)
  const ta = screen.getByTestId('ta') as HTMLTextAreaElement
  await user.type(ta, 'hello textarea')
  expect(ta.value).toBe('hello textarea')
})
