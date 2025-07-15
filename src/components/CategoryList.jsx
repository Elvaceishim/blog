import React from 'react';
import { Link } from 'react-router-dom';
import categories from '../data/categories';

const categoryIcons = {
  'Africa': '🦁',
  'Asia': '🏯',
  'Europe': '🏰',
  'North America': '🏞️',
  'Oceania': '🏝️',
  'South America': '🦜',
};

const CategoryList = () => (
  <div data-testid="category-nav" aria-label="Category navigation" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8 max-w-3xl mx-auto">
    {categories.map(category => (
      <Link
        key={category.slug}
        to={`/category/${category.slug}`}
        className={
          `group block rounded-xl p-6 bg-white dark:bg-gray-800 border border-primary/10 shadow-md ` +
          'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary focus-visible:ring-2 focus-visible:ring-primary outline-none'
        }
        role="link"
        tabIndex={0}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl opacity-80 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3 group-focus-visible:scale-110 group-focus-visible:-rotate-3 dark:text-white" aria-hidden="true">{categoryIcons[category.name]}</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-primary capitalize">{category.name}</span>
        </div>
      </Link>
    ))}
  </div>
);

export default CategoryList; 