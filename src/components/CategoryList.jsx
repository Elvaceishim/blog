import React from 'react';
import { Link } from 'react-router-dom';
import categories from '../data/categories';

const CategoryList = () => (
  <div data-testid="category-nav" aria-label="Category navigation" className="flex flex-wrap justify-center gap-2 my-8">
    {categories.map(category => (
      <Link
        key={category.slug}
        to={`/category/${category.slug}`}
        className="btn btn-outline btn-primary btn-sm rounded-full capitalize"
        role="link"
      >
        {category.name}
      </Link>
    ))}
  </div>
);

export default CategoryList; 