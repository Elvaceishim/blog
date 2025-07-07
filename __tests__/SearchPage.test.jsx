import SearchPage from 'src/pages/SearchPage';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('src/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    from: () => ({
      select: () => ({
        ilike: () => ({ single: () => Promise.resolve({ data: [], error: null }) })
      })
    })
  }
}));

describe('SearchPage', () => {
  it('renders search input', () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/Search for destinations/i)).toBeInTheDocument();
  });
}); 