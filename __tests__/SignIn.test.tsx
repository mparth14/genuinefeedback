import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '@/app/(auth)/sign-in/page'; // Adjust the import path as necessary
import { signIn } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';


jest.mock('next-auth/react', () => ({
    signIn: jest.fn(),
}));

jest.mock('@/components/ui/use-toast', () => ({
    useToast: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter() {
      return {
        prefetch: () => null
      };
    }
}));

describe('Sign In Page', () => {
    const mockToast = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    });

    it('renders the sign in formssss', () => {

        render(<Page/>)
        expect(screen.getByLabelText(/Email\/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('shows a toast notification on incorrect credentials', async () => {
        (signIn as jest.Mock).mockResolvedValueOnce({ error: 'Invalid credentials' });

        render(<Page />);

        fireEvent.change(screen.getByLabelText(/Email\/Username/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Password/i), {
            target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith({
                title: 'Login Failed',
                description: 'Incorrect credentials. Please try again',
                variant: 'destructive',
            });
        });
    });

    it('navigates to sign up page on link click', () => {
        render(<Page />);

        const signUpLink = screen.getByText(/Sign up/i);
        fireEvent.click(signUpLink);

        expect(signUpLink.closest('a')).toHaveAttribute('href', '/sign-up');
    });
});
