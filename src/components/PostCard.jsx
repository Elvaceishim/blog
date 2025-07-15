import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post, featured }) => {
  // Use meta_description as excerpt if excerpt is not available
  const excerpt = post.excerpt || post.meta_description || 'No description available';
  // No fallback for title; backend guarantees a valid title
  return (
    <div
      tabIndex={0}
      className={
        `bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-200 ` +
        `hover:scale-105 hover:shadow-2xl hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary ` +
        (featured ? 'border-2 border-rose-400 p-6 md:p-8 mb-6' : '')
      }
    >
      <img
        src={post.image}
        alt={post.title + ' cover image'}
        className={
          'w-full object-cover ' +
          (featured ? 'aspect-[16/7] max-h-96' : 'aspect-video')
        }
        loading="lazy"
      />
      <div className={featured ? 'pt-6 pb-2' : 'p-4'}>
        <h2 className={featured ? 'text-2xl font-extrabold mb-3 hover:underline font-display' : 'text-xl font-bold mb-2 hover:underline'}>{post.title}</h2>
        <p className={featured ? 'text-lg text-gray-700 mb-4' : 'text-gray-600 line-clamp-3'}>{excerpt}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-400">{post.date}</span>
          <Link to={`/post/${post.id}`} className="text-blue-600 hover:underline">Read more →</Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
