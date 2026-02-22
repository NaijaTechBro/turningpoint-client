

import React, { useState, useEffect } from 'react';
import Navbar from '../components/home/Navbar';
import { Search, Activity, Loader2, Beaker } from 'lucide-react';
import API from '../services/api'; // Assuming API base URL is configured

const TestMenu = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        // Hitting a public endpoint we will create
        const { data } = await API.get('/templates/public');
        setTemplates(data.data);
      } catch (err) {
        console.error("Failed to fetch public catalog");
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // Extract unique categories for the filter tabs
  const categories = ['All', ...new Set(templates.map(t => t.category))];

  const filteredTests = templates.filter(test => {
    const matchesSearch = test.testName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.testCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || test.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-blue mb-6">Comprehensive Test Menu</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our complete catalog of automated laboratory tests, imaging services, and specialized health screenings.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  activeCategory === cat ? 'bg-brand-blue text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search tests or codes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-orange shadow-sm font-medium"
            />
          </div>
        </div>

        {/* Dynamic Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-brand-orange mb-4" size={48} />
            <p className="text-brand-blue font-bold">Loading diagnostic catalog...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <Activity className="mx-auto text-gray-200 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-400">No tests found matching your criteria.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map(test => (
              <div key={test._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                      <Beaker size={24} />
                    </div>
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {test.testCode}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-brand-blue leading-tight mb-2">{test.testName}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{test.category}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Base Price</span>
                  <span className="text-xl font-black text-brand-orange">₦{test.basePrice?.toLocaleString() || '0'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TestMenu;