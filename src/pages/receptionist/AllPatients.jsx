import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Edit, ChevronLeft, ChevronRight, Loader2, UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // If there is a search query, use the search endpoint; otherwise, use paginated list
      const endpoint = searchQuery 
        ? `/patients/search?q=${searchQuery}&page=${page}&limit=20` 
        : `/patients?page=${page}&limit=20`;
      
      const { data } = await API.get(endpoint);
      setPatients(data.data);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-black text-brand-blue">Patient Directory</h2>
        <Link to="/receptionist/register" className="bg-brand-orange text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">
          <UserPlus size={18} /> New Registration
        </Link>
      </div>

      {/* Search Bar Component */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm">
        <Search className="text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="Filter by Name, Hospital ID, or Phone..."
          className="flex-1 outline-none font-medium text-brand-blue"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // Reset to first page on new search
          }}
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center flex-col items-center gap-4">
            <Loader2 className="animate-spin text-brand-orange" size={40} />
            <p className="text-gray-400 font-bold animate-pulse">Retrieving Records...</p>
          </div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hospital ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patients.length > 0 ? (
                  patients.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6 font-black text-brand-orange text-sm">{p.hospitalNumber}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue font-bold text-xs">
                             {p.firstName[0]}{p.lastName[0]}
                           </div>
                           <span className="font-bold text-brand-blue">{p.firstName} {p.lastName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-gray-500 text-sm font-medium">{p.phone}</td>
                      <td className="px-8 py-6 text-right space-x-2">
                        <button 
                          onClick={() => navigate(`/receptionist/patient-details/${p._id}`)} 
                          className="p-2 hover:bg-gray-100 text-gray-400 hover:text-brand-blue rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <UserCircle size={20} />
                        </button>
                        <button 
                          onClick={() => navigate(`/receptionist/edit-patient/${p._id}`)} 
                          className="p-2 hover:bg-gray-100 text-gray-400 hover:text-brand-orange rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => navigate(`/receptionist/order-test/${p._id}`)} 
                          className="ml-2 px-4 py-2 bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-900 transition-all"
                        >
                          Order Test
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-20 text-center text-gray-400 font-medium italic">
                      No patients found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
              <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 border bg-white rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
                ><ChevronLeft size={20}/></button>
                <button 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 border bg-white rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
                ><ChevronRight size={20}/></button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllPatients;