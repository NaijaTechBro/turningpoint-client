import React, { useState } from 'react';
import { ShoppingCart, Search, CheckCircle } from 'lucide-react';

const OrderTestModal = ({ isOpen, onClose, patient }) => {
  const [selectedTests, setSelectedTests] = useState([]);
  
  const testCatalog = [
    { id: 1, name: "MRI Brain + Contrast", category: "Imaging", price: 85000 },
    { id: 2, name: "CT-Scan Chest", category: "Imaging", price: 65000 },
    { id: 3, name: "ECG", category: "Cardiac", price: 5000 },
    { id: 4, name: "DNA Sequencer (Full)", category: "Pathology", price: 150000 },
    { id: 5, name: "Blood Banking Service", category: "Pathology", price: 12000 },
  ];

  const toggleTest = (test) => {
    if (selectedTests.find(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-blue/40 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex h-[80vh] overflow-hidden">
        {/* Catalog Section */}
        <div className="flex-1 p-8 border-r border-gray-100 flex flex-col">
          <h2 className="text-2xl font-black text-brand-blue mb-6">Service Requisition</h2>
          <div className="relative mb-6">
            <input type="text" placeholder="Filter tests..." className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl outline-none" />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {testCatalog.map(test => (
              <div 
                key={test.id} 
                onClick={() => toggleTest(test)}
                className={`p-4 rounded-2xl cursor-pointer border-2 transition-all flex justify-between items-center ${
                  selectedTests.find(t => t.id === test.id) ? 'border-brand-orange bg-orange-50' : 'border-transparent bg-gray-50'
                }`}
              >
                <div>
                  <p className="font-bold text-brand-blue">{test.name}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{test.category}</p>
                </div>
                <p className="font-black text-brand-blue">₦{test.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="w-80 bg-gray-50 p-8 flex flex-col">
          <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-8 text-center underline decoration-brand-orange underline-offset-8">Order Summary</h3>
          <div className="flex-1">
            {selectedTests.map(test => (
              <div key={test.id} className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-brand-blue">{test.name}</span>
                <span className="text-xs font-black">₦{test.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-gray-400">Total</span>
              <span className="text-2xl font-black text-brand-blue">₦{selectedTests.reduce((acc, t) => acc + t.price, 0).toLocaleString()}</span>
            </div>
            <button className="w-full py-4 bg-brand-orange text-white rounded-2xl font-black shadow-xl shadow-orange-200 flex items-center justify-center gap-2">
              Generate Invoice <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTestModal;