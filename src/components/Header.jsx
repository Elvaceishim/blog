import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    // On mount, sync with localStorage or system preference
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (stored === 'light') {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return (
    <button
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="ml-4 p-2 rounded-full hover:bg-base-200 transition"
      onClick={() => setIsDark(d => !d)}
      type="button"
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
      )}
    </button>
  );
}

const Header = () => {
  const location = useLocation();
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/categories', label: 'Categories' },
    { to: '/search', label: 'Search' },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header role="banner" className="bg-base-100 shadow sticky top-0 z-50">
      <nav role="navigation" className="navbar max-w-6xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AceVoyager logo" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-extrabold text-primary">AceVoyager</span>
        </Link>
        {/* Desktop nav */}
        <ul className="hidden md:flex gap-4 items-center">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`btn btn-ghost btn-sm${location.pathname === link.to ? ' text-primary font-bold underline' : ''}`}
                aria-current={location.pathname === link.to ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <DarkModeToggle />
        </div>
        {/* Hamburger menu button */}
        <button
          className="md:hidden ml-2 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Open menu"
          onClick={() => setMenuOpen(m => !m)}
        >
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-base-100 shadow-lg border-t border-primary/10 absolute left-0 right-0 top-full z-50 animate-fade-in">
          <ul className="flex flex-col gap-2 p-4">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`btn btn-ghost btn-sm w-full text-left${location.pathname === link.to ? ' text-primary font-bold underline' : ''}`}
                  aria-current={location.pathname === link.to ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <DarkModeToggle />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;