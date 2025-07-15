import React from 'react';
import { Link } from 'react-router-dom';
import CategoryList from '../components/CategoryList';

const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center py-20 px-2 min-h-[70vh] bg-base-200 dark:bg-gray-900 dark:text-white">
    <div className="w-full max-w-3xl mb-8">
      <CategoryList />
    </div>
    <Link to="/" className="btn btn-primary btn-outline">Go back home</Link>
  </div>
);

export default NotFoundPage; 