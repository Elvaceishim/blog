import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import ReactMarkdown from 'react-markdown';

const PostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        async function fetchPost() {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching post:', error);
            } else {
                setPost(data);
            }
        }

        fetchPost();
    }, [id]);

    if (!post) return <p>Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* ✨ IMAGE OUTSIDE THE .prose DIV */}
            <div className="w-full overflow-hidden rounded-lg mb-6">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full max-h-[400px] object-cover"
                />
            </div>

            {/* ✨ CONTENT inside .prose */}
            <div className="prose prose-lg">
                <h1>{post.title}</h1>
                <p className="text-sm text-gray-500">
                    By {post.author || "Elvis"} · {new Date(post.created_at).toLocaleDateString()}
                </p>
                <ReactMarkdown>{post.content}</ReactMarkdown>

                <a href="/" className="block mt-8 text-blue-600 hover:underline">
                    ← Back to homepage
                </a>
            </div>
        </div>
    );
};

export default PostPage;
