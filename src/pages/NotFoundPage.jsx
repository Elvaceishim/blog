import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex justify-center py-20 px-2 min-h-[70vh] bg-base-200">
    <div className="card max-w-xl w-full bg-base-100 shadow-xl p-0 border border-primary/10">
      <div className="card-body p-8 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl mb-6 text-gray-700">Oops! The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary btn-outline">Go back home</Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage; 