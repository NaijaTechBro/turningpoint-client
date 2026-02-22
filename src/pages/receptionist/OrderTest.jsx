// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ShoppingCart, Search, Trash2, CreditCard, ChevronRight, Beaker } from 'lucide-react';
// import API from '../../services/api';

// const OrderTest = () => {
//   const { patientId } = useParams();
//   const navigate = useNavigate();
//   const [patient, setPatient] = useState(null);
//   const [templates, setTemplates] = useState([]); // Real templates from your DB
//   const [selectedTests, setSelectedTests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 1. Get Patient Details
//         const patientRes = await API.get(`/patients/${patientId}`);
//         setPatient(patientRes.data.data);

//         // 2. Get available Test Templates (Imaging, Cardiac, etc.)
//         const templateRes = await API.get('/templates'); 
//         setTemplates(templateRes.data.data);
//       } catch (err) {
//         console.error("Initialization failed");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [patientId]);

//   const toggleTest = (template) => {
//     const isSelected = selectedTests.find(t => t._id === template._id);
//     if (isSelected) {
//       setSelectedTests(selectedTests.filter(t => t._id !== template._id));
//     } else {
//       setSelectedTests([...selectedTests, template]);
//     }
//   };

//   const handleProcessOrder = async () => {
//     if (selectedTests.length === 0) return alert("Please select at least one test.");
    
//     try {
//       // We loop through selected tests to create individual requests as per your backend
//       for (const test of selectedTests) {
//         await API.post('/test-requests', {
//           patientId: patient._id,
//           template: test._id // Pass the template ID to trigger backend logic
//         });
//       }
      
//       alert("All test requisitions generated successfully!");
//       navigate('/receptionist/dashboard');
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to process requisition");
//     }
//   };

//   if (loading) return <div className="p-20 text-center font-black animate-pulse">Initializing Requisition...</div>;

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-160px)]">
//       {/* Left: Service Selection */}
//       <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 flex flex-col overflow-hidden shadow-sm">
//         <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
//           <div>
//             <h2 className="text-xl font-black text-brand-blue uppercase tracking-tight">Diagnostic Catalog</h2>
//             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Select required services for clinical analysis</p>
//           </div>
//         </div>
        
//         <div className="flex-1 overflow-y-auto p-8 space-y-3">
//           {templates.map(test => (
//             <div 
//               key={test._id}
//               onClick={() => toggleTest(test)}
//               className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group ${
//                 selectedTests.find(t => t._id === test._id) 
//                 ? 'border-brand-orange bg-orange-50 shadow-md' 
//                 : 'border-transparent bg-gray-50 hover:bg-blue-50/50'
//               }`}
//             >
//               <div className="flex items-center gap-4">
//                 <div className={`p-3 rounded-xl ${selectedTests.find(t => t._id === test._id) ? 'bg-brand-orange text-white' : 'bg-white text-brand-blue'}`}>
//                   <Beaker size={20} />
//                 </div>
//                 <div>
//                   <p className="font-black text-brand-blue">{test.testName}</p>
//                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{test.category}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                  <p className="font-black text-brand-blue">₦{test.basePrice?.toLocaleString() || '0.00'}</p>
//                  {selectedTests.find(t => t._id === test._id) && <span className="text-[9px] font-black text-brand-orange uppercase">Selected</span>}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right: Summary & Patient Card */}
//       <div className="flex flex-col gap-6">
//         <div className="bg-brand-blue rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
//           <div className="relative z-10">
//             <h3 className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-4">Requisition For</h3>
//             <p className="text-2xl font-black">{patient.firstName} {patient.lastName}</p>
//             <p className="text-brand-orange font-bold text-sm tracking-widest">{patient.hospitalNumber}</p>
//           </div>
//           <div className="absolute -right-4 -bottom-4 opacity-10">
//             <ShoppingCart size={140} />
//           </div>
//         </div>

//         <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col">
//           <h3 className="text-brand-blue font-black uppercase tracking-tight text-sm mb-6 pb-4 border-b">Requisition Summary</h3>
//           <div className="flex-1 space-y-4 overflow-y-auto pr-2">
//             {selectedTests.map(test => (
//               <div key={test._id} className="flex justify-between items-center group animate-in fade-in slide-in-from-right-2">
//                 <div className="text-xs font-bold text-gray-600">
//                   <p>{test.testName}</p>
//                   <button onClick={() => toggleTest(test)} className="text-[9px] text-red-400 uppercase font-black hover:underline">Remove Item</button>
//                 </div>
//                 <p className="text-xs font-black text-brand-blue">₦{test.basePrice?.toLocaleString() || '0.00'}</p>
//               </div>
//             ))}
//             {selectedTests.length === 0 && (
//               <div className="h-full flex flex-col items-center justify-center text-center p-10">
//                 <ShoppingCart className="text-gray-100 mb-2" size={48} />
//                 <p className="text-gray-300 italic text-sm">Selection is empty.</p>
//               </div>
//             )}
//           </div>

