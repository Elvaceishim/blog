// src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import supabase from 'src/lib/supabaseClient';
import { Link } from 'react-router-dom';
import HeroSection from 'src/components/HeroSection';
import CategoryList from 'src/components/CategoryList';
import NewsletterSignup from 'src/components/NewsletterSignup';
import PostCard from 'src/components/PostCard';
import { Helmet } from 'react-helmet-async';
import AuthorCard from 'src/components/AuthorCard';

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

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error && Array.isArray(data) && data.length > 0) {
                setPosts(data);
            } else {
                setPosts([]); // fallback to placeholders if no real posts
            }
            setLoading(false);
        }
        fetchPosts();
    }, []);

    let content = null;
    let featured = null;
    let gridPosts = [];
    if (loading) {
      content = null; // Show nothing while loading
    } else if (Array.isArray(posts) && posts.length > 0) {
      featured = <PostCard post={posts[0]} featured />;
      gridPosts = posts.slice(1);
      content = gridPosts.map(post => <PostCard key={post.id} post={post} />);
    } else {
      featured = <PostCard post={placeholderPosts[0]} featured />;
      gridPosts = placeholderPosts.slice(1);
      content = gridPosts.map(post => <PostCard key={post.id} post={post} />);
    }

    return (
      <div>
        <h1 className="sr-only">AceVoyager</h1>
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 dark:bg-gray-900 dark:text-white">
          <Helmet>
            <title>AceVoyager - Inspiring Travel Guides</title>
            <meta name="description" content="Explore the world with our travel guides, tips, and stories from every continent." />
          </Helmet>
          <section className="text-center py-16 px-4 bg-gradient-to-r from-amber-100 via-white to-rose-100 rounded-2xl shadow mb-8 dark:bg-gray-800 flex items-center justify-center">
            <div className="inline-block px-6 py-4 rounded-xl bg-white/60 dark:bg-black/40 backdrop-blur-sm shadow-md">
              <h1 className="text-5xl font-extrabold mb-4 font-display text-gray-900 dark:text-white">Travel Smart. Explore the World.</h1>
              <p className="text-xl font-semibold mb-6 font-sans text-gray-800 dark:text-gray-100">Inspiring travel guides, tips, and stories from every continent. Start your next adventure today!</p>
              <a href="/search" className="inline-block bg-rose-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-rose-600 transition mt-2" role="button">Read Blog</a>
            </div>
          </section>
          <h2 className="text-2xl font-bold mb-8 text-center dark:text-white">What are you interested in?</h2>
          <CategoryList />
          <h2 className="text-3xl font-bold mb-6 text-left text-primary dark:text-rose-400">Latest Posts</h2>
          {/* Featured post */}
          <div className="mb-10">
            {featured}
          </div>
          {/* Masonry grid for post previews */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 mb-16 [column-fill:_balance]"><div className="[&>*]:mb-6">
            {content}
          </div></div>
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 max-w-2xl mx-auto mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-rose-400">About the Author</h2>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center mb-4">
              <AuthorCard author={{
                name: 'Elvis Anselm',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=elvis',
                bio: "Hi, I'm Elvis! I've spent the last decade traveling the world on a budget, discovering hidden gems and unforgettable experiences. My mission is to help you see more, spend less, and travel deeper."
              }} />
              <div className="text-left max-w-md">
                <p className="mb-2 dark:text-white">Hi, I'm Elvis! I've spent the last decade traveling the world on a budget, discovering hidden gems and unforgettable experiences. My mission is to help you see more, spend less, and travel deeper.</p>
                <a href="/about" className="btn btn-primary btn-sm mt-2" role="link">Learn More</a>
              </div>
            </div>
          </section>
          <NewsletterSignup />
        </div>
      </div>
    );
};

export default HomePage;
