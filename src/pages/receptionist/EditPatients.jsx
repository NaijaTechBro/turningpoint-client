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
    firstName: '', lastName: '', email: '', phone: '', gender: 'Male', 
    referringDoctor: '', referringClinic: '', dateReferred: '', age: ''
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data } = await API.get(`/patients/${id}`);
        const patientData = data.data;
        
        // Format the referral date properly for the HTML input, if it exists
        let formattedDateReferred = '';
        if (patientData.dateReferred) {
          formattedDateReferred = new Date(patientData.dateReferred).toISOString().split('T')[0];
        }

        setFormData({ 
            ...patientData, 
            dateReferred: formattedDateReferred,
            email: patientData.email || '',
            phone: patientData.phone || '',
            age: patientData.age || '',
            referringDoctor: patientData.referringDoctor || '',
            referringClinic: patientData.referringClinic || ''
        });
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
      navigate(`/receptionist/patients/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center flex justify-center"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold hover:text-brand-blue transition-colors">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-brand-blue p-10 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="text-brand-orange" size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black">Edit Patient Profile</h2>
              <p className="text-white/60 font-bold text-xs uppercase tracking-widest mt-1">{formData.hospitalNumber}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* COMPULSORY FIELDS */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">First Name <span className="text-red-500">*</span></label>
            <input type="text" required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Last Name <span className="text-red-500">*</span></label>
            <input type="text" required className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Gender <span className="text-red-500">*</span></label>
            <select className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Age</label>
            <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
          </div>

          {/* OPTIONAL CONTACT INFO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Phone Number</label>
            <input type="tel" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Email Address</label>
            <input type="email" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          {/* REFERRAL INFO */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Referring Doctor</label>
            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.referringDoctor} onChange={(e) => setFormData({...formData, referringDoctor: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Referring Clinic</label>
            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.referringClinic} onChange={(e) => setFormData({...formData, referringClinic: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Date Referred</label>
            <input type="date" className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-brand-orange font-bold text-brand-blue"
              value={formData.dateReferred} onChange={(e) => setFormData({...formData, dateReferred: e.target.value})} />
          </div>

          <button type="submit" disabled={saving} className="md:col-span-2 py-5 mt-4 bg-brand-orange text-white rounded-2xl font-black shadow-xl shadow-orange-200 flex justify-center items-center gap-3 hover:bg-orange-600 transition-all text-lg">
            {saving ? <Loader2 className="animate-spin" /> : <><Save size={24} /> Save Patient Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPatient;