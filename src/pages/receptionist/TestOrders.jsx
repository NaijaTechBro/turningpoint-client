import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, FileText, Send, Loader2, ClipboardX, Search } from 'lucide-react';
import API from '../../services/api';

const TestOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // New search state
  
  // Track loading states for individual buttons
  const [actionLoading, setActionLoading] = useState({ id: null, action: null });

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/test-requests/all');
      setOrders(data.data);
    } catch (err) {
      console.error("Failed to fetch test orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  const handleViewPDF = async (id, labReference) => {
    setActionLoading({ id, action: 'pdf' });
    try {
      const response = await API.get(`/test-requests/${id}/pdf`, {
        responseType: 'blob',
      });
      
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (err) {
      alert("Failed to securely load the PDF. Make sure it is verified.");
    } finally {
      setActionLoading({ id: null, action: null });
    }
  };

  const handleSendEmail = async (id) => {
    setActionLoading({ id, action: 'email' });
    try {
      await API.post(`/test-requests/${id}/send-report`);
      alert("Success: Report securely emailed to the patient!");
      fetchOrders(); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send email. Please check server logs.");
    } finally {
      setActionLoading({ id: null, action: null });
    }
  };

  // Real-time filtering logic
  const filteredOrders = orders.filter(order => {
    const search = searchTerm.toLowerCase();
    const fullName = `${order.patient?.firstName} ${order.patient?.lastName}`.toLowerCase();
    const labRef = order.labReference.toLowerCase();
    const hospNum = order.patient?.hospitalNumber?.toLowerCase() || '';
    const testName = order.template?.testName?.toLowerCase() || '';

    return fullName.includes(search) || 
           labRef.includes(search) || 
           hospNum.includes(search) || 
           testName.includes(search);
  });

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black text-brand-blue">Global Requisition Track</h2>
        
        {/* Search Bar */}
        <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm w-full md:w-96">
          <Search className="text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search Name, Lab Ref, or Test..."
            className="flex-1 outline-none font-medium text-brand-blue text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ClipboardX size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-bold text-lg">No Test Orders Found</p>
          <p className="text-gray-400 text-sm mt-1">When a requisition is created, it will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Lab Ref</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Test</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-black text-brand-blue text-sm">{order.labReference}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-brand-blue">{order.patient?.firstName} {order.patient?.lastName}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.patient?.hospitalNumber}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-bold text-brand-blue">{order.template?.testName}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'VERIFIED' ? 'bg-green-100 text-green-600' : 
                        order.status === 'DELIVERED' ? 'bg-blue-100 text-brand-blue' : 'bg-orange-100 text-brand-orange'
                      }`}>
                        {order.status === 'VERIFIED' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                        {order.status.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'VERIFIED' && (
                          <>
                            <button 
                              onClick={() => handleViewPDF(order._id, order.labReference)}
                              disabled={actionLoading.id === order._id}
                              className="px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-blue-900 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                              {actionLoading.id === order._id && actionLoading.action === 'pdf' 
                                ? <Loader2 size={14} className="animate-spin"/> 
                                : <FileText size={14}/>}
                              View PDF
                            </button>
                            <button 
                              onClick={() => handleSendEmail(order._id)}
                              disabled={actionLoading.id === order._id}
                              className="px-4 py-2 bg-brand-orange text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                              {actionLoading.id === order._id && actionLoading.action === 'email' 
                                ? <Loader2 size={14} className="animate-spin"/> 
                                : <Send size={14}/>}
                              Email
                            </button>
                          </>
                        )}
                        {order.status === 'DELIVERED' && (
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-2 bg-gray-50 rounded-lg">
                            Delivered
                          </span>
                        )}
                        {order.status !== 'VERIFIED' && order.status !== 'DELIVERED' && (
                          <span className="text-[10px] font-bold text-gray-400 italic">
                            Pending Results
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400 font-bold italic">
                    No matching test orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestOrders;