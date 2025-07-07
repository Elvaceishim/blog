import React from 'react';

const AuthorCard = ({ author, date }) => (
  <div className="flex items-center gap-4 mb-6">
    <img src={author.avatar} alt={author.name} className="w-12 h-12 rounded-full border-2 border-primary shadow" />
    <div>
      <div className="font-semibold text-primary">{author.name}</div>
      <div className="text-xs text-gray-500">{author.bio}</div>
      {date && <div className="text-xs text-gray-400 mt-1">{new Date(date).toLocaleDateString()}</div>}
    </div>
  </div>
);

export default AuthorCard; 