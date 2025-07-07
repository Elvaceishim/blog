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

jest.mock('../lib/supabaseClient', () => ({
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
  beforeAll(() => {
    jest.resetModules();
  });

  const renderHome = () => {
    const HomePage = require('../pages/HomePage').default;
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
    expect(screen.getByText(/travel smart|discover|tricks|tips|budget/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /read blog|get started|explore/i })).toBeInTheDocument();
  });

  it('shows a "What are you interested in?" section with clickable category cards', () => {
    renderHome();
    expect(screen.getByText(/what are you interested in/i)).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /city guides|backpacking|cheap eats|travel hacks|nightlife|road stories/i }).length).toBeGreaterThanOrEqual(3);
  });

  it('shows a grid of latest posts with image, title, and excerpt', () => {
    renderHome();
    expect(screen.getByText(/latest posts/i)).toBeInTheDocument();
    const postCards = screen.getAllByTestId('post-card');
    expect(postCards.length).toBeGreaterThanOrEqual(1);
    postCards.forEach(card => {
      expect(card.querySelector('img')).toBeInTheDocument();
      expect(card.querySelector('h2')).toBeInTheDocument();
      expect(card.textContent.length).toBeGreaterThan(20); // Excerpt
    });
  });

  it('shows an About Me section with author photo, intro, and Learn More link', () => {
    renderHome();
    expect(screen.getByText(/about me/i)).toBeInTheDocument();
    expect(screen.getByAltText(/author|avatar|profile/i)).toBeInTheDocument();
    expect(screen.getByText(/learn more/i)).toBeInTheDocument();
  });

  it('shows a prominent newsletter signup box', () => {
    renderHome();
    expect(screen.getByRole('form', { name: /subscribe/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('shows a modern header and footer with social icons', () => {
    renderHome();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/facebook|instagram|twitter|social/i).length).toBeGreaterThanOrEqual(1);
  });
}); 