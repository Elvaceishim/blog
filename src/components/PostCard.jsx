import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  // Use meta_description as excerpt if excerpt is not available
  const excerpt = post.excerpt || post.meta_description || 'No description available';
  // No fallback for title; backend guarantees a valid title
  return (
    <div data-testid="post-card" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-primary/10 group-hover:scale-105 transform">
      <figure className="bg-primary/10 h-48 flex items-center justify-center overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
      </figure>
      <div className="card-body p-5">
        <h3 className="card-title text-primary group-hover:text-primary-focus">{post.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{excerpt}</p>
        {post.category && (
          <div className="badge badge-primary badge-outline text-xs">{post.category}</div>
        )}
        <div className="card-actions justify-end mt-4">
          <Link to={`/post/${post.id}`} className="btn btn-sm btn-primary btn-outline" role="link">Read More</Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
