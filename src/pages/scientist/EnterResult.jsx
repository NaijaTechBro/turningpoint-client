// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Save, CheckCircle, ArrowLeft, Loader2, Beaker, AlertCircle } from 'lucide-react';
// import API from '../../services/api';

// const EnterResult = () => {
//   const { labRef } = useParams();
//   const navigate = useNavigate();
//   const [test, setTest] = useState(null);
//   const [results, setResults] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     const fetchTest = async () => {
//       try {
//         const { data } = await API.get(`/test-requests/${labRef}`);
//         setTest(data.data);
//         setResults(data.data.resultData || {}); // Pre-fill if already saved as draft
//       } catch (err) {
//         alert("Invalid Barcode or Reference. Test not found.");
//         navigate('/scientist/dashboard');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTest();
//   }, [labRef, navigate]);

//   const handleSubmit = async (action) => {
//     setSaving(true);
//     try {
//       if (action === 'VERIFY') {
//         // Step 1: Save data first
//         await API.put(`/test-requests/${test._id}/results`, { resultData: results });
//         // Step 2: Verify and lock
//         await API.put(`/test-requests/${test._id}/verify`);
//         alert("Test Verified & Locked! Ready for Receptionist.");
//       } else {
//         // Just Save Draft
//         await API.put(`/test-requests/${test._id}/results`, { resultData: results });
//         alert("Draft Results Saved Successfully.");
//       }
//       navigate('/scientist/dashboard');
//     } catch (err) {
//       alert(err.response?.data?.message || "Submission failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>;
//   if (!test) return null;

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 font-bold hover:text-brand-blue transition-colors">
//         <ArrowLeft size={20} /> Back to Queue
//       </button>

//       <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
//         {/* Header */}
//         <div className="bg-brand-blue p-8 text-white flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-brand-orange">
//               <Beaker size={28} />
//             </div>
//             <div>
//               <h2 className="text-2xl font-black">{test.template.testName}</h2>
//               <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mt-1">
//                 Ref: {test.labReference} | Patient: {test.patient.firstName} {test.patient.lastName}
//               </p>
//             </div>
//           </div>
//           <div className="text-right hidden md:block">
//             <p className="text-[10px] uppercase tracking-widest font-black text-white/50">Current Status</p>
//             <p className="font-bold text-sm text-brand-green">{test.status.replace('_', ' ')}</p>
//           </div>
//         </div>

//         {/* Dynamic Form Data Entry */}
//         <div className="p-10 space-y-8">
//           <div className="bg-orange-50 text-brand-orange p-4 rounded-xl flex items-start gap-3 border border-orange-100">
//             <AlertCircle className="shrink-0 mt-0.5" size={18} />
//             <p className="text-xs font-bold leading-relaxed">
//               Ensure all parameters are double-checked against the analyzer readouts before clicking Verify. Verified results cannot be edited and are immediately available to the front desk.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {test.template.schemaDefinition?.map((field) => (
//               <div key={field.fieldName} className="space-y-2">
//                 <div className="flex justify-between items-end px-1">
//                   <label className="text-xs font-black uppercase text-brand-blue tracking-tight">{field.label}</label>
//                   <span className="text-[10px] font-bold text-gray-400">Range: {field.referenceRange || 'N/A'}</span>
//                 </div>
//                 <div className="relative">
//                   <input 
//                     type="text"
//                     required
//                     className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-blue font-black text-brand-blue text-lg"
//                     value={results[field.fieldName] || ''}
//                     onChange={(e) => setResults({...results, [field.fieldName]: e.target.value})}
//                   />
//                   {field.unit && (
//                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-brand-orange uppercase">
//                       {field.unit}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
            
