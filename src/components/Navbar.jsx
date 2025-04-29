// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between">
      <div className="text-lg font-bold"></div>
      <div className="space-x-4">
        <Link to="/" className="hover:underline"></Link>
        <Link to="/view" className="hover:underline"></Link>
      </div>
    </nav>
  );
};

export default Navbar;
