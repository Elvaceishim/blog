import HomePage from 'src/pages/HomePage';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockPosts = [
  {
    id: '1',
    title: 'Best 33 Free Things to Do in Stockholm',
    excerpt: 'Explore Stockholm on a budget with these free activities...',
    image: 'https://placehold.co/400x250',
  },
  {
    id: '2',
    title: '13 Things to Do in Japan on a Budget',
    excerpt: 'Discover affordable adventures across Japan...',
    image: 'https://placehold.co/400x250',
  },
];

jest.mock('src/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: mockPosts, error: null })
      })
    })
  }
}));

describe('HomePage (Design)', () => {
  const renderHome = () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  };

  it('renders a large, welcoming hero section with blog name, tagline, and CTA', () => {
    renderHome();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /acevoyager/i })).toBeInTheDocument();
    expect(screen.getByText(/travel smart|explore the world/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /read blog/i })).toBeInTheDocument();
  });

  it('shows a "What are you interested in?" section with clickable category cards', () => {
    renderHome();
    expect(screen.getByText(/what are you interested in/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link').length).toBeGreaterThan(1);
  });

  it('shows a grid of latest posts with image, title, and excerpt', () => {
    renderHome();
    expect(screen.getByText(/latest posts/i)).toBeInTheDocument();
    expect(screen.getAllByRole('img').length).toBeGreaterThan(0);
    expect(screen.getByText(/stockholm/i)).toBeInTheDocument();
    expect(screen.getByText(/japan/i)).toBeInTheDocument();
  });

  it('shows an About Me section with author photo, intro, and Learn More link', () => {
    renderHome();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /author/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument();
  });

  it('shows a prominent newsletter signup box', () => {
    renderHome();
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('shows a modern header and footer with social icons', () => {
    renderHome();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/facebook|twitter|instagram/i).length).toBeGreaterThan(0);
  });
}); 