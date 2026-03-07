import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, Calendar, Trash2, Loader2, ArrowLeft, Activity, CalendarDays, CheckCircle, Clock, FileText, User, Stethoscope, Building2 } from 'lucide-react';
import API from '../../services/api';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  const handleResendReport = async (testId) => {
    if (window.confirm("Resend this verified report to the patient's email?")) {
      try {
        await API.post(`/test-requests/${testId}/send-report`);
        alert("✅ Report successfully queued for email delivery.");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to resend report. Make sure it's verified and the patient has an email.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return { day: 'N/A', time: '' };
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Pagination Logic
  const indexOfLastTest = currentPage * testsPerPage;
  const indexOfFirstTest = indexOfLastTest - testsPerPage;
  const currentTests = testHistory.slice(indexOfFirstTest, indexOfLastTest);
  const totalPages = Math.ceil(testHistory.length / testsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          
          <div className="w-full mt-10 space-y-4 text-left border-t border-gray-50 pt-8">
            {patient.age && (
              <div className="flex items-center gap-4">
                <User size={18} className="text-brand-orange" />
                <p className="text-sm font-bold text-gray-600">{patient.age} Years Old</p>
              </div>
            )}
            {patient.email && (
              <div className="flex items-center gap-4">
                <Mail size={18} className="text-brand-orange" />
                <p className="text-sm font-bold text-gray-600">{patient.email}</p>
              </div>
            )}
            {patient.phone && (
              <div className="flex items-center gap-4">
                <Phone size={18} className="text-brand-orange" />
                <p className="text-sm font-bold text-gray-600">{patient.phone}</p>
              </div>
            )}
            
            {/* Registration Date & Time */}
            <div className="flex items-center gap-4">
              <Calendar size={18} className="text-brand-orange" />
              <p className="text-sm font-bold text-gray-600">
                Registered: {new Date(patient.createdAt).toLocaleDateString('en-GB')} at {new Date(patient.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {(patient.referringDoctor || patient.referringClinic || patient.dateReferred) && (
              <div className="pt-6 mt-2 border-t border-gray-50 space-y-4">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Referral Details</p>
                {patient.referringDoctor && (
                  <div className="flex items-center gap-4">
                    <Stethoscope size={18} className="text-brand-orange" />
                    <p className="text-sm font-bold text-gray-600">{patient.referringDoctor}</p>
                  </div>
                )}
                {patient.referringClinic && (
                  <div className="flex items-center gap-4">
                    <Building2 size={18} className="text-brand-orange" />
                    <p className="text-sm font-bold text-gray-600">{patient.referringClinic}</p>
                  </div>
                )}
                {patient.dateReferred && (
                  <div className="flex items-center gap-4">
                    <CalendarDays size={18} className="text-brand-orange" />
                    <p className="text-sm font-bold text-gray-600">Ref. Date: {new Date(patient.dateReferred).toLocaleDateString('en-GB')}</p>
                  </div>
                )}
              </div>
            )}
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
          
          <div className="flex-1 flex flex-col">
            {testHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Activity size={32} className="text-gray-200" />
                </div>
                <p className="text-gray-400 font-bold">No diagnostic history found.</p>
                <p className="text-gray-300 text-xs mt-1">This patient has no registered test results.</p>
              </div>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Test</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {currentTests.map(test => {
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
                            <p className="font-black text-brand-blue">{test.template?.testName || 'Unknown / Deleted Test'}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{test.labReference}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="font-black text-brand-blue">₦{test.testPrice?.toLocaleString() || '0'}</p>
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
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleViewPDF(test._id)} 
                                  className="px-3 py-2 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-blue-900 transition-colors inline-flex items-center gap-2"
                                >
                                  <FileText size={14} /> PDF
                                </button>
                                <button 
                                  onClick={() => handleResendReport(test._id)} 
                                  title="Resend Email to Patient" 
                                  className="px-3 py-2 bg-orange-100 text-brand-orange rounded-lg text-xs font-bold hover:bg-brand-orange hover:text-white transition-colors inline-flex items-center gap-2"
                                >
                                  <Mail size={14} /> Resend
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-gray-400 italic">Processing...</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center px-8 py-4 border-t border-gray-50 mt-auto bg-white">
                    <p className="text-xs font-bold text-gray-400">
                      Showing <span className="text-brand-blue">{indexOfFirstTest + 1}</span> to <span className="text-brand-blue">{Math.min(indexOfLastTest, testHistory.length)}</span> of <span className="text-brand-blue">{testHistory.length}</span> entries
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => paginate(currentPage - 1)} 
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-xs font-bold text-brand-blue bg-blue-50 rounded-lg hover:bg-brand-blue hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Prev
                      </button>
                      <button 
                        onClick={() => paginate(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-xs font-bold text-brand-blue bg-blue-50 rounded-lg hover:bg-brand-blue hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;