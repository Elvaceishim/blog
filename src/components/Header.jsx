import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
    <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
            <h1 className="font-bold text-2xl">
                <Link to="/">Travel Blog App</Link>
            </h1>
        </div>
    </header>
);


export default Header;