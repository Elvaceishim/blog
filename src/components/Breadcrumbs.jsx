import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => (
  <nav className="text-sm mb-6" aria-label="Breadcrumb">
    <ol className="list-none p-0 inline-flex text-gray-500">
      {items.map((item, idx) => (
        <li key={item.to || item.label} className="flex items-center">
          {item.to ? (
            <Link to={item.to} className="hover:underline text-primary font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-semibold">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="mx-2">/</span>}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs; 