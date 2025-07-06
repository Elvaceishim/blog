import React from 'react';

const categories = [
  'Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'
];

const CategoryList = () => (
  <div className="flex flex-wrap justify-center gap-4 my-8">
    {categories.map(category => (
      <button
        key={category}
        className="px-5 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold shadow hover:bg-rose-200 transition"
      >
        {category}
      </button>
    ))}
  </div>
);

export default CategoryList; 