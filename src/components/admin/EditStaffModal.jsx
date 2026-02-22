import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, UserCog } from 'lucide-react';
import API from '../../services/api';

const EditStaffModal = ({ isOpen, onClose, onRefresh, staffMember }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form when staffMember changes
  useEffect(() => {
    if (staffMember) {
      setFormData({
        firstName: staffMember.firstName || '',
        lastName: staffMember.lastName || '',
        email: staffMember.email || '',
        role: staffMember.role || '',
        status: staffMember.status || ''
      });
    }
  }, [staffMember]);

  if (!isOpen || !staffMember) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.put(`/users/${staffMember._id}`, formData);
      onRefresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update personnel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-brand-blue p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UserCog size={24} className="text-brand-orange" />
            <h2 className="text-xl font-bold">Update Profile</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
              <input type="text" required className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
              <input type="text" required className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
            <select className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none font-bold text-brand-blue"
              value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="Receptionist">Receptionist</option>
              <option value="LabScientist">Lab Scientist</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Status</label>
            <select className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none font-bold"
              value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-blue-900 transition-all shadow-lg flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <>Save Changes <Save size={20}/></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStaffModal;