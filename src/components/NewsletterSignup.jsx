import React from 'react';

const NewsletterSignup = () => (
  <section data-testid="newsletter-signup" className="bg-rose-50 rounded-2xl shadow p-8 max-w-xl mx-auto mt-16 text-center">
    <h2 className="text-2xl font-bold mb-2">Join Our Travel Community</h2>
    <p className="mb-4 text-gray-600">Get the latest travel tips, guides, and stories straight to your inbox.</p>
    <form role="form" className="flex flex-col sm:flex-row gap-2 justify-center items-center w-full">
      <input
        type="email"
        placeholder="Your email address"
        className="flex-1 min-w-0 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-200 mx-auto"
        style={{ maxWidth: 320 }}
        required
      />
      <button type="submit" className="w-auto px-6 py-2 rounded-full bg-rose-500 text-white font-semibold hover:bg-rose-600 transition whitespace-nowrap mx-auto">
        Subscribe
      </button>
    </form>
  </section>
);

export default NewsletterSignup; 