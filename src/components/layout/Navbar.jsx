import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

const Navbar = () => {
  const { user } = useAuth();

  // If user is logged in, we don't show the landing page links
  if (user) return null; 

  return (
    <nav className="w-full shadow-md bg-white py-4 px-10 flex justify-between items-center sticky top-0 z-50">
      <Link to="/"><Logo /></Link>
      <div className="hidden md:flex gap-8 font-medium text-brand-blue">
        <Link to="/" className="hover:text-brand-orange">Home</Link>
        <Link to="/test-menu" className="hover:text-brand-orange">Test Menu</Link>
        <Link to="/about" className="hover:text-brand-orange">About</Link>
      </div>
      <Link to="/login" className="px-6 py-2 bg-brand-blue text-white rounded-lg font-bold">
        Staff Portal
      </Link>
    </nav>
  );
};

export default Navbar;