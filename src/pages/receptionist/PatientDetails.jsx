import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, Calendar, Trash2, Loader2, ArrowLeft, Activity, CalendarDays, CheckCircle, Clock, FileText } from 'lucide-react';
import API from '../../services/api';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both patient info AND their test history simultaneously
        const [patientRes, historyRes] = await Promise.all([
          API.get(`/patients/${id}`),
          API.get(`/test-requests/patient/${id}`)
        ]);
        
        setPatient(patientRes.data.data);
        setTestHistory(historyRes.data.data);
      } catch (err) {
        console.error(err);
        navigate('/receptionist/patients');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("CRITICAL: Permanent deletion of medical records. Proceed?")) {
      try {
        await API.delete(`/patients/${id}`);
        navigate('/receptionist/patients');
      } catch (err) {
        alert(err.response?.data?.message || "Delete failed");
      }
    }
  };

  const handleViewPDF = async (testId) => {
    try {
      const response = await API.get(`/test-requests/${testId}/pdf`, { responseType: 'blob' });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (err) {
      alert("Failed to load the PDF. Ensure the test is verified.");
    }
  };

  // Helper to format dates cleanly
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/receptionist/patients')} className="flex items-center gap-2 text-gray-400 font-bold hover:text-brand-blue transition-colors">
        <ArrowLeft size={20} /> Directory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-brand-blue rounded-full flex items-center justify-center text-white text-3xl font-black mb-6">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <h2 className="text-2xl font-black text-brand-blue">{patient.firstName} {patient.lastName}</h2>
          <span className="bg-orange-100 text-brand-orange px-4 py-1.5 rounded-full text-[10px] font-black uppercase mt-3 tracking-widest">
            {patient.hospitalNumber}
          </span>
          
          <div className="w-full mt-10 space-y-5 text-left border-t border-gray-50 pt-8">
            <div className="flex items-center gap-4">
              <Mail size={18} className="text-brand-orange" />
              <p className="text-sm font-bold text-gray-600">{patient.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Phone size={18} className="text-brand-orange" />
              <p className="text-sm font-bold text-gray-600">{patient.phone}</p>
            </div>
            <div className="flex items-center gap-4">
              <Calendar size={18} className="text-brand-orange" />
              <p className="text-sm font-bold text-gray-600">{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </div>

          <button onClick={handleDelete} className="mt-10 flex items-center gap-2 text-red-400 hover:text-red-600 font-bold text-xs uppercase tracking-widest transition-colors">
            <Trash2 size={16} /> Erase Record
          </button>
        </div>

        {/* Right: Test History Block */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <div className="flex items-center gap-3">
              <Activity className="text-brand-green" size={24} />
              <h3 className="font-black text-brand-blue uppercase tracking-tight">Clinical History</h3>
            </div>
            <button onClick={() => navigate(`/receptionist/order-test/${patient._id}`)} className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-blue-100 hover:bg-blue-900 transition-all">
              New Requisition
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {testHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Activity size={32} className="text-gray-200" />
                </div>
                <p className="text-gray-400 font-bold">No diagnostic history found.</p>
                <p className="text-gray-300 text-xs mt-1">This patient has no registered test results.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Test</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {testHistory.map(test => {
                    const { day, time } = formatDate(test.createdAt);
                    return (
                      <tr key={test._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-brand-blue">
                            <CalendarDays size={16} className="text-brand-orange" />
                            <div>
                              <p className="font-bold text-sm">{day}</p>
                              <p className="text-[10px] font-black text-gray-400 tracking-widest">{time}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-black text-brand-blue">{test.template?.testName}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{test.labReference}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            (test.status === 'VERIFIED' || test.status === 'DELIVERED') ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-brand-orange'
                          }`}>
                            {(test.status === 'VERIFIED' || test.status === 'DELIVERED') ? <CheckCircle size={12}/> : <Clock size={12}/>}
                            {test.status.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          {(test.status === 'VERIFIED' || test.status === 'DELIVERED') ? (
                            <button 
                              onClick={() => handleViewPDF(test._id)}
                              className="px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-blue-900 transition-colors inline-flex items-center gap-2"
                            >
                              <FileText size={14} /> View PDF
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 italic">Processing...</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;