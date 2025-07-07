import PostPage from 'src/pages/PostPage';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

jest.mock('src/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    from: () => ({
      select: () => ({
        eq: () => ({ single: () => Promise.resolve({ data: {}, error: null }) })
      })
    })
  }
}));

describe('PostPage', () => {
  it('renders post page elements', () => {
    render(
      <MemoryRouter>
        <PostPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Sample Post Title/i)).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(5); // Main image + 4 gallery images
    expect(screen.getByText(/Back to Home/i)).toBeInTheDocument();
  });
}); 