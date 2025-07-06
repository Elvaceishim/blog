// src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CategoryList from '../components/CategoryList';
import NewsletterSignup from '../components/NewsletterSignup';
import SEO from '../components/SEO';

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
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
            <SEO title="AceVoyager - Inspiring Travel Guides" description="Explore the world with our travel guides, tips, and stories from every continent." />
            <HeroSection />
            {/* DaisyUI category buttons */}
            <div className="flex flex-wrap justify-center gap-2 my-8">
              {['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America'].map(category => (
                <button key={category} className="btn btn-outline btn-primary btn-sm rounded-full capitalize">
                  {category}
                </button>
              ))}
            </div>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary drop-shadow">AceVoyager</h1>
                <p className="text-gray-600 text-lg">Inspiring stories and guides from around the world</p>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-left text-primary">Latest Posts</h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
                {posts.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400">No posts yet.</div>
                ) : posts.map(post => (
                    <Link to={`/post/${post.id}`} key={post.id} className="group">
                        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-primary/10 group-hover:scale-105 transform">
                            <figure className="bg-primary/10 h-48 flex items-center justify-center overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            </figure>
                            <div className="card-body p-5">
                                <h3 className="card-title text-primary group-hover:text-primary-focus">{post.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                                <div className="card-actions justify-end mt-4">
                                  <button className="btn btn-sm btn-primary btn-outline">Read More</button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <NewsletterSignup />
        </div>
    );
};

export default HomePage;
