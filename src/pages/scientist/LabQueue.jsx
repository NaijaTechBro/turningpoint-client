// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Search, Beaker, ArrowRight, Activity, Loader2 } from 'lucide-react';
// import API from '../../services/api';

// const LabQueue = () => {
//   const [queue, setQueue] = useState([]);
//   const [searchRef, setSearchRef] = useState('');
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const fetchQueue = async () => {
//     try {
//       const { data } = await API.get('/test-requests/all');
//       // Only show tests that need scientist attention
//       const activeTests = data.data.filter(req => req.status === 'PENDING' || req.status === 'RESULT_ENTERED');
//       setQueue(activeTests);
//     } catch (err) {
//       console.error("Queue fetch failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchQueue();
//     const interval = setInterval(fetchQueue, 15000); // Auto-refresh every 15s
//     return () => clearInterval(interval);
//   }, []);

//   const handleScan = (e) => {
//     e.preventDefault();
//     if (searchRef.trim()) {
//       navigate(`/scientist/enter-result/${searchRef.trim()}`);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
//         <div>
//           <h1 className="text-3xl font-black text-brand-blue flex items-center gap-3">
//             <Beaker className="text-brand-orange" /> Laboratory Queue
//           </h1>
//           <div className="flex items-center gap-2 text-brand-green font-bold text-xs mt-2 uppercase tracking-widest">
//             <Activity size={14} className="animate-pulse" /> Live Updates Active
//           </div>
//         </div>
        
//         <form onSubmit={handleScan} className="relative w-full md:w-96">
//           <input 
//             type="text" 
//             placeholder="Scan Barcode or Type Reference..." 
//             className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none font-bold text-brand-blue"
//             value={searchRef}
//             onChange={(e) => setSearchRef(e.target.value)}
//             autoFocus
//           />
//           <Search className="absolute left-4 top-4 text-gray-400" size={20} />
//         </form>
//       </header>

//       <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
//         {loading ? (
//           <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>
//         ) : queue.length === 0 ? (
//           <div className="p-20 text-center text-gray-400 font-bold italic">Queue is currently empty. Waiting for new specimens...</div>
//         ) : (
//           <table className="w-full text-left">
//             <thead className="bg-gray-50/50 border-b border-gray-100">
//               <tr>
//                 <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Specimen ID</th>
//                 <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Details</th>
//                 <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Test Required</th>
//                 <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
//                 <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {queue.map(req => (
//                 <tr key={req._id} className="hover:bg-blue-50/30 transition-colors group">
//                   <td className="px-8 py-6">
//                     <span className="font-black text-brand-blue">{req.labReference}</span>
//                   </td>
//                   <td className="px-8 py-6">
//                     <p className="font-bold text-brand-blue">{req.patient?.firstName} {req.patient?.lastName}</p>
//                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{req.patient?.hospitalNumber}</p>
//                   </td>
//                   <td className="px-8 py-6">
//                     <p className="font-black text-brand-orange">{req.template?.testName}</p>
//                     <p className="text-[10px] font-bold text-gray-500 uppercase">{req.template?.category}</p>
//                   </td>
//                   <td className="px-8 py-6">
//                     <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
//                       req.status === 'PENDING' ? 'bg-orange-100 text-brand-orange' : 'bg-blue-100 text-brand-blue'
//                     }`}>
//                       {req.status.replace('_', ' ')}
//                     </span>
//                   </td>
//                   <td className="px-8 py-6 text-right">
//                     <button 
//                       onClick={() => navigate(`/scientist/enter-result/${req.labReference}`)}
//                       className="p-3 bg-gray-50 text-brand-blue rounded-xl group-hover:bg-brand-blue group-hover:text-white transition-all shadow-sm"
//                     >
//                       <ArrowRight size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LabQueue;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Beaker, ArrowRight, Activity, Loader2, CalendarDays, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../services/api';

const LabQueue = () => {
  const [queue, setQueue] = useState([]);
  const [searchRef, setSearchRef] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
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

  // Helper to format dates cleanly
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // Dedicated Print Barcode Function
  const printBarcode = (barcodeBase64, labRef, patientName) => {
    if (!barcodeBase64) return alert("Barcode image not available for this record.");
    
    const printWindow = window.open('', '_blank', 'width=600,height=400');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Specimen Label - ${labRef}</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #fff; }
            .label-container { text-align: center; border: 1px dashed #ccc; padding: 20px; width: 350px; }
            img { max-width: 100%; height: auto; margin-bottom: 10px; }
            p { margin: 2px 0; font-size: 14px; font-weight: bold; }
            .meta { font-size: 10px; color: #555; text-transform: uppercase; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="label-container">
            <p>TURNING POINT DIAGNOSTICS</p>
            <img src="${barcodeBase64}" alt="Barcode" />
            <p>${labRef}</p>
            <p class="meta">Patient: ${patientName}</p>
          </div>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Real-time Search Filtering
  const filteredQueue = queue.filter(req => {
    const search = searchRef.toLowerCase();
    const fullName = `${req.patient?.firstName} ${req.patient?.lastName}`.toLowerCase();
    const labReference = req.labReference.toLowerCase();
    return fullName.includes(search) || labReference.includes(search);
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredQueue.length / itemsPerPage) || 1;
  const currentItems = filteredQueue.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Form Submit (For physical barcode scanners)
  const handleScan = (e) => {
    e.preventDefault();
    if (!searchRef.trim()) return;

    // A barcode scanner hits "Enter", triggering this form submit.
    // We look for the exact match to route them instantly.
    const exactMatch = queue.find(q => q.labReference.toUpperCase() === searchRef.trim().toUpperCase());
    
    if (exactMatch) {
      navigate(`/scientist/enter-result/${exactMatch.labReference}`);
    } else {
      alert("Specimen not found in active queue.");
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
        
        {/* The Search / Scanner Form */}
        <form onSubmit={handleScan} className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Scan Barcode or Search Name..." 
            className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none font-bold text-brand-blue"
            value={searchRef}
            onChange={(e) => {
              setSearchRef(e.target.value);
              setPage(1); // Reset to page 1 on new search
            }}
            autoFocus
          />
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
        </form>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>
        ) : queue.length === 0 ? (
          <div className="p-20 text-center text-gray-400 font-bold italic">Queue is currently empty. Waiting for new specimens...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date / Time</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Specimen ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Details</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Test Required</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentItems.length > 0 ? (
                    currentItems.map(req => {
                      const { day, time } = formatDate(req.createdAt);
                      return (
                        <tr key={req._id} className="hover:bg-blue-50/30 transition-colors group">
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
                            <div className="flex justify-end gap-2">
                              {/* Print Barcode Button */}
                              <button 
                                onClick={() => printBarcode(req.barcodeImage, req.labReference, `${req.patient?.firstName} ${req.patient?.lastName}`)}
                                className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-200 transition-all shadow-sm"
                                title="Print Barcode Label"
                              >
                                <Printer size={18} />
                              </button>
                              
                              {/* Process Test Button */}
                              <button 
                                onClick={() => navigate(`/scientist/enter-result/${req.labReference}`)}
                                className="p-3 bg-brand-blue text-white rounded-xl hover:bg-blue-900 transition-all shadow-sm flex items-center gap-2"
                                title="Enter Results"
                              >
                                <ArrowRight size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-10 text-center text-gray-400 font-bold italic">
                        No specimens match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="p-2 border bg-white rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft size={20}/>
                  </button>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="p-2 border bg-white rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
                  >
                    <ChevronRight size={20}/>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LabQueue;