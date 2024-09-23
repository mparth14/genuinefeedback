import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/(app)/page';

jest.mock('@/messages.json', () => ([
  {
    title: "Anonymous Message 1",
    content: "This is the first anonymous message",
    received: "2024-09-18",
  },
  {
    title: "Anonymous Message 2",
    content: "This is the second anonymous message",
    received: "2024-09-19",
  }
]));

describe('Home Page Component', () => {
  it('renders the main heading and description', () => {
    render(<Home />);
    
    // Check for the main title
    const heading = screen.getByText(/dive into the world of anonymous feedback/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the footer with the current year', () => {
    render(<Home />);
    
    // Check for the footer content
    const footer = screen.getByText(/genuine feedback. all rights reserved/i);
    expect(footer).toBeInTheDocument();
  });
});
