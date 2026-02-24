import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import LeadModal from '../LeadModal'

describe('LeadModal', () => {
  it('renders message and buttons and calls handlers', () => {
    const onClose = vi.fn()
    const onOpenLead = vi.fn()

    render(<LeadModal open={true} result={{ message: 'Lead created', leadId: 'abc123' }} onClose={onClose} onOpenLead={onOpenLead} />)

    expect(screen.getByText('Lead created')).toBeInTheDocument()
    expect(screen.getByText('Lead ID: abc123')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Open'))
    expect(onOpenLead).toHaveBeenCalledWith('abc123')

    fireEvent.click(screen.getByText('Close'))
    expect(onClose).toHaveBeenCalled()
  })

  it('does not render when closed or no result', () => {
    const { container } = render(<LeadModal open={false} result={null} onClose={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })
})
