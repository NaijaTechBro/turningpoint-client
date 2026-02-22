import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2, User } from 'lucide-react';
import API from '../../services/api';

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', gender: '', dateOfBirth: ''
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data } = await API.get(`/patients/${id}`);
        // Format date for the input field (YYYY-MM-DD)
        const date = new Date(data.data.dateOfBirth).toISOString().split('T')[0];
        setFormData({ ...data.data, dateOfBirth: date });
      } catch (err) {
        alert("Failed to load patient data");
        navigate('/receptionist/patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put(`/patients/${id}`, formData);
      navigate('/receptionist/patients');
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-brand-blue">Loading Record...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold hover:text-brand-blue">
        <ArrowLeft size={20} /> Back to Directory
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-brand-blue p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="text-brand-orange" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Edit Patient Profile</h2>
              <p className="text-white/60 font-bold text-xs uppercase tracking-widest">{formData.hospitalNumber}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">First Name</label>
            <input type="text" required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Last Name</label>
            <input type="text" required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Phone Number</label>
            <input type="tel" required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Email Address</label>
            <input type="email" required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <button type="submit" disabled={saving} className="md:col-span-2 py-4 mt-4 bg-brand-orange text-white rounded-2xl font-black shadow-xl shadow-orange-200 flex justify-center items-center gap-3 hover:bg-orange-600 transition-all">
            {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Update Patient Record</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPatient;