import React from 'react';
import { FaTwitter, FaFacebook } from 'react-icons/fa';

const SocialShare = ({ post }) => {
  const url = typeof window !== 'undefined' && window.location.href
    ? window.location.href
    : `https://yourdomain.com/post/${post.id}`;
  const text = encodeURIComponent(post.title);
  return (
    <div className="flex gap-4 my-6">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="btn btn-sm btn-outline btn-info flex items-center gap-2"
      >
        <FaTwitter /> Twitter
      </a>
      <a
        href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="btn btn-sm btn-outline btn-primary flex items-center gap-2"
      >
        <FaFacebook /> Facebook
      </a>
    </div>
  );
};

export default SocialShare; 