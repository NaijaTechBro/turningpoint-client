import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import API from '../../services/api';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: 'Male', dateOfBirth: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/patients', formData); // Triggers hospitalNumber & email
      alert(`Success! Patient ID: ${data.data.hospitalNumber}`);
      navigate('/receptionist/patients');
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold hover:text-brand-blue transition-colors">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-brand-blue p-10 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">New Registration</h1>
            <p className="text-white/60 font-bold uppercase text-xs tracking-widest mt-1">Turning Point Patient Intake</p>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <UserPlus className="text-brand-orange" size={32} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">First Name</label>
            <input type="text" required placeholder="Sodiq" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Last Name</label>
            <input type="text" required placeholder="Adeiza" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Gender</label>
            <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Date of Birth</label>
            <input type="date" required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Email Address</label>
            <input type="email" required placeholder="s.adeiza@example.com" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Phone Number</label>
            <input type="tel" required placeholder="08123456789" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>

          <button type="submit" disabled={loading} className="md:col-span-2 py-5 bg-brand-orange text-white rounded-2xl font-black shadow-xl shadow-orange-200 flex justify-center items-center gap-3 hover:bg-orange-600 transition-all text-lg">
            {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={24}/> Complete Registration</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPatient;