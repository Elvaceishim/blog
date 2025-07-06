import React from 'react';

const images = [
  { src: 'https://placehold.co/200x140', alt: 'Gallery Image 1' },
  { src: 'https://placehold.co/200x140', alt: 'Gallery Image 2' },
  { src: 'https://placehold.co/200x140', alt: 'Gallery Image 3' },
  { src: 'https://placehold.co/200x140', alt: 'Gallery Image 4' },
];

const Gallery = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-8">
    {images.map((img, idx) => (
      <img
        key={idx}
        src={img.src}
        alt={img.alt}
        className="rounded-lg shadow object-cover w-full h-36 mx-auto"
        style={{ maxWidth: 220 }}
      />
    ))}
  </div>
);

export default Gallery; 