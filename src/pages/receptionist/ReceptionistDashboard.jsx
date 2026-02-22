import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Search, UserPlus, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReceptionistDashboard = () => {
  const [latestPatients, setLatestPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatest = async () => {
      // Fetching the 10 most recent registrations
      const { data } = await API.get('/patients?limit=10');
      setLatestPatients(data.data);
    };
    fetchLatest();
  }, []);

  const handleSearch = async (val) => {
    setSearchTerm(val);
    if (val.length > 2) {
      // Global search logic integrated here
      const { data } = await API.get(`/patients/search?q=${val}`);
      setSearchResults(data.data);
    } else setSearchResults([]);
  };

  return (
    <div className="space-y-8">
      {/* Search Engine Section */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative">
        <h2 className="font-black text-brand-blue mb-4">Quick Search</h2>
        <div className="relative">
          <input 
            type="text" value={searchTerm} onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-5 bg-gray-50 rounded-2xl outline-none border focus:border-brand-orange font-bold text-brand-blue"
            placeholder="Search by Hospital ID, Name or Phone..."
          />
          {searchResults.length > 0 && (
            <div className="absolute w-full mt-2 bg-white shadow-2xl rounded-2xl z-50 divide-y overflow-hidden border border-gray-100">
              {searchResults.map(p => (
                <div key={p._id} onClick={() => navigate(`/receptionist/patient-details/${p._id}`)}
                  className="p-5 hover:bg-orange-50 cursor-pointer flex justify-between items-center group">
                  <div>
                    <p className="font-black text-brand-blue group-hover:text-brand-orange transition-colors">{p.firstName} {p.lastName}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{p.hospitalNumber}</p>
                  </div>
                  <button className="bg-brand-blue text-white px-4 py-2 rounded-lg text-xs font-bold">View Profile</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Latest 10 Patients Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-black text-brand-blue">Latest Registrations</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hospital ID</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {latestPatients.map(p => (
              <tr key={p._id} className="hover:bg-gray-50/30 transition-colors">
                <td className="px-8 py-6 font-black text-brand-orange text-sm">{p.hospitalNumber}</td>
                <td className="px-8 py-6 font-bold text-brand-blue">{p.firstName} {p.lastName}</td>
                <td className="px-8 py-6 text-right">
                   <button onClick={() => navigate(`/receptionist/patient-details/${p._id}`)} className="text-brand-blue font-black text-xs hover:underline">Manage Record</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;