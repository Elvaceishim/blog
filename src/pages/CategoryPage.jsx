import React from 'react';

const CategoryPage = () => (
  <div className="flex justify-center py-10 px-2 min-h-[70vh] bg-base-200">
    <div className="card max-w-4xl w-full bg-base-100 shadow-xl p-0 border border-primary/10">
      <div className="card-body p-8">
        <h1 className="card-title text-3xl text-primary mb-6">Category: <span className="text-primary-focus">[Category Name]</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Placeholder for posts in this category */}
          <div className="bg-primary/10 rounded-lg shadow p-4">Post 1</div>
          <div className="bg-primary/10 rounded-lg shadow p-4">Post 2</div>
          <div className="bg-primary/10 rounded-lg shadow p-4">Post 3</div>
        </div>
      </div>
    </div>
  </div>
);

export default CategoryPage; 