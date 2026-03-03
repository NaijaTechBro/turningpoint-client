// import React, { useState } from 'react';
// import { X, UserPlus, Loader2, ShieldCheck } from 'lucide-react';
// import API from '../../services/api';

// const AddStaffModal = ({ isOpen, onClose, onRefresh }) => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     role: 'Receptionist'
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   if (!isOpen) return null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       await API.post('/users', formData);
//       onRefresh(); // Refresh the staff list after adding
//       onClose();   // Close the modal
//       setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'Receptionist' });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create staff account');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/50 backdrop-blur-sm p-4">
//       <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
//         <div className="bg-brand-blue p-6 text-white flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <UserPlus size={24} className="text-brand-orange" />
//             <h2 className="text-xl font-bold">Add New Personnel</h2>
//           </div>
//           <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
//             <X size={24} />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}
          
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name</label>
//               <input type="text" required className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none" 
//                 onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name</label>
//               <input type="text" required className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none" 
//                 onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Professional Email</label>
//             <input type="email" required className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none" 
//               placeholder="v.nwanya@turningpoint.com"
//               onChange={(e) => setFormData({...formData, email: e.target.value})} />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Initial Password</label>
//             <input type="password" required className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none" 
//               onChange={(e) => setFormData({...formData, password: e.target.value})} />
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assigned Role</label>
//             <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue font-bold text-brand-blue">
//   <option value="Receptionist">Receptionist</option>
//   <option value="LabScientist">Lab Scientist</option>
//   <option value="Sonographer">Sonographer</option>
//   <option value="LabTechnician">Lab Technician</option>
//   <option value="Admin">System Admin</option>
// </select>
//           </div>

//           <button type="submit" disabled={loading} className="w-full bg-brand-orange text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg flex justify-center items-center gap-2">
//             {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ShieldCheck size={20}/></>}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddStaffModal;

import React, { useState } from 'react';
import { X, UserPlus, Loader2, ShieldCheck } from 'lucide-react';
import API from '../../services/api';

const AddStaffModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Receptionist'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/users', formData);
      onRefresh(); // Refresh the staff list after adding
      onClose();   // Close the modal
      setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'Receptionist' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create staff account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-brand-blue p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UserPlus size={24} className="text-brand-orange" />
            <h2 className="text-xl font-bold">Add New Personnel</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
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
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Professional Email</label>
            <input type="email" required className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none" 
              placeholder="v.nwanya@turningpoint.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Initial Password</label>
            <input type="password" required className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assigned Role</label>
            {/* FIXED: We point value to formData.role, and onChange to setFormData! */}
            <select 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})} 
              className="w-full border border-gray-200 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-brand-orange outline-none font-bold text-brand-blue"
            >
              <option value="Receptionist">Receptionist</option>
              <option value="LabScientist">Lab Scientist</option>
              <option value="Sonographer">Sonographer</option>
              <option value="LabTechnician">Lab Technician</option>
              <option value="Admin">System Admin</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-brand-orange text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg flex justify-center items-center gap-2 mt-4">
            {loading ? <Loader2 className="animate-spin" /> : <>Create Account <ShieldCheck size={20}/></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;