import React from 'react';
import Navbar from '../components/home/Navbar';
import { Search, FileText } from 'lucide-react';

const PatientResults = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full border border-gray-100 text-center">
          <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="text-brand-orange" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-brand-blue mb-2">Access Your Results</h1>
          <p className="text-gray-500 mb-8">Enter your Lab Reference Number to securely download your official PDF report.</p>
          
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="focus:ring-brand-blue focus:border-brand-blue block w-full pl-10 border-gray-300 rounded-lg py-3 border bg-gray-50" 
                placeholder="e.g. TURPOINT-0001"
              />
            </div>
            <button className="bg-brand-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-all">
              Search
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientResults;