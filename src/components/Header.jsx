import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = () => (
  <header role="banner" className="bg-base-100 shadow sticky top-0 z-50">
    <nav role="navigation" className="navbar max-w-6xl mx-auto px-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="AceVoyager logo" className="h-10 w-10 object-contain" />
        <span className="text-2xl font-extrabold text-primary">AceVoyager</span>
      </Link>
      <ul className="flex gap-4 items-center">
        <li><Link to="/" className="btn btn-ghost btn-sm">Home</Link></li>
        <li><Link to="/about" className="btn btn-ghost btn-sm">About</Link></li>
        <li><Link to="/categories" className="btn btn-ghost btn-sm">Categories</Link></li>
        <li><Link to="/search" className="btn btn-ghost btn-sm">Search</Link></li>
      </ul>
    </nav>
  </header>
);

export default Header;