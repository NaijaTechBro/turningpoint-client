

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, LogOut, UserPlus, Trash2, UserCog, Mail } from 'lucide-react';
import API from '../../services/api';
import AddStaffModal from '../../components/admin/AddStaffModal';
import EditStaffModal from '../../components/admin/EditStaffModal'; // New Import

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const fetchStaff = async () => {
    try {
      const { data } = await API.get('/users');
      setStaff(data.data);
    } catch (err) {
      console.error("Error fetching staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  // --- DELETE LOGIC ---
  const handleDelete = async (staffId, name) => {
    if (window.confirm(`Permanently remove ${name} from the system?`)) {
      try {
        await API.delete(`/users/${staffId}`);
        fetchStaff(); // Refresh list after deletion
      } catch (err) {
        alert(err.response?.data?.message || "Could not delete user");
      }
    }
  };

  // --- EDIT TRIGGER ---
  const handleEditClick = (member) => {
    setSelectedStaff(member);
    setIsEditOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Kept static) */}
      <aside className="w-64 bg-brand-blue text-white flex flex-col fixed h-full shadow-2xl">
        <div className="p-8 text-2xl font-black border-b border-white/5 text-center">
          Turning<span className="text-brand-orange">Point</span>
        </div>
        <nav className="flex-grow p-4 mt-6">
          <div className="flex items-center gap-3 bg-white/10 text-white w-full p-4 rounded-xl font-bold border border-white/10 cursor-pointer">
            <Users size={20} className="text-brand-orange" /> Staff Directory
          </div>
        </nav>
        <button onClick={logout} className="m-6 flex items-center gap-3 text-gray-400 hover:text-white transition-colors font-bold uppercase text-xs tracking-widest">
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-brand-blue tracking-tight">Personnel Hub</h1>
            <p className="text-gray-500 font-medium tracking-tight">System Administrator: {user?.firstName}</p>
          </div>
          <button onClick={() => setIsAddOpen(true)} className="bg-brand-blue text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-brand-blue/90 shadow-xl transition-all active:scale-95">
            <UserPlus size={20} className="text-brand-orange" /> Register New Staff
          </button>
        </header>

        {/* Staff Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Employee</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {staff.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-blue text-lg leading-tight">{member.firstName} {member.lastName}</span>
                      <span className="text-gray-400 text-xs flex items-center gap-1 font-medium italic"><Mail size={12}/> {member.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm ${
                      member.role === 'Admin' ? 'bg-orange-100 text-brand-orange' : 
                      member.role === 'LabScientist' ? 'bg-blue-100 text-brand-blue' : 'bg-green-100 text-brand-green'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest ${
                      member.status === 'active' ? 'text-brand-green' : 'text-red-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-brand-green animate-pulse' : 'bg-red-400'}`}></div>
                      {member.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(member)}
                        className="p-2.5 bg-gray-50 hover:bg-brand-blue hover:text-white text-brand-blue rounded-xl transition-all"
                      >
                        <UserCog size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(member._id, member.firstName)}
                        disabled={member._id === user?._id}
                        className="p-2.5 bg-gray-50 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all disabled:opacity-30"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modals */}
      <AddStaffModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onRefresh={fetchStaff} />
      <EditStaffModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        onRefresh={fetchStaff} 
        staffMember={selectedStaff} 
      />
    </div>
  );
};

export default AdminDashboard;