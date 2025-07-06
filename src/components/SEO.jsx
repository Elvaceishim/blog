import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title = 'AceVoyager', description = 'Inspiring travel guides, tips, and stories from every continent.' }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    {/* Add more meta tags for social sharing as needed */}
  </Helmet>
);

export default SEO; 