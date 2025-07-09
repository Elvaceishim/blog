import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function App() {
    return (
        <HelmetProvider>
            <Helmet>
                <title>Test Helmet</title>
            </Helmet>
            <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-amber-50 via-white to-rose-50 text-gray-800">
                <Header />
                <main className="flex-grow flex flex-col">
                  <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/post/:id" element={<PostPage />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/category/:slug" element={<CategoryPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
            </div>
        </HelmetProvider>
    );
};

export default App;