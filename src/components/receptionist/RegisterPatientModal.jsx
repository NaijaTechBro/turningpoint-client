import React, { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import API from '../../services/api';

const RegisterPatientModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/patients', formData);
      onRefresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-blue/40 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-brand-blue flex items-center gap-3">
            <UserPlus className="text-brand-orange" /> New Patient Registration
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input type="text" placeholder="First Name" required className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-orange" 
              onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            <input type="text" placeholder="Last Name" required className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-orange" 
              onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            <input type="email" placeholder="Email (Optional)" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-orange" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="tel" placeholder="Phone Number" required className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-orange" 
              onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="space-y-4">
            <select className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-orange" 
              onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
            <input type="date" required className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-orange text-gray-400" 
              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
            <textarea placeholder="Residential Address" className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-orange h-[112px]" 
              onChange={(e) => setFormData({...formData, address: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="md:col-span-2 py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-brand-blue/90 shadow-lg flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPatientModal;