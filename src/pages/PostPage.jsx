import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import remarkGfm from 'remark-gfm';
import PostCard from '../components/PostCard';
import Breadcrumbs from '../components/Breadcrumbs';
import SocialShare from '../components/SocialShare';
import NewsletterSignup from '../components/NewsletterSignup';

function splitLongParagraphs(markdown) {
  // Split paragraphs longer than 3 sentences into multiple paragraphs
  return markdown.replace(/([^\n]+(\.|\!|\?))(?= [A-Z])/g, (match) => {
    // Count sentences
    const sentences = match.split(/(?<=[.!?])\s+/);
    if (sentences.length > 3) {
      return sentences.map(s => s.trim()).filter(Boolean).join('\n\n');
    }
    return match;
  });
}

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching post:', error);
          setError('Post not found');
        } else {
          setPost(data);
          // Fetch related posts
          let relatedQuery = supabase
            .from('posts')
            .select('*')
            .neq('id', id)
            .order('created_at', { ascending: false })
            .limit(3);
          if (data.category) {
            relatedQuery = relatedQuery.eq('category', data.category);
          }
          const { data: related, error: relatedError } = await relatedQuery;
          if (!relatedError && Array.isArray(related)) {
            setRelatedPosts(related);
          } else {
            setRelatedPosts([]);
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The post you are looking for does not exist.'}</p>
          <Link to="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const title = post.title && post.title.trim().length > 0 ? post.title : 'Travel Article';
  const meta = post.meta_description || post.excerpt || 'Read this world-class travel article on AceVoyager.';

  return (
    <main role="main" className="flex justify-center py-10 px-2 min-h-[70vh] bg-base-200 dark:bg-gray-900 dark:text-white">
      <Helmet>
        <title>{title} | AceVoyager</title>
        <meta name="description" content={meta} />
      </Helmet>
      <div className="card bg-base-100 dark:bg-gray-800 shadow-xl max-w-4xl w-full p-0 border border-primary/10 flex flex-col md:flex-row">
        <div className="card-body p-8 w-full md:w-3/4">
          <Breadcrumbs items={[
            { label: 'Home', to: '/' },
            ...(post.category ? [{ label: post.category, to: `/category/${post.category}` }] : []),
            { label: title }
          ]} />
          <h1 className="card-title text-3xl md:text-4xl text-primary mb-4 font-display dark:text-rose-400" role="heading" aria-level="1">{title}</h1>
          {/* Meta information */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 dark:text-gray-300">
            <span>Category: {post.category}</span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          {/* Featured image */}
          {post.image && (
            <figure className="mb-6 rounded-lg overflow-hidden bg-primary/10">
              <img
                src={post.image}
                alt={title}
                className="w-full max-h-96 object-cover mx-auto shadow"
              />
              {post.image_attribution && (
                <figcaption className="text-xs text-gray-500 mt-2">
                  <ReactMarkdown
                    children={post.image_attribution}
                    components={{
                      a: ({node, ...props}) => (
                        <a
                          className="text-blue-500 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                    }}
                  />
                </figcaption>
              )}
            </figure>
          )}
          {/* Meta description */}
          {post.meta_description && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <p className="text-gray-700 italic dark:text-white">{post.meta_description}</p>
            </div>
          )}
          {/* Content */}
          <div className="prose prose-lg max-w-none prose-a:text-rose-600 prose-a:underline dark:prose-invert dark:text-white">
            <ReactMarkdown
              children={post.content}
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="mt-8 mb-4 text-3xl font-bold text-primary" {...props} />,
                h2: ({node, ...props}) => <h2 className="mt-6 mb-3 text-2xl font-semibold text-primary" {...props} />,
                p: ({node, ...props}) => <p className="mb-4" {...props} />,
                a: ({node, ...props}) => (
                  <a
                    className="text-blue-600 underline font-medium hover:text-blue-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
              }}
            />
          </div>
          <SocialShare post={post} />
          <NewsletterSignup />
          <div className="card-actions justify-end mt-6">
            <Link to="/" className="btn btn-primary btn-outline">Back to Home</Link>
          </div>
        </div>
        {/* Related Posts Sidebar (desktop) or below (mobile) */}
        <aside className="w-full md:w-1/4 border-t md:border-t-0 md:border-l border-primary/10 p-6 bg-base-50 dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4 font-display text-primary dark:text-rose-400">Related Posts</h2>
          {relatedPosts.length === 0 ? (
            <p className="text-gray-500 text-sm dark:text-gray-300">No related posts found.</p>
          ) : (
            <div className="space-y-6">
              {relatedPosts.map(rp => <PostCard key={rp.id} post={rp} />)}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
};

export default PostPage;
