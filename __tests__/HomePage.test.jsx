import React from 'react';
import HomePage from 'src/pages/HomePage';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('src/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null })
      })
    })
  }
}));

jest.spyOn(console, 'error').mockImplementation(() => {}); // silence fetch error logs

describe('HomePage', () => {
  it('renders hero section and newsletter', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    expect(await screen.findByText(/Explore the World with Us/i)).toBeInTheDocument();
    expect(await screen.findByText(/Join Our Travel Community/i)).toBeInTheDocument();
  });
}); 