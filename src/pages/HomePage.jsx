// src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            console.log('Fetched data:', data);
            console.log('Error:', error);

            if (error) {
                console.error('Error fetching posts:', error);
            } else {
                setPosts(data);
            }
        }

        fetchPosts();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">
                    Elvis' Travel Tales ✈️
                </h1>
                <p className="text-gray-600 text-lg">
                    Inspiring stories and guides from around the world
                </p>
            </div>

            <h2 className="text-3xl font-bold mb-6 text-left">Latest Posts</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map(post => (
                    <Link to={`/post/${post.id}`} key={post.id}>
                        <div className="rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 bg-white">
                            <div className="w-full h-[220px] overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2 text-blue-800">{post.title}</h3>
                                <p className="text-gray-600 text-sm">{post.excerpt}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
