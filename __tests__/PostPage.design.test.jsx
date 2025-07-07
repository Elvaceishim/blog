import PostPage from 'src/pages/PostPage';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const mockPost = {
  id: '1',
  title: 'A Journey to Paris',
  content: 'Experience the romance and beauty of Paris in this detailed travel guide.',
  image: 'https://placehold.co/800x400',
  author: {
    name: 'Jane Doe',
    avatar: 'https://placehold.co/64x64',
    bio: 'Travel writer and photographer.'
  },
  date: '2024-06-01',
  gallery: [
    'https://placehold.co/200x140',
    'https://placehold.co/200x140',
    'https://placehold.co/200x140',
  ],
};

jest.mock('src/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    from: () => ({
      select: () => ({
        eq: () => ({ single: () => Promise.resolve({ data: mockPost, error: null }) })
      })
    })
  }
}));

describe('PostPage (Design)', () => {
  const renderWithRouter = () => {
    render(
      <MemoryRouter initialEntries={[`/post/1`]}>
        <Routes>
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders a beautiful post layout with main image, title, author, and content', async () => {
    renderWithRouter();
    expect(await screen.findByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /paris/i })).toBeInTheDocument();
    expect(screen.getByAltText(/main post image/i)).toBeInTheDocument();
    expect(screen.getByText(/jane doe/i)).toBeInTheDocument();
    expect(screen.getByText(/romance and beauty of paris/i)).toBeInTheDocument();
  });

  it('shows a gallery of images if available', async () => {
    renderWithRouter();
    expect(await screen.findByRole('main')).toBeInTheDocument();
    expect(screen.getAllByRole('img').length).toBeGreaterThan(1);
  });

  it('has social sharing buttons', async () => {
    renderWithRouter();
    await screen.findByRole('main');
    expect(screen.getByLabelText(/share on twitter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/share on facebook/i)).toBeInTheDocument();
  });

  it('shows a modern header and footer', async () => {
    renderWithRouter();
    await screen.findByRole('main');
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
}); 