import React from 'react';
import Navbar from '../components/home/Navbar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 px-4 max-w-5xl mx-auto w-full text-center">
        <h1 className="text-4xl font-extrabold text-brand-blue mb-6">About Turning Point Diagnostics</h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Located in the heart of Amuwo-Odofin, Lagos, Turning Point Diagnostics is dedicated to providing world-class medical insights with uncompromising precision. We merge brilliant scientific minds with the world's most advanced analytical equipment to deliver the care you need.
        </p>
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop" 
          alt="Laboratory Facility" 
          className="rounded-2xl shadow-lg w-full h-80 object-cover"
        />
      </main>
    </div>
  );
};

export default AboutPage;