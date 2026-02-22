import React from 'react';
import Navbar from '../components/home/Navbar';

const TestMenu = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 px-4 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue mb-6">Comprehensive Test Menu</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Browse our complete catalog of over 500+ automated laboratory tests, imaging services, and specialized health screenings.
        </p>
        <div className="p-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500 font-medium">
          The dynamic test catalog grid will be rendered here!
        </div>
      </main>
    </div>
  );
};

export default TestMenu;