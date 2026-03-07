import React, { useState } from 'react';
import Navbar from '../components/home/Navbar';
import { Search, FileText, Loader2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import API from '../services/api';
import Logo from '../assets/logo.png'

// Your native SVG Logo
// const Logo = () => (
//   <div className="flex items-center gap-3 justify-center mb-6">
//     <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M10 60 Q 25 30 50 35" stroke="#228B22" strokeWidth="6" strokeLinecap="round" fill="transparent" />
//       <path d="M50 85 C 50 85 15 55 15 35 C 15 20 30 15 40 25 C 50 35 50 35 50 35 C 50 35 50 35 60 25 C 70 15 85 20 85 35 C 85 55 50 85 50 85 Z" fill="#FF6B35" />
//       <rect x="44" y="32" width="12" height="26" rx="2" fill="#FFFFFF" />
//       <rect x="37" y="39" width="26" height="12" rx="2" fill="#FFFFFF" />
//     </svg>
//     <div className="flex flex-col text-left">
//       <span className="text-2xl font-bold text-brand-orange leading-none">Turning Point</span>
//       <span className="text-[10px] text-brand-green tracking-[0.2em] uppercase font-bold mt-1">HEALTH SERVICES</span>
//     </div>
//   </div>
// );

const PatientResults = () => {
  const [labRef, setLabRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!labRef.trim()) return;
    
    setLoading(true);
    setError('');
    setResultData(null);
    
    try {
      const { data } = await API.get(`/test-requests/public/track/${labRef.trim().toUpperCase()}`);
      setResultData(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Lab Reference or Test not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await API.get(`/test-requests/public/pdf/${resultData._id}`, {
        responseType: 'blob', // Expecting PDF binary
      });
      
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = `${resultData.labReference}-Report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      // FIX: When responseType is 'blob', Axios turns the JSON error into a Blob too! 
      // We must extract the text to read the actual error message.
      if (err.response && err.response.data instanceof Blob) {
        const text = await err.response.data.text();
        const jsonError = JSON.parse(text);
        alert(jsonError.message || "Failed to download PDF.");
      } else {
        alert("Failed to download PDF. Please try again later.");
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6 mt-10">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl max-w-xl w-full border border-gray-100 text-center relative overflow-hidden">
          
          <Logo />
          
          <h1 className="text-3xl font-black text-brand-blue mb-2 mt-4">Access Your Results</h1>
          <p className="text-gray-500 font-medium mb-10">Enter the Lab Reference Number from your receipt to securely download your official medical report.</p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                value={labRef}
                onChange={(e) => setLabRef(e.target.value)}
                className="w-full pl-14 pr-4 py-5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-brand-blue focus:ring-0 font-black text-brand-blue uppercase tracking-widest outline-none transition-all" 
                placeholder="e.g. TURPOINT-0001"
              />
            </div>
            <button type="submit" disabled={loading || !labRef.trim()} className="bg-brand-orange text-white px-8 py-5 rounded-2xl font-black shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]">
              {loading ? <Loader2 className="animate-spin" size={24} /> : "Search"}
            </button>
          </form>

          {/* Error State */}
          {error && (
            <div className="mt-8 bg-red-50 text-red-500 p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm animate-in fade-in zoom-in duration-300">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Results State */}
          {resultData && (
            <div className="mt-10 pt-8 border-t border-gray-100 text-left animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Test Profile</p>
                  <h3 className="text-xl font-black text-brand-blue leading-tight">{resultData.testName}</h3>
                </div>
                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 ${
                  (resultData.status === 'VERIFIED' || resultData.status === 'DELIVERED') ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-brand-orange'
                }`}>
                  {(resultData.status === 'VERIFIED' || resultData.status === 'DELIVERED') ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {(resultData.status === 'VERIFIED' || resultData.status === 'DELIVERED') ? 'Ready' : 'Processing'}
                </div>
              </div>

              {(resultData.status === 'VERIFIED' || resultData.status === 'DELIVERED') ? (
                <button 
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-900 transition-all flex items-center justify-center gap-2"
                >
                  {downloading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                  {downloading ? "Generating Document..." : "Download Official Report"}
                </button>
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
                  <p className="text-brand-blue font-bold">Your sample is currently being analyzed.</p>
                  <p className="text-gray-400 text-sm mt-1">Please check back later or wait for our email notification.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientResults;