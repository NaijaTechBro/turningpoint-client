import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, Calendar, Hash, Trash2, Clipboard } from 'lucide-react';
import API from '../../services/api';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await API.get(`/patients/${id}`);
        setPatient(data.data);
      } catch (err) {
        navigate('/receptionist/patients');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("CRITICAL: Permanent deletion of medical records. Proceed?")) {
      try {
        await API.delete(`/patients/${id}`); // Admin/Receptionist protected
        navigate('/receptionist/patients');
      } catch (err) {
        alert(err.response?.data?.message || "Delete failed");
      }
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-brand-blue">Retrieving EMR...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-brand-blue rounded-full flex items-center justify-center text-white text-3xl font-black mb-4">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <h2 className="text-2xl font-black text-brand-blue">{patient.firstName} {patient.lastName}</h2>
          <span className="bg-orange-100 text-brand-orange px-4 py-1 rounded-full text-[10px] font-black uppercase mt-2">
            {patient.hospitalNumber}
          </span>
          
          <div className="w-full mt-8 space-y-4 text-left border-t border-gray-50 pt-8">
            <div className="flex items-center gap-3 text-gray-500 font-medium">
              <Mail size={18} className="text-brand-orange" /> {patient.email}
            </div>
            <div className="flex items-center gap-3 text-gray-500 font-medium">
              <Phone size={18} className="text-brand-orange" /> {patient.phone}
            </div>
            <div className="flex items-center gap-3 text-gray-500 font-medium">
              <Calendar size={18} className="text-brand-orange" /> {new Date(patient.dateOfBirth).toLocaleDateString()}
            </div>
          </div>

          <button onClick={handleDelete} className="mt-8 flex items-center gap-2 text-red-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest transition-colors">
            <Trash2 size={16} /> Erase Record
          </button>
        </div>

        {/* Test History Block */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-black text-brand-blue">Clinical History</h3>
            <button onClick={() => navigate(`/receptionist/order-test/${patient._id}`)} className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold text-xs">
              New Requisition
            </button>
          </div>
          <div className="p-20 text-center text-gray-300 italic font-medium">
            No previous test orders found for this patient.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;