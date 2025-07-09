import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import { Helmet } from 'react-helmet-async';
import PostCard from '../components/PostCard';
import categories from '../data/categories';

const placeholderPosts = [
  {
    id: 1,
    title: 'Stockholm on a Budget',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    excerpt: "Sweden's capital is full of affordable adventures. Here's how to enjoy it for less.",
  },
  {
    id: 2,
    title: 'Japan Cherry Blossom Guide',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    excerpt: 'Experience the magic of sakura season with our top tips for cherry blossom viewing.',
  },
  {
    id: 3,
    title: 'Peru: Machu Picchu Adventure',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    excerpt: 'A guide to hiking and exploring the wonders of Machu Picchu.',
  },
];

const CategoryPage = () => {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = categories.find(cat => cat.slug === slug);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', slug)
        .order('created_at', { ascending: false });
      if (error) {
        setError('Error fetching posts');
        setPosts([]);
      } else {
        setPosts(data);
      }
      setLoading(false);
    }
    fetchPosts();
  }, [slug]);

  let content;
  if (loading) {
    content = <div className="text-center py-8">Loading...</div>;
  } else if (error) {
    content = <div className="text-center text-red-600 py-8">{error}</div>;
  } else if (posts.length === 0) {
    content = (
      <div>
        <div className="text-center text-gray-500 py-8">No posts in this category yet. Here are some featured posts:</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {placeholderPosts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    );
  }

  return (
    <div className="flex justify-center py-10 px-2 min-h-[70vh] bg-base-200">
      <Helmet>
        <title>{category ? `${category.name} - AceVoyager` : 'Category Not Found - AceVoyager'}</title>
      </Helmet>
      <div className="card max-w-4xl w-full bg-base-100 shadow-xl p-0 border border-primary/10">
        <div className="card-body p-8">
          <h1 className="card-title text-3xl text-primary mb-6">
            Category: <span className="text-primary-focus">{category ? category.name : slug}</span>
          </h1>
          {content}
          <div className="mt-8 text-center">
            <Link to="/" className="btn btn-primary btn-outline">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage; 