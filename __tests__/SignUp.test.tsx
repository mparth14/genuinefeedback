import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from '@/app/(auth)/sign-up/page';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';


jest.mock('axios');
jest.mock('@/components/ui/use-toast');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

const mockToast = jest.fn();
const mockRouter = { replace: jest.fn() };

describe('SignUpForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
    });

    it('renders the sign-up form', () => {
        render(<SignUpForm />);
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
    });
    

    it('checks username uniqueness and displays message', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: { message: 'Username is available.' } });

        render(<SignUpForm />);
        const usernameInput = screen.getByLabelText(/Username/i);
        
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });

        await waitFor(() => {
            expect(screen.getByText(/Username is available./)).toBeInTheDocument();
        });
    });

    it('displays error message for non-unique username', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: { message: 'Username already taken.' } });

        render(<SignUpForm />);
        const usernameInput = screen.getByLabelText(/Username/i);
        
        fireEvent.change(usernameInput, { target: { value: 'takenuser' } });

        await waitFor(() => {
            expect(screen.getByText(/Username already taken./)).toBeInTheDocument();
        });
    });

    it('submits the form successfully', async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({ data: { message: 'Sign up successful!' } });
        
        render(<SignUpForm />);

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
        
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: 'Success',
                description: 'Sign up successful!',
            });
        });
    });

    it('handles sign-up error and displays error toast', async () => {
        (axios.post as jest.Mock).mockRejectedValueOnce({ response: { data: { message: 'Sign-up failed.' } } });
        
        render(<SignUpForm />);

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
        
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: 'Sign Up Failed',
                description: 'Sign-up failed.',
                variant: 'destructive',
            });
        });
    });

    it('navigates to sign in page on link click', () => {
        render(<SignUpForm />);

        const signInLink = screen.getByText(/Sign in/i);
        fireEvent.click(signInLink);

        expect(signInLink.closest('a')).toHaveAttribute('href', '/sign-in');
    });
});