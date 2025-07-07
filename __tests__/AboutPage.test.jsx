import AboutPage from 'src/pages/AboutPage';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('src/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    from: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: {}, error: null })
      })
    })
  }
}));

describe('AboutPage', () => {
  it('renders about page', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/About Us/i)).toBeInTheDocument();
    expect(screen.getByText(/AceVoyagers/i)).toBeInTheDocument();
  });
}); 