//           <div className="mt-8 pt-6 border-t border-gray-200">
//             <div className="flex justify-between items-center mb-6">
//               <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Estimated Total</span>
//               <span className="text-2xl font-black text-brand-blue">
//                 ₦{selectedTests.reduce((sum, t) => sum + (t.basePrice || 0), 0).toLocaleString()}
//               </span>
//             </div>
//             <button 
//               onClick={handleProcessOrder}
//               disabled={selectedTests.length === 0}
//               className="w-full py-5 bg-brand-orange text-white rounded-2xl font-black shadow-xl shadow-orange-100 flex items-center justify-center gap-3 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Generate Lab Reference <ChevronRight size={20}/>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderTest;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClipboardList, Trash2, ChevronRight, Beaker, Loader2 } from 'lucide-react';
import API from '../../services/api';

const OrderTest = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientRes = await API.get(`/patients/${patientId}`);
        setPatient(patientRes.data.data);

        const templateRes = await API.get('/templates'); 
        setTemplates(templateRes.data.data);
      } catch (err) {
        console.error("Initialization failed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  const toggleTest = (template) => {
    const isSelected = selectedTests.find(t => t._id === template._id);
    if (isSelected) {
      setSelectedTests(selectedTests.filter(t => t._id !== template._id));
    } else {
      setSelectedTests([...selectedTests, template]);
    }
  };

  const handleProcessOrder = async () => {
    if (selectedTests.length === 0) return alert("Please select at least one test.");
    
    try {
      for (const test of selectedTests) {
        await API.post('/test-requests', {
          patientId: patient._id,
          template: test._id 
        });
      }
      alert("Test requisitions generated successfully!");
      navigate('/receptionist/test-orders');
    } catch (err) {
      alert(err.response?.data?.message || "Failed to process requisition");
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-brand-blue animate-pulse flex justify-center"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-160px)]">
      {/* Left: Service Selection */}
      <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 flex flex-col overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div>
            <h2 className="text-xl font-black text-brand-blue uppercase tracking-tight">Diagnostic Catalog</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Select required services</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-3">
          {templates.map(test => (
            <div 
              key={test._id}
              onClick={() => toggleTest(test)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center group ${
                selectedTests.find(t => t._id === test._id) 
                ? 'border-brand-orange bg-orange-50 shadow-md' 
                : 'border-transparent bg-gray-50 hover:bg-blue-50/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${selectedTests.find(t => t._id === test._id) ? 'bg-brand-orange text-white' : 'bg-white text-brand-blue'}`}>
                  <Beaker size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black text-brand-blue">{test.testName}</p>
                    <span className="bg-gray-200 text-gray-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{test.testCode}</span>
                  </div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter mt-1">{test.category}</p>
                </div>
              </div>
              <div className="text-right">
                 {selectedTests.find(t => t._id === test._id) && <span className="text-[10px] font-black text-brand-orange uppercase flex items-center gap-1"><CheckCircle size={14}/> Selected</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Summary & Patient Card */}
      <div className="flex flex-col gap-6">
        <div className="bg-brand-blue rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-4">Requisition For</h3>
            <p className="text-2xl font-black">{patient.firstName} {patient.lastName}</p>
            <p className="text-brand-orange font-bold text-sm tracking-widest mt-1">{patient.hospitalNumber}</p>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-brand-blue font-black uppercase tracking-tight text-sm mb-6 pb-4 border-b">Selected Tests</h3>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {selectedTests.map(test => (
              <div key={test._id} className="flex justify-between items-center group animate-in fade-in slide-in-from-right-2 bg-gray-50 p-3 rounded-xl">
                <div className="text-xs font-bold text-brand-blue">
                  <p>{test.testName}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest">{test.testCode}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleTest(test); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {selectedTests.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-10">
                <ClipboardList className="text-gray-200 mb-2" size={48} />
                <p className="text-gray-400 font-bold italic text-sm">No tests selected.</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
              onClick={handleProcessOrder}
              disabled={selectedTests.length === 0}
              className="w-full py-5 bg-brand-orange text-white rounded-2xl font-black shadow-xl shadow-orange-100 flex items-center justify-center gap-3 hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Dispatch to Lab <ChevronRight size={20}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTest;