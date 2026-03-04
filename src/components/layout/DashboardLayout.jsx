

// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { LogOut, LayoutDashboard, Users, UserPlus, ClipboardList, Beaker, UserCog, Settings2 } from 'lucide-react';

// const DashboardLayout = ({ children, title }) => {
//   const { user, logout } = useAuth();

//   // Dynamically set the sidebar links based on the user's role
//   const getNavItems = () => {
//     if (user?.role === 'LabScientist') {
//       return [
//         { to: "/scientist/dashboard", icon: <Beaker size={20}/>, label: "Lab Queue" },
//       ];
//     }
    
//     let items = [];

//     // Both Receptionist and Admin get these front-desk links
//     if (user?.role === 'Receptionist' || user?.role === 'Admin') {
//       items.push(
//         { to: "/receptionist/dashboard", icon: <LayoutDashboard size={20}/>, label: "Overview" },
//         { to: "/receptionist/patients", icon: <Users size={20}/>, label: "All Patients" },
//         { to: "/receptionist/register", icon: <UserPlus size={20}/>, label: "Registration" },
//         { to: "/receptionist/test-orders", icon: <ClipboardList size={20}/>, label: "Test Orders" }
//       );
//     }
    
//     // ONLY the Admin gets these system configuration links
//     if (user?.role === 'Admin') {
//       items.push(
//         { to: "/admin/dashboard", icon: <UserCog size={20}/>, label: "Personnel Hub" },
//         { to: "/admin/templates", icon: <Settings2 size={20}/>, label: "Template Engine" }
//       );
//     }
    
//     return items;
//   };

//   const navItems = getNavItems();

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
//       <aside className="w-64 bg-brand-blue text-white flex flex-col p-6 shadow-2xl z-20">
//         <div className="text-xl font-black mb-10 text-brand-orange">TURNING POINT</div>
        
//         <nav className="flex-grow space-y-2 overflow-y-auto hide-scrollbar">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.to}
//               to={item.to}
//               className={({ isActive }) => 
//                 `flex items-center gap-3 w-full p-4 rounded-xl transition-all ${
//                   isActive ? 'bg-white/10 text-brand-orange font-bold' : 'hover:bg-white/5 text-white/70 font-medium'
//                 }`
//               }
//             >
//               {item.icon} {item.label}
//             </NavLink>
//           ))}
//         </nav>

//         <button onClick={logout} className="flex items-center gap-3 text-white/50 hover:text-white pt-6 border-t border-white/10 font-bold uppercase text-xs tracking-widest mt-auto">
//           <LogOut size={18} /> Sign Out
//         </button>
//       </aside>

//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0">
//           <h1 className="text-xl font-black text-brand-blue">{title}</h1>
//           <div className="flex items-center gap-4">
//             <div className="text-right">
//               <p className="text-sm font-bold text-brand-blue leading-none">{user?.firstName} {user?.lastName}</p>
//               <p className="text-[10px] font-bold text-brand-green uppercase tracking-tighter mt-1">{user?.role}</p>
//             </div>
//             <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-black uppercase shadow-md">
//               {user?.firstName?.[0]}
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;


import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Users, UserPlus, ClipboardList, Beaker, UserCog, Settings2 } from 'lucide-react';

const DashboardLayout = ({ children, title }) => {
  const { user, logout } = useAuth();

  // Dynamically set the sidebar links based on the user's role
  const getNavItems = () => {
    let items = [];

    // 1. FRONT DESK (Receptionist & Admin)
    if (['Receptionist', 'Admin'].includes(user?.role)) {
      items.push(
        { to: "/receptionist/dashboard", icon: <LayoutDashboard size={20}/>, label: "Overview" },
        { to: "/receptionist/patients", icon: <Users size={20}/>, label: "All Patients" },
        { to: "/receptionist/register", icon: <UserPlus size={20}/>, label: "Registration" },
        { to: "/receptionist/test-orders", icon: <ClipboardList size={20}/>, label: "Test Orders" }
      );
    }

    // 2. LABORATORY ROLES (All 3 Lab Roles & Admin)
    if (['LabScientist', 'Sonographer', 'LabTechnician', 'Admin'].includes(user?.role)) {
      items.push(
        { to: "/scientist/dashboard", icon: <Beaker size={20}/>, label: "Lab Queue" },
        { to: "/admin/templates", icon: <Settings2 size={20}/>, label: "Template Engine" }
      );
    }
    
    // 3. SYSTEM ADMINISTRATION (Admin Only)
    if (user?.role === 'Admin') {
      items.push(
        { to: "/admin/dashboard", icon: <UserCog size={20}/>, label: "Personnel Hub" }
      );
    }
    
    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <aside className="w-64 bg-brand-blue text-white flex flex-col p-6 shadow-2xl z-20 shrink-0">
        <div className="text-xl font-black mb-10 text-brand-orange">TURNING POINT</div>
        
        <nav className="flex-grow space-y-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center gap-3 w-full p-4 rounded-xl transition-all ${
                  isActive ? 'bg-white/10 text-brand-orange font-bold' : 'hover:bg-white/5 text-white/70 font-medium'
                }`
              }
            >
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        <button onClick={logout} className="flex items-center gap-3 text-white/50 hover:text-white pt-6 border-t border-white/10 font-bold uppercase text-xs tracking-widest mt-auto transition-colors">
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 shrink-0">
          <h1 className="text-xl font-black text-brand-blue">{title}</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-brand-blue leading-none">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] font-bold text-brand-green uppercase tracking-tighter mt-1">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white font-black uppercase shadow-md">
              {user?.firstName?.[0]}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;