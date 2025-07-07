import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthorCard from '../components/AuthorCard';
import SocialShare from '../components/SocialShare';

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
      if (!error) setPost(data);
    }
    fetchPost();
  }, [id]);

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main role="main" className="flex justify-center py-10 px-2 min-h-[70vh] bg-base-200">
        <div className="card bg-base-100 shadow-xl max-w-2xl w-full p-0 border border-primary/10">
          <div className="card-body p-8">
            <h1 className="card-title text-3xl md:text-4xl text-primary mb-4" role="heading" aria-level="1">{post.title}</h1>
            <AuthorCard author={post.author} date={post.date} />
            <figure className="mb-6 rounded-lg overflow-hidden bg-primary/10">
              <img src={post.image} alt={post.title} className="w-full max-h-60 object-cover mx-auto shadow" style={{ maxWidth: 480 }} />
            </figure>
            <p className="text-gray-700 text-lg mb-6">{post.content}</p>
            {post.gallery && post.gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-8">
                {post.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`Gallery Image ${i + 1}`} className="rounded-lg shadow object-cover w-full h-36 mx-auto" style={{ maxWidth: 220 }} />
                ))}
              </div>
            )}
            <SocialShare post={post} />
            <div className="card-actions justify-end mt-6">
              <Link to="/" className="btn btn-primary btn-outline">Back to Home</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostPage;
