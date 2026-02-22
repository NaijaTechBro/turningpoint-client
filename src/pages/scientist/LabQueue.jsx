import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Beaker, ArrowRight, Activity, Loader2 } from 'lucide-react';
import API from '../../services/api';

const LabQueue = () => {
  const [queue, setQueue] = useState([]);
  const [searchRef, setSearchRef] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchQueue = async () => {
    try {
      const { data } = await API.get('/test-requests/all');
      // Only show tests that need scientist attention
      const activeTests = data.data.filter(req => req.status === 'PENDING' || req.status === 'RESULT_ENTERED');
      setQueue(activeTests);
    } catch (err) {
      console.error("Queue fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000); // Auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const handleScan = (e) => {
    e.preventDefault();
    if (searchRef.trim()) {
      navigate(`/scientist/enter-result/${searchRef.trim()}`);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-brand-blue flex items-center gap-3">
            <Beaker className="text-brand-orange" /> Laboratory Queue
          </h1>
          <div className="flex items-center gap-2 text-brand-green font-bold text-xs mt-2 uppercase tracking-widest">
            <Activity size={14} className="animate-pulse" /> Live Updates Active
          </div>
        </div>
        
        <form onSubmit={handleScan} className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Scan Barcode or Type Reference..." 
            className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none font-bold text-brand-blue"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            autoFocus
          />
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
        </form>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>
        ) : queue.length === 0 ? (
          <div className="p-20 text-center text-gray-400 font-bold italic">Queue is currently empty. Waiting for new specimens...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Specimen ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Test Required</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {queue.map(req => (
                <tr key={req._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-black text-brand-blue">{req.labReference}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-brand-blue">{req.patient?.firstName} {req.patient?.lastName}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{req.patient?.hospitalNumber}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-brand-orange">{req.template?.testName}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">{req.template?.category}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      req.status === 'PENDING' ? 'bg-orange-100 text-brand-orange' : 'bg-blue-100 text-brand-blue'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => navigate(`/scientist/enter-result/${req.labReference}`)}
                      className="p-3 bg-gray-50 text-brand-blue rounded-xl group-hover:bg-brand-blue group-hover:text-white transition-all shadow-sm"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LabQueue;