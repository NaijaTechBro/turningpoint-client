import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Beaker, ArrowRight, Activity, Loader2, CalendarDays, Printer, ChevronLeft, ChevronRight, ClipboardList, CheckCircle, FileText } from 'lucide-react';
import API from '../../services/api';

const LabQueue = () => {
  const [queue, setQueue] = useState([]);
  const [searchRef, setSearchRef] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // For PDF loader
  
  // Tab State: 'active' (Pending) or 'completed' (Verified)
  const [activeTab, setActiveTab] = useState('active');

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  const navigate = useNavigate();

  const fetchQueue = async () => {
    try {
      const { data } = await API.get('/test-requests/all');
      // Fetch ALL tests, we will filter them using tabs below
      setQueue(data.data);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

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
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printWorksheet = () => {
    const pendingTests = queue.filter(req => req.status === 'PENDING');
    if (pendingTests.length === 0) return alert("No pending tests to print on the worksheet.");

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Laboratory Worksheet - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            h2 { text-align: center; margin-bottom: 5px; color: #000; }
            p.date { text-align: center; font-size: 12px; color: #666; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; }
            th { background-color: #f4f4f4; border: 1px solid #ccc; padding: 12px 8px; text-align: left; font-size: 12px; text-transform: uppercase; }
            td { border: 1px solid #ccc; padding: 12px 8px; font-size: 13px; vertical-align: top; }
            .notes-column { width: 40%; } 
          </style>
        </head>
        <body>
          <h2>Daily Laboratory Worksheet</h2>
          <p class="date">Generated: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Lab Ref</th>
                <th>Patient Name</th>
                <th>Test Required</th>
                <th class="notes-column">Results / Notes</th>
              </tr>
            </thead>
            <tbody>
              ${pendingTests.map(req => `
                <tr>
                  <td><strong>${req.labReference}</strong></td>
                  <td>${req.patient?.firstName} ${req.patient?.lastName}</td>
                  <td>${req.template?.testName}</td>
                  <td></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleViewPDF = async (id) => {
    setActionLoading(id);
    try {
      const response = await API.get(`/test-requests/${id}/pdf`, { responseType: 'blob' });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (err) {
      alert("Failed to securely load the PDF. Make sure it is verified.");
    } finally {
      setActionLoading(null);
    }
  };

  // --- FILTERING LOGIC ---
  const baseFilteredQueue = queue.filter(req => {
    if (activeTab === 'active') return req.status === 'PENDING' || req.status === 'RESULT_ENTERED';
    return req.status === 'VERIFIED' || req.status === 'DELIVERED';
  });

  const searchedQueue = baseFilteredQueue.filter(req => {
    const search = searchRef.toLowerCase();
    const fullName = `${req.patient?.firstName} ${req.patient?.lastName}`.toLowerCase();
    const labReference = req.labReference.toLowerCase();
    return fullName.includes(search) || labReference.includes(search);
  });

  const totalPages = Math.ceil(searchedQueue.length / itemsPerPage) || 1;
  const currentItems = searchedQueue.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleScan = (e) => {
    e.preventDefault();
    if (!searchRef.trim()) return;

    // Scanners only search the ACTIVE queue for immediate routing
    const activeTests = queue.filter(req => req.status === 'PENDING' || req.status === 'RESULT_ENTERED');
    const exactMatch = activeTests.find(q => q.labReference.toUpperCase() === searchRef.trim().toUpperCase());
    
    if (exactMatch) {
      navigate(`/scientist/enter-result/${exactMatch.labReference}`);
    } else {
      alert("Specimen not found in ACTIVE pending queue.");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-brand-blue flex items-center gap-3">
            <Beaker className="text-brand-orange" /> Laboratory Queue
          </h1>
          <div className="flex items-center gap-2 text-brand-green font-bold text-xs mt-2 uppercase tracking-widest">
            <Activity size={14} className="animate-pulse" /> Live Updates Active
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
            onClick={printWorksheet}
            className="px-6 py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-blue-900 transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
            title="Print A4 Worksheet for the Lab Bench"
          >
            <ClipboardList size={20} /> Print Worksheet
          </button>

          <form onSubmit={handleScan} className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Scan Barcode or Search..." 
              className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-2xl focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 outline-none font-bold text-brand-blue"
              value={searchRef}
              onChange={(e) => {
                setSearchRef(e.target.value);
                setPage(1); 
              }}
            />
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          </form>
        </div>
      </header>

      {/* NEW: TABS FOR ACTIVE VS VERIFIED */}
      <div className="flex gap-2">
        <button 
          onClick={() => { setActiveTab('active'); setPage(1); }}
          className={`px-8 py-3 rounded-xl font-black text-sm transition-all shadow-sm ${
            activeTab === 'active' ? 'bg-brand-blue text-white' : 'bg-white text-gray-400 hover:text-brand-blue'
          }`}
        >
          Pending / Active Tests
        </button>
        <button 
          onClick={() => { setActiveTab('completed'); setPage(1); }}
          className={`px-8 py-3 rounded-xl font-black text-sm transition-all shadow-sm ${
            activeTab === 'completed' ? 'bg-brand-green text-white' : 'bg-white text-gray-400 hover:text-brand-green'
          }`}
        >
          Verified / Printed Results
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>
        ) : currentItems.length === 0 ? (
          <div className="p-20 text-center text-gray-400 font-bold italic">
            {activeTab === 'active' ? 'Queue is currently empty. Waiting for new specimens...' : 'No verified results found.'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
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
                  {currentItems.map(req => {
                    const { day, time } = formatDate(req.createdAt);
                    return (
                      <tr key={req._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-brand-blue">
                            <CalendarDays size={16} className="text-brand-orange" />
                            <div>
                              <p className="font-bold text-sm">{day}</p>
                              <p className="text-[10px] font-black text-gray-400 tracking-widest">{time}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className="font-black text-brand-blue">{req.labReference}</span>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <p className="font-bold text-brand-blue">{req.patient?.firstName} {req.patient?.lastName}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{req.patient?.hospitalNumber}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-black text-brand-orange line-clamp-2">{req.template?.testName}</p>
                          <p className="text-[10px] font-bold text-gray-500 uppercase">{req.template?.category}</p>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                            req.status === 'PENDING' ? 'bg-orange-100 text-brand-orange' : 
                            (req.status === 'VERIFIED' || req.status === 'DELIVERED') ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-brand-blue'
                          }`}>
                            {req.status === 'VERIFIED' && <CheckCircle size={12}/>}
                            {req.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            
                            {/* ACTIVE TAB ACTIONS: Print Barcode & Enter Result */}
                            {activeTab === 'active' && (
                              <>
                                <button 
                                  onClick={() => printBarcode(req.barcodeImage, req.labReference, `${req.patient?.firstName} ${req.patient?.lastName}`)}
                                  className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-200 transition-all shadow-sm"
                                  title="Print Barcode Label"
                                >
                                  <Printer size={18} />
                                </button>
                                <button 
                                  onClick={() => navigate(`/scientist/enter-result/${req.labReference}`)}
                                  className="p-3 bg-brand-blue text-white rounded-xl hover:bg-blue-900 transition-all shadow-sm flex items-center gap-2"
                                  title="Enter Results"
                                >
                                  <ArrowRight size={18} />
                                </button>
                              </>
                            )}

                            {/* COMPLETED TAB ACTIONS: View/Print Verified PDF */}
                            {activeTab === 'completed' && (
                              <button 
                                onClick={() => handleViewPDF(req._id)}
                                disabled={actionLoading === req._id}
                                className="px-4 py-2 bg-brand-green text-white rounded-xl hover:bg-green-700 transition-all shadow-sm flex items-center gap-2 font-bold text-xs disabled:opacity-50"
                                title="Open PDF Report"
                              >
                                {actionLoading === req._id ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                                View PDF
                              </button>
                            )}

                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 border bg-white rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all">
                    <ChevronLeft size={20}/>
                  </button>
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 border bg-white rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all">
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