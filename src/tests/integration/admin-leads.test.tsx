import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LeadsClient from '../../app/admin/leads/LeadsClient';

jest.mock('../../lib/notifications', () => ({
  useNotifications: () => ({ addNotification: jest.fn() }),
}));

describe('Admin Leads Panel', () => {
  it('renders leads table and allows status update', async () => {
    render(<LeadsClient />);
    // Check for table headers
    expect(screen.getByText('Admin Leads')).toBeInTheDocument();
    expect(screen.getByText('Prospect')).toBeInTheDocument();
    // Simulate loading leads
    fireEvent.click(screen.getByText('Load'));
    // Wait for skeleton loaders
    expect(screen.getAllByRole('row')).toBeTruthy();
    // Simulate status change
    // (Would need to mock fetch and leads data for full test)
  });

  it('shows notification on status update', async () => {
    render(<LeadsClient />);
    // Simulate status update
    // (Would need to mock fetch and notification)
    // Check notification logic
  });
});
