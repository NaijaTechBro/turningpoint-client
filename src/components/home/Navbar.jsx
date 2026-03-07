
import React, { useState } from 'react';
import { MapPin, Phone, Clock, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full shadow-md sticky top-0 z-50 bg-white">
      <div className="bg-brand-blue text-white text-[10px] md:text-xs py-2 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-brand-orange shrink-0" />
          <span>5 Oladipo Coker Ave, off Durbar Rd, Amuwo-Odofin Mile 2, Lagos</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Phone size={14} className="text-brand-orange" />
            <span className="font-semibold">08182246491, 07098141804</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <Clock size={14} className="text-brand-orange" />
            <span>Mon - Sat: 8AM - 6PM</span>
          </div>
        </div>
      </div>

      <div className="py-4 px-4 md:px-10 flex justify-between items-center">
        <Link to="/">
          {/* FIXED: Render it as an image tag! */}
          <img src={Logo} alt="Turning Point Logo" className="h-15 w-auto md:h-12" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 font-medium text-brand-blue">
          <Link to="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <Link to="/test-menu" className="hover:text-brand-orange transition-colors">Test Menu</Link>
          <Link to="/about" className="hover:text-brand-orange transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-brand-orange transition-colors">Contact</Link>
        </nav>

        <div className="hidden md:flex gap-3">
          <Link to="/login" className="px-5 py-2 text-brand-blue border-2 border-brand-blue font-bold rounded-lg hover:bg-brand-blue hover:text-white transition-all text-sm text-center">
            Staff Portal
          </Link>
          <Link to="/results" className="px-5 py-2 bg-brand-orange text-white font-bold rounded-lg hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all text-sm flex items-center justify-center gap-2">
            Check Results
          </Link>
        </div>

        <button className="md:hidden text-brand-blue" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 flex flex-col gap-4 shadow-lg absolute w-full">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-brand-blue font-medium hover:text-brand-orange">Home</Link>
          <Link to="/test-menu" onClick={() => setIsOpen(false)} className="text-brand-blue font-medium hover:text-brand-orange">Test Menu</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="text-brand-blue font-medium hover:text-brand-orange">About Us</Link>
          <Link to="/results" onClick={() => setIsOpen(false)} className="w-full py-3 bg-brand-orange text-white font-bold rounded-lg text-center">Check Results</Link>
          <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-3 border-2 border-brand-blue text-brand-blue font-bold rounded-lg text-center">Staff Login</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;