//             {/* Fallback if template has no schema defined */}
//             {(!test.template.schemaDefinition || test.template.schemaDefinition.length === 0) && (
//               <div className="md:col-span-2 p-10 text-center text-gray-400 font-bold">
//                 No data entry fields defined for this template. Please contact the Administrator.
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
//             <button 
//               disabled={saving || test.status === 'VERIFIED'}
//               onClick={() => handleSubmit('SAVE')}
//               className="flex-1 py-5 bg-gray-100 text-brand-blue rounded-2xl font-black hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               {saving ? <Loader2 className="animate-spin"/> : <><Save size={20}/> Save Draft</>}
//             </button>
//             <button 
//               disabled={saving || test.status === 'VERIFIED'}
//               onClick={() => handleSubmit('VERIFY')}
//               className="flex-1 py-5 bg-brand-green text-white rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               {saving ? <Loader2 className="animate-spin"/> : <><CheckCircle size={20}/> Verify & Finalize</>}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnterResult;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, CheckCircle, ArrowLeft, Loader2, Beaker, AlertCircle } from 'lucide-react';
import API from '../../services/api';

const EnterResult = () => {
  const { labRef } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const { data } = await API.get(`/test-requests/${labRef}`);
        setTest(data.data);
        setResults(data.data.resultData || {}); 
      } catch (err) {
        alert("Invalid Barcode or Reference. Test not found.");
        navigate('/scientist/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [labRef, navigate]);

  const handleSubmit = async (action) => {
    setSaving(true);
    try {
      await API.put(`/test-requests/${test._id}/results`, { resultData: results });
      if (action === 'VERIFY') {
        await API.put(`/test-requests/${test._id}/verify`);
        alert("Test Verified & Locked!");
      } else {
        alert("Draft Results Saved.");
      }
      navigate('/scientist/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>;
  if (!test) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 font-bold hover:text-brand-blue transition-colors">
        <ArrowLeft size={20} /> Back to Queue
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-brand-blue p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-brand-orange">
              <Beaker size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black">{test.template.testName} <span className="text-sm opacity-70">({test.template.testCode})</span></h2>
              <p className="text-xs font-bold text-brand-orange uppercase tracking-widest mt-1">
                Ref: {test.labReference} | Patient: {test.patient.firstName} {test.patient.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Form Data Entry */}
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {test.template.schemaDefinition?.map((field) => (
              <div key={field.fieldName} className="space-y-2">
                <div className="flex justify-between items-end px-1">
                  <label className="text-xs font-black uppercase text-brand-blue tracking-tight">{field.label}</label>
                  <span className="text-[10px] font-bold text-gray-400">Range: {field.referenceRange || 'N/A'}</span>
                </div>
                
                <div className="relative">
                  {/* --- MAGIC RENDERER: Input vs Select --- */}
                  {field.inputType === 'select' ? (
                    <select
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-blue font-bold text-brand-blue appearance-none"
                      value={results[field.fieldName] || ''}
                      onChange={(e) => setResults({...results, [field.fieldName]: e.target.value})}
                      required
                    >
                      <option value="" disabled>Select Result...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type={field.inputType === 'number' ? 'number' : 'text'}
                      step={field.inputType === 'number' ? 'any' : undefined}
                      required
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-brand-blue font-black text-brand-blue text-lg"
                      value={results[field.fieldName] || ''}
                      onChange={(e) => setResults({...results, [field.fieldName]: e.target.value})}
                    />
                  )}
                  {/* Unit Label */}
                  {field.unit && field.inputType !== 'select' && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-brand-orange uppercase">
                      {field.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-100">
            <button disabled={saving || test.status === 'VERIFIED'} onClick={() => handleSubmit('SAVE')} className="flex-1 py-5 bg-gray-100 text-brand-blue rounded-2xl font-black hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="animate-spin"/> : <><Save size={20}/> Save Draft</>}
            </button>
            <button disabled={saving || test.status === 'VERIFIED'} onClick={() => handleSubmit('VERIFY')} className="flex-1 py-5 bg-brand-green text-white rounded-2xl font-black shadow-xl shadow-green-100 hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="animate-spin"/> : <><CheckCircle size={20}/> Verify & Finalize</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterResult;