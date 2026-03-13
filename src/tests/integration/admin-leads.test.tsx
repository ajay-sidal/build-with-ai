import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LeadsClient from '../../app/admin/leads/LeadsClient'

// Mock notifications hook
vi.mock('../../../lib/notifications', () => ({
  useNotifications: () => ({ addNotification: vi.fn() }),
}))

// Mock drag-and-drop hook
vi.mock('../../../lib/drag-and-drop', () => ({
  useDragAndDropList: () => ({
    dragIndex: null,
    hoverIndex: null,
    handlers: {
      onDragStart: vi.fn(),
      onDragOver: vi.fn(),
      onDrop: vi.fn(),
      onDragEnd: vi.fn(),
    },
  }),
}))

describe('Admin Leads Panel', () => {
  it('renders without crashing', () => {
    render(<LeadsClient />)
    // Component should render without errors
    expect(screen.getByText('Admin Leads')).toBeInTheDocument()
  })

  it('shows input for admin secret', () => {
    render(<LeadsClient />)
    expect(screen.getByPlaceholderText('ADMIN_SECRET')).toBeInTheDocument()
  })
})
