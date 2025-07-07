import React from 'react';

const continents = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'];

const CategoryList = () => (
  <div data-testid="category-nav" aria-label="Category navigation" className="flex flex-wrap justify-center gap-2 my-8">
    {continents.map(continent => (
      <button key={continent} className="btn btn-outline btn-primary btn-sm rounded-full capitalize">
        {continent}
      </button>
    ))}
  </div>
);

export default CategoryList; 