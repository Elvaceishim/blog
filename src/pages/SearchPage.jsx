import React, { useState, useEffect } from 'react';
import supabase from 'src/lib/supabaseClient';
import PostCard from 'src/components/PostCard';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handler = setTimeout(async () => {
      // Search Supabase posts table
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      setLoading(false);
      setSearched(true);
      if (error) {
        setResults([]);
      } else {
        setResults(data || []);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div className="flex justify-center py-10 px-2 min-h-[70vh] bg-base-200 dark:bg-gray-900 dark:text-white">
      <div className="card max-w-2xl w-full bg-base-100 dark:bg-gray-800 shadow-xl p-0 border border-primary/10">
        <div className="card-body p-8 text-center">
          <h1 className="card-title text-3xl text-primary mb-6 dark:text-rose-400">Search</h1>
          <input
            type="text"
            placeholder="Search for destinations, tips, or stories..."
            className="input input-bordered w-full text-lg mb-6 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="space-y-4 min-h-[48px]">
            {loading && (
              <div className="flex justify-center items-center py-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            )}
            {!loading && searched && results.length === 0 && (
              <div className="text-gray-500 py-8 dark:text-gray-300">No results found.</div>
            )}
            {!loading && results.length > 0 && (
              <div className="grid gap-6">
                {results.map(post => <PostCard key={post.id} post={post} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 