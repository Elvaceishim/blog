import React from 'react';
import {Routes, Route, Router} from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import Dashboard from './pages/Dashboard';

function App() {
    return (
            <div classroom="flex flex-col min-h-screen foot sans">
                <Header />
                <main className="flex-grow px-4 py-8 max-w-4xl mx-auto">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/post/:id" element={<PostPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </main>
                <Footer />
            </div>
    );
};


export default App;