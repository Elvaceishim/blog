import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        image: '',
    });
    const [editingPostId, setEditingPostId] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [postsLoading, setPostsLoading] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');

    // Toast message that disappears after 3 seconds
    function showToast(message) {
        setToast(message);
        setTimeout(() => setToast(''), 3000);
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        setPostsLoading(true);
        const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        setPostsLoading(false);

        if (error) {
            setError('Error loading posts');
            console.error(error);
        } else {
            setPosts(data);
        }
    }

    function handleEdit(post) {
        setForm({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            image: post.image,
        });
        setEditingPostId(post.id);
    }

    async function handleDelete(id) {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) {
            setError('Error deleting post');
            console.error(error);
            showToast('❌ Error deleting post');
        } else {
            showToast('🗑️ Post deleted');
            fetchPosts();
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (!form.title || !form.content) {
            setError('Title and Content are required');
            return;
        }

        setFormLoading(true);

        if (editingPostId) {
            const { data, error } = await supabase
                .from('posts')
                .update({
                    title: form.title,
                    excerpt: form.excerpt,
                    content: form.content,
                    image: form.image,
                })
                .eq('id', editingPostId)
                .select();

            if (error) {
                setError('Error updating post');
                console.error(error);
                showToast('❌ Error updating post');
            } else {
                showToast('✅ Post updated');
                setEditingPostId(null);
                setForm({ title: '', excerpt: '', content: '', image: '' });
                fetchPosts();
            }
        } else {
            const { data, error } = await supabase
                .from('posts')
                .insert([
                    {
                        title: form.title,
                        excerpt: form.excerpt,
                        content: form.content,
                        image: form.image,
                    },
                ])
                .select();

            if (error) {
                setError('Error creating post');
                console.error(error);
                showToast('❌ Error creating post');
            } else {
                showToast('✅ Post created');
                setForm({ title: '', excerpt: '', content: '', image: '' });
                fetchPosts();
            }
        }

        setFormLoading(false);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                {/* ✅ Toast Message */}
                {toast && (
                    <div
                        className={`mb-4 px-4 py-2 border rounded ${
                            toast.startsWith('✅') || toast.startsWith('🗑️')
                                ? 'bg-green-100 border-green-300 text-green-800'
                                : 'bg-red-100 border-red-300 text-red-800'
                        }`}
                    >
                        {toast}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                    {error && <p className="text-red-600">{error}</p>}

                    <input
                        type="text"
                        placeholder="Title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full p-2 border rounded"
                    />

                    <input
                        type="text"
                        placeholder="Excerpt"
                        value={form.excerpt}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        className="w-full p-2 border rounded"
                    />

                    <input
                        type="text"
                        placeholder="Image URL"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        className="w-full p-2 border rounded"
                    />

                    {/* ✅ Live Image Preview */}
                    {form.image && (
                        <img
                            src={form.image}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded"
                        />
                    )}

                    <textarea
                        placeholder="Content (Markdown supported)"
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        rows={6}
                        className="w-full p-2 border rounded"
                    />

                    <button
                        type="submit"
                        disabled={formLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {formLoading
                            ? 'Saving...'
                            : editingPostId
                                ? 'Update Post'
                                : 'Add Post'}
                    </button>
                </form>

                <h2 className="text-2xl font-semibold mb-4">Existing Posts</h2>
                {postsLoading ? (
                    <p>Loading posts...</p>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="border p-4 rounded mb-6 shadow-sm bg-white transition hover:shadow-md"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="font-bold text-lg">{post.title}</h3>
                                    <p className="text-sm text-gray-600">{post.excerpt}</p>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 sm:mt-0">
                                    {new Date(post.created_at).toLocaleString()}
                                </p>
                            </div>

                            {post.image && (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-48 object-cover rounded mt-3"
                                />
                            )}

                            <div className="mt-4 flex flex-wrap gap-4">
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="text-blue-600 hover:underline"
                                >
                                    ✏️ Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    🗑️ Delete
                                </button>

                                {editingPostId === post.id && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingPostId(null);
                                            setForm({
                                                title: '',
                                                excerpt: '',
                                                content: '',
                                                image: '',
                                            });
                                        }}
                                        className="text-gray-600 hover:underline"
                                    >
                                        ❌ Cancel Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
