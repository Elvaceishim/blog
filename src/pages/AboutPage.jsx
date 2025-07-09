import React from 'react';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo.png';

const AboutPage = () => (
  <>
    <Helmet>
      <title>About Us - AceVoyager</title>
      <meta name="description" content="Meet the travelers behind AceVoyager and learn about our mission." />
    </Helmet>
    <div className="flex justify-center py-10 px-2 min-h-[70vh] bg-base-200">
      <div className="card max-w-2xl w-full bg-base-100 shadow-xl p-0 border border-primary/10">
        <div className="card-body p-8 text-center">
          <h1 className="card-title text-4xl text-primary mb-4">About Us</h1>
          <p className="text-lg mb-6 text-gray-700">We are passionate travelers sharing our adventures, tips, and guides to inspire your next journey. Our mission is to make travel accessible, fun, and memorable for everyone.</p>
          <div className="flex flex-col items-center gap-4 mb-4">
            <img src={logo} alt="AceVoyager logo" className="rounded-full w-24 h-24 object-cover border-4 border-primary/20 shadow" />
            <span className="font-semibold text-primary">AceVoyagers</span>
            <span className="text-sm text-gray-500">Travellers and storytellers</span>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default AboutPage; 