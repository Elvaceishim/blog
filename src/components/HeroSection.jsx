import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => (
  <section className="text-center py-16 px-4 bg-gradient-to-r from-amber-100 via-white to-rose-100 rounded-2xl shadow mb-8">
    <h1 className="text-5xl font-extrabold mb-4">Explore the World with Us</h1>
    <p className="text-xl mb-6 text-gray-700">Inspiring travel guides, tips, and stories from every continent. Start your next adventure today!</p>
    <Link to="/search" className="inline-block bg-rose-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-rose-600 transition" role="button">Get Started</Link>
  </section>
);

export default HeroSection; 