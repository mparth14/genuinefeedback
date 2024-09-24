import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import VerifyAccount from '@/app/(auth)/verify/[username]/page';
import axios from 'axios';
import '@testing-library/jest-dom';


jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useParams: jest.fn(),
}));

jest.mock('@/components/ui/use-toast', () => ({
    useToast: jest.fn(),
}));

jest.mock('axios');

const mockRouter = {
    replace: jest.fn(),
};

const mockToast = jest.fn();

beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
});

afterEach(() => {
    jest.clearAllMocks();
});

test('renders VerifyAccount component', () => {
    (useParams as jest.Mock).mockReturnValue({ username: 'testuser' });
    
    render(<VerifyAccount />);

    expect(screen.getByText(/verify your account/i)).toBeInTheDocument();
    expect(screen.getByText(/enter the verification code sent to your email/i)).toBeInTheDocument();
});

test('submits form successfully', async () => {
    (useParams as jest.Mock).mockReturnValue({ username: 'testuser' });
    (axios.post as jest.Mock).mockResolvedValue({ data: { message: 'Verification successful!' } });
    
    render(<VerifyAccount />);
    
    fireEvent.input(screen.getByPlaceholderText(/enter your verification code/i), {
        target: { value: '123456' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));
    
    await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
            title: 'Success',
            description: 'Verification successful!',
        });
        expect(mockRouter.replace).toHaveBeenCalledWith('/sign-in');
    });
});

test('handles verification failure', async () => {
    (useParams as jest.Mock).mockReturnValue({ username: 'testuser' });
    (axios.post as jest.Mock).mockRejectedValue({
        response: { data: { message: 'Verification failed!' } },
    });
    
    render(<VerifyAccount />);
    
    fireEvent.input(screen.getByPlaceholderText(/enter your verification code/i), {
        target: { value: '134389' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /verify/i }));
    
    await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
            title: 'Signup failed',
            description: 'Verification failed!',
            variant: 'destructive',
        });
    });
});
