import CategoryPage from 'src/pages/CategoryPage';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('src/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    from: () => ({
      select: () => ({
        eq: () => ({ single: () => Promise.resolve({ data: [], error: null }) })
      })
    })
  }
}));

describe('CategoryPage', () => {
  it('renders category page', () => {
    render(
      <MemoryRouter>
        <CategoryPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Category:/i)).toBeInTheDocument();
  });
}); 