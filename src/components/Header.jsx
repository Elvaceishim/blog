import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
  { name: 'Search', to: '/search' },
];

const Header = () => {
  const location = useLocation();
  return (
    <div className="navbar bg-base-100 shadow sticky top-0 z-30">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-2xl font-extrabold text-primary">
          <span className="inline-block w-8 h-8 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full mr-2"></span>
          AceVoyager
        </Link>
      </div>
      <div className="navbar-end">
        <ul className="menu menu-horizontal px-1 gap-2">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={
                  location.pathname === link.to
                    ? 'active font-bold text-primary'
                    : 'font-semibold'
                }
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Header;