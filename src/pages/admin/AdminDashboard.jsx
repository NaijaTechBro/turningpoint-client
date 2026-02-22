import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Trash2, UserCog, Mail, Loader2 } from 'lucide-react';
import API from '../../services/api';
import AddStaffModal from '../../components/admin/AddStaffModal';
import EditStaffModal from '../../components/admin/EditStaffModal';

const AdminDashboard = () => {
  const { user } = useAuth();
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

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>;

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-blue">Personnel Roster</h2>
          <p className="text-gray-500 font-medium mt-1">Manage system access and staff roles.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="bg-brand-blue text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-900 shadow-xl shadow-blue-100 transition-all active:scale-95">
          <UserPlus size={18} className="text-brand-orange" /> Register New Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Employee</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {staff.map((member) => (
              <tr key={member._id} className="hover:bg-gray-50/30 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-brand-blue text-sm leading-tight">{member.firstName} {member.lastName}</span>
                    <span className="text-gray-400 text-[10px] flex items-center gap-1 font-bold mt-1"><Mail size={12}/> {member.email}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                    member.role === 'Admin' ? 'bg-orange-100 text-brand-orange' : 
                    member.role === 'LabScientist' ? 'bg-blue-100 text-brand-blue' : 'bg-green-100 text-brand-green'
                  }`}>
                    {member.role.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className={`flex items-center gap-2 font-black text-[9px] uppercase tracking-widest ${
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
                      className="p-2.5 bg-gray-50 hover:bg-brand-blue hover:text-white text-gray-400 rounded-xl transition-all"
                      title="Edit Profile"
                    >
                      <UserCog size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(member._id, member.firstName)}
                      disabled={member._id === user?._id}
                      className="p-2.5 bg-gray-50 hover:bg-red-500 hover:text-white text-red-400 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-gray-50 disabled:hover:text-red-400"
                      title={member._id === user?._id ? "Cannot delete yourself" : "Delete Staff"}
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