const getSeo = (page) => {
  switch (page) {
    case 'home':
      return {
        title: 'AceVoyager - Inspiring Travel Guides',
        description: 'Explore the world with our travel guides, tips, and stories from every continent.'
      };
    case 'about':
      return {
        title: 'About Us - AceVoyager',
        description: 'Meet the travelers behind AceVoyager and learn about our mission.'
      };
    default:
      return {
        title: 'AceVoyager',
        description: 'Inspiring travel guides, tips, and stories from every continent.'
      };
  }
};

export default getSeo; 