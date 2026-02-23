/// <reference types="vitest" />
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Select } from './select'

test('Select renders and changes value', async () => {
  const user = userEvent.setup()
  render(
    <Select data-testid="sel">
      <option value="a">A</option>
      <option value="b">B</option>
    </Select>
  )
  const sel = screen.getByTestId('sel') as HTMLSelectElement
  await user.selectOptions(sel, 'b')
  expect(sel.value).toBe('b')
})
