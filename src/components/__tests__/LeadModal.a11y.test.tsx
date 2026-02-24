import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LeadModal from '../LeadModal'

describe('LeadModal accessibility', () => {
  test('focuses first interactive element and has dialog role', async () => {
    render(<LeadModal open={true} result={{ message: 'Lead created', leadId: 'abc123' }} onClose={() => {}} onOpenLead={() => {}} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    // first interactive element should be the Open button
    const openBtn = screen.getByText('Open')
    await userEvent.tab()
    expect(document.activeElement).toBe(openBtn)
  })
})
