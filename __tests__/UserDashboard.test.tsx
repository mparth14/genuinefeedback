// UserDashboard.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import UserDashboard from "@/app/(app)/dashboard/page";
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom'; // to use matchers like toBeInTheDocument

jest.mock('next-auth/react');
jest.mock('axios');

// Mock the session data
const mockSession = {
  user: {
    name: 'Test User',
    username: 'testuser',
    email: 'testuser@gmail.com',
  },
  expires: '9999-12-31T23:59:59.999Z',
};

describe('UserDashboard', () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
    });

    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        messages: [{ _id: '1', content: 'Message 1' }, { _id: '2', content: 'Message 2' }],
      },
    });

    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        message: 'Settings updated successfully',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard with the user’s unique link and profile', async () => {
    render(<UserDashboard />);
    
    await waitFor(() => {
      const uniqueLinkInput = screen.getByDisplayValue('http://localhost/u/testuser');
      expect(uniqueLinkInput).toBeInTheDocument();
    });
  });

  it('fetches and displays messages on initial load', async () => {
    render(<UserDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Message 1')).toBeInTheDocument();
      expect(screen.getByText('Message 2')).toBeInTheDocument();
    });
  });

  it('displays "No messages to display" when there are no messages', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        success: true,
        messages: [],
      },
    });
  
    render(<UserDashboard />);
  
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
    await waitFor(() => {
      // Ensure the loading state is no longer present
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  
      expect(screen.getByText(/No messages to display/i)).toBeInTheDocument();
    });
  });
  
  it('toggles accept messages switch', async () => {
    render(<UserDashboard />);
  
    const switchElement = await screen.findByRole('switch');
  
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  
    fireEvent.click(switchElement);
  
    // Check that the switch toggles to the "on" state
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });
  
});