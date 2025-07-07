// src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import supabase from 'src/lib/supabaseClient';
import { Link } from 'react-router-dom';
import HeroSection from 'src/components/HeroSection';
import CategoryList from 'src/components/CategoryList';
import NewsletterSignup from 'src/components/NewsletterSignup';
import PostCard from 'src/components/PostCard';
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import SEO from 'src/components/SEO';
import AuthorCard from 'src/components/AuthorCard';

const HomePage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching posts:', error);
            } else {
                setPosts(data);
            }
        }

        fetchPosts();
    }, []);

    return (
      <div>
        <h1 className="sr-only">AceVoyager</h1>
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
          <SEO title="AceVoyager - Inspiring Travel Guides" description="Explore the world with our travel guides, tips, and stories from every continent." />
          <section className="text-center py-16 px-4 bg-gradient-to-r from-amber-100 via-white to-rose-100 rounded-2xl shadow mb-8">
            <h1 className="text-5xl font-extrabold mb-4">Travel Smart. Explore the World.</h1>
            <p className="text-xl mb-6 text-gray-700">Inspiring travel guides, tips, and stories from every continent. Start your next adventure today!</p>
            <a href="/search" className="inline-block bg-rose-500 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-rose-600 transition" role="button">Read Blog</a>
          </section>
          <h2 className="text-2xl font-bold mb-8 text-center">What are you interested in?</h2>
          <CategoryList />
          <h2 className="text-3xl font-bold mb-6 text-left text-primary">Latest Posts</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            {(posts.length === 0
              ? [
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
                ]
              : posts
            ).map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <section className="bg-white rounded-2xl shadow p-8 max-w-2xl mx-auto mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">About the Author</h2>
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center mb-4">
              <AuthorCard author={{
                name: 'Alex Voyager',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                bio: 'Travel writer, photographer, and explorer. Sharing stories and tips from every continent.'
              }} />
              <div className="text-left max-w-md">
                <p className="mb-2">Hi, I'm Alex! I've spent the last decade traveling the world on a budget, discovering hidden gems and unforgettable experiences. My mission is to help you see more, spend less, and travel deeper.</p>
                <a href="/about" className="btn btn-primary btn-sm mt-2" role="link">Learn More</a>
              </div>
            </div>
          </section>
          <NewsletterSignup />
        </div>
        <Footer />
      </div>
    );
};

export default HomePage;
