import React from 'react';
import Navbar from '../components/home/Navbar';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 px-4 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl font-extrabold text-brand-blue text-center mb-12">Get in Touch</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-100">
            <MapPin className="text-brand-orange mx-auto mb-4" size={32} />
            <h3 className="font-bold text-brand-blue mb-2">Visit Us</h3>
            <p className="text-gray-600 text-sm">5 Oladipo Coker Ave, off Durbar Rd<br/>Amuwo-Odofin Mile 2, Lagos</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-100">
            <Phone className="text-brand-green mx-auto mb-4" size={32} />
            <h3 className="font-bold text-brand-blue mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm">0818 224 6491<br/>0709 814 1804</p>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-2xl text-center border border-gray-100">
            <Mail className="text-brand-blue mx-auto mb-4" size={32} />
            <h3 className="font-bold text-brand-blue mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm">info@turningpoint.com<br/>support@turningpoint.com</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;