import React from 'react';
import { FaSpotify } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-black text-white px-12 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center space-x-2">
          <FaSpotify size={32} className="text-green-500" />
          <span className="text-xl font-bold">Spotify</span>
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/premium" className="hover:text-gray-300">Premium</Link>
          <Link to="/support" className="hover:text-gray-300">Support</Link>
          <Link to="/download" className="hover:text-gray-300">Download</Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="px-4 py-1 bg-white text-black rounded-full font-medium hover:scale-105 transform">
          Sign up
        </button>
        <button className="px-4 py-1 bg-transparent border border-white rounded-full font-medium hover:bg-white hover:text-black hover:scale-105 transform">
          Log in
        </button>
      </div>
    </nav>
  );
};

export default Navbar;