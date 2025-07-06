import React from 'react';
import Gallery from '../components/Gallery';
import SEO from '../components/SEO';

const PostPage = () => {
  return (
    <>
      <SEO title="Sample Post - AceVoyager" description="A sample travel story from AceVoyager." />
      <div className="flex justify-center py-10 px-2 min-h-[70vh] bg-base-200">
        <div className="card bg-base-100 shadow-xl max-w-2xl w-full p-0 border border-primary/10">
          <div className="card-body p-8">
            <h1 className="card-title text-3xl md:text-4xl text-primary mb-4">Sample Post Title</h1>
            <figure className="mb-6 rounded-lg overflow-hidden bg-primary/10">
              <img
                src="https://placehold.co/320x180"
                alt="Post Main"
                className="w-full max-h-60 object-cover mx-auto shadow"
                style={{ maxWidth: 480 }}
              />
            </figure>
            <p className="text-gray-700 text-lg mb-6">This is a sample post content. Replace with actual post data.</p>
            <Gallery />
            <div className="card-actions justify-end mt-6">
              <a href="/" className="btn btn-primary btn-outline">Back to Home</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
