import React from 'react';

const SearchPage = () => (
  <div className="flex justify-center py-10 px-2 min-h-[70vh] bg-base-200">
    <div className="card max-w-2xl w-full bg-base-100 shadow-xl p-0 border border-primary/10">
      <div className="card-body p-8 text-center">
        <h1 className="card-title text-3xl text-primary mb-6">Search</h1>
        <input
          type="text"
          placeholder="Search for destinations, tips, or stories..."
          className="input input-bordered w-full mb-6 text-lg"
        />
        <div className="space-y-4">
          {/* Placeholder for search results */}
          <div className="bg-primary/10 rounded-lg shadow p-4 text-left">Result 1</div>
          <div className="bg-primary/10 rounded-lg shadow p-4 text-left">Result 2</div>
        </div>
      </div>
    </div>
  </div>
);

export default SearchPage; 