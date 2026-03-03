// import React, { useState, useEffect } from 'react';
// import { Plus, Trash2, Save, Loader2, ListPlus, Settings2, Beaker } from 'lucide-react';
// import API from '../../services/api';

// const TemplateManager = () => {
//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // Core Basic Info
//   const [testCode, setTestCode] = useState('');
//   const [testName, setTestName] = useState('');
//   const [category, setCategory] = useState('Pathology');
  
//   // Dynamic Schema Builder State
//   const [schemaDefinition, setSchemaDefinition] = useState([
//     { label: '', fieldName: '', inputType: 'text', unit: '', referenceRange: '', options: '' }
//   ]);

//   const fetchTemplates = async () => {
//     try {
//       const { data } = await API.get('/templates');
//       setTemplates(data.data);
//     } catch (err) {
//       console.error("Failed to load templates");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchTemplates(); }, []);

//   const addField = () => {
//     setSchemaDefinition([...schemaDefinition, { label: '', fieldName: '', inputType: 'text', unit: '', referenceRange: '', options: '' }]);
//   };

//   const removeField = (index) => {
//     const newSchema = [...schemaDefinition];
//     newSchema.splice(index, 1);
//     setSchemaDefinition(newSchema);
//   };

//   const handleFieldChange = (index, key, value) => {
//     const newSchema = [...schemaDefinition];
//     newSchema[index][key] = value;
    
//     // Auto-generate the camelCase fieldName from the Label (e.g., "White Blood Cells" -> "whiteBloodCells")
//     if (key === 'label') {
//       newSchema[index].fieldName = value.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, idx) => {
//         return idx === 0 ? word.toLowerCase() : word.toUpperCase();
//       }).replace(/\s+/g, '');
//     }
//     setSchemaDefinition(newSchema);
//   };

//   const handleCreateTemplate = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       // Clean up the payload before sending
//       const cleanedSchema = schemaDefinition.map(field => {
//         const cleanField = { ...field };
//         // Convert comma-separated string into an array for 'select' inputs
//         if (cleanField.inputType === 'select') {
//           cleanField.options = cleanField.options ? cleanField.options.split(',').map(opt => opt.trim()) : [];
//         } else {
//           delete cleanField.options; // Don't send options if it's just a text/number input
//         }
//         return cleanField;
//       });

//       await API.post('/templates', { 
//         testCode: testCode.toUpperCase(), 
//         testName, 
//         category, 
//         schemaDefinition: cleanedSchema 
//       });
      
//       alert("Template Created Successfully!");
      
//       // Reset Form
//       setTestCode(''); setTestName(''); setCategory('Pathology'); 
//       setSchemaDefinition([{ label: '', fieldName: '', inputType: 'text', unit: '', referenceRange: '', options: '' }]);
//       fetchTemplates();
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to create template");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("WARNING: Deleting this template removes it from the catalog. Existing patient records will not be deleted. Proceed?")) {
//       try {
//         await API.delete(`/templates/${id}`);
//         fetchTemplates();
//       } catch (err) {
//         alert("Delete failed");
//       }
//     }
//   };

//   return (
//     <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-160px)]">
//       {/* Left: Template Engine Form */}
//       <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
//         <div className="bg-brand-blue p-8 text-white">
//           <h2 className="text-xl font-black flex items-center gap-3">
//             <Settings2 className="text-brand-orange" /> LIS Template Engine
//           </h2>
//           <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">Configure diagnostic parameters & inputs</p>
//         </div>

//         <form onSubmit={handleCreateTemplate} className="p-8 space-y-6 flex-1 overflow-y-auto">
//           <div className="grid grid-cols-3 gap-4">
//             <div className="col-span-1">
//               <label className="text-[10px] font-black uppercase text-gray-400">Test Code</label>
//               <input type="text" required value={testCode} onChange={e => setTestCode(e.target.value)} placeholder="e.g. FBC" className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue font-black text-brand-orange uppercase" />
//             </div>
//             <div className="col-span-2">
//               <label className="text-[10px] font-black uppercase text-gray-400">Test Name</label>
//               <input type="text" required value={testName} onChange={e => setTestName(e.target.value)} placeholder="Full Blood Count" className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue font-bold text-brand-blue" />
//             </div>
//           </div>
          
//           <div>
//             <label className="text-[10px] font-black uppercase text-gray-400">Department / Category</label>
//             <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue font-bold text-brand-blue">
//               <option value="Pathology">Pathology</option>
//               <option value="Chemical Pathology">Chemical Pathology</option>
//               <option value="Microbiology">Microbiology</option>
//               <option value="Serology">Serology</option>
//               <option value="Parasitology">Parasitology</option>
//               <option value="Imaging">Imaging</option>
//             </select>
//           </div>

//           <div className="border-t border-gray-100 pt-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-black text-brand-blue">Parameter Configuration</h3>
//               <button type="button" onClick={addField} className="text-[10px] font-black uppercase tracking-widest text-brand-orange flex items-center gap-1 hover:bg-orange-50 px-3 py-2 rounded-lg transition-colors">
//                 <Plus size={14} /> Add Parameter
//               </button>
//             </div>

//             <div className="space-y-6">
//               {schemaDefinition.map((field, index) => (
//                 <div key={index} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative shadow-sm">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <div>
//                       <label className="text-[9px] font-black uppercase text-gray-400 mb-1 block">Display Label</label>
//                       <input type="text" required placeholder="e.g. Fasting Sugar" value={field.label} onChange={e => handleFieldChange(index, 'label', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-brand-blue text-sm font-bold text-brand-blue" />
//                     </div>
//                     <div>
//                       <label className="text-[9px] font-black uppercase text-gray-400 mb-1 block">Input Type</label>
//                       <select value={field.inputType} onChange={e => handleFieldChange(index, 'inputType', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-brand-blue text-sm font-bold text-brand-blue">
//                         <option value="text">Text (Alphanumeric)</option>
//                         <option value="number">Number (Quantitative)</option>
//                         <option value="select">Dropdown (Qualitative)</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {field.inputType === 'select' ? (
//                       <div className="md:col-span-2">
//                         <label className="text-[9px] font-black uppercase text-brand-orange mb-1 block">Dropdown Options (Comma separated)</label>
//                         <input type="text" required placeholder="e.g. Negative, 1:20, 1:40, 1:80" value={field.options} onChange={e => handleFieldChange(index, 'options', e.target.value)} className="w-full p-3 bg-white border border-orange-200 rounded-lg outline-none focus:border-brand-orange text-sm font-medium" />
//                       </div>
//                     ) : (
//                       <>
//                         <div>
//                           <label className="text-[9px] font-black uppercase text-gray-400 mb-1 block">Unit</label>
//                           <input type="text" placeholder="e.g. mg/dl" value={field.unit} onChange={e => handleFieldChange(index, 'unit', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm font-medium" />
//                         </div>
//                         <div>
//                           <label className="text-[9px] font-black uppercase text-gray-400 mb-1 block">Reference Range</label>
//                           <input type="text" placeholder="e.g. 70 - 100" value={field.referenceRange} onChange={e => handleFieldChange(index, 'referenceRange', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm font-medium" />
//                         </div>
//                       </>
//                     )}
//                   </div>

//                   {schemaDefinition.length > 1 && (
//                     <button type="button" onClick={() => removeField(index)} className="absolute -top-3 -right-3 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full transition-all shadow-md">
//                       <Trash2 size={14} />
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <button type="submit" disabled={saving} className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black shadow-xl flex justify-center items-center gap-2 hover:bg-blue-900 transition-all mt-8">
//             {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Deploy Configuration</>}
//           </button>
//         </form>
//       </div>

//       {/* Right: Active Catalog View */}
//       <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
//         <div className="p-8 border-b border-gray-50 bg-gray-50/50">
//           <h2 className="text-xl font-black text-brand-blue">Active Catalog</h2>
//           <p className="text-xs text-gray-500 font-medium mt-1">Currently live on the Receptionist Dashboard</p>
//         </div>
        
//         {loading ? (
//            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>
//         ) : (
//           <div className="flex-1 overflow-y-auto p-8 space-y-4">
//             {templates.length === 0 ? (
//               <div className="text-center p-10 text-gray-400">
//                 <ListPlus size={48} className="mx-auto mb-4 opacity-20" />
//                 <p className="font-bold italic">No templates configured yet.</p>
//               </div>
//             ) : (
//               templates.map(test => (
//                 <div key={test._id} className="p-5 bg-white border border-gray-100 hover:border-brand-blue/30 rounded-2xl flex justify-between items-center group transition-colors shadow-sm">
//                   <div className="flex items-center gap-4">
//                     <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-brand-orange">
//                       <Beaker size={20} />
//                     </div>
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <h3 className="font-black text-brand-blue">{test.testName}</h3>
//                         <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{test.testCode}</span>
//                       </div>
//                       <div className="flex items-center gap-2 mt-1">
//                         <span className="text-[10px] font-bold text-brand-orange uppercase">{test.category}</span>
//                         <span className="text-xs text-gray-400 font-bold">• {test.schemaDefinition?.length || 0} Parameters</span>
//                       </div>
//                     </div>
//                   </div>
//                   <button onClick={() => handleDelete(test._id)} className="p-3 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100">
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TemplateManager;


import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Loader2, ListPlus, Settings2, Beaker } from 'lucide-react';
import API from '../../services/api';

const TemplateManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Core Basic Info
  const [testCode, setTestCode] = useState('');
  const [testName, setTestName] = useState('');
  const [category, setCategory] = useState('Pathology');
  const [price, setPrice] = useState(''); // <-- NEW: Price State
  
  // Dynamic Schema Builder State
  const [schemaDefinition, setSchemaDefinition] = useState([
    { label: '', fieldName: '', inputType: 'text', unit: '', referenceRange: '', options: '' }
  ]);

  const fetchTemplates = async () => {
    try {
      const { data } = await API.get('/templates');
      setTemplates(data.data);
    } catch (err) {
      console.error("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  const addField = () => {
    setSchemaDefinition([...schemaDefinition, { label: '', fieldName: '', inputType: 'text', unit: '', referenceRange: '', options: '' }]);
  };

  const removeField = (index) => {
    const newSchema = [...schemaDefinition];
    newSchema.splice(index, 1);
    setSchemaDefinition(newSchema);
  };

  const handleFieldChange = (index, key, value) => {
    const newSchema = [...schemaDefinition];
    newSchema[index][key] = value;
    
    if (key === 'label') {
      newSchema[index].fieldName = value.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, idx) => {
        return idx === 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
    }
    setSchemaDefinition(newSchema);
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanedSchema = schemaDefinition.map(field => {
        const cleanField = { ...field };
        if (cleanField.inputType === 'select') {
          cleanField.options = cleanField.options ? cleanField.options.split(',').map(opt => opt.trim()) : [];
        } else {
          delete cleanField.options;
        }
        return cleanField;
      });

      // <-- NEW: Include Price in the Payload -->
      await API.post('/templates', { 
        testCode: testCode.toUpperCase(), 
        testName, 
        category, 
        price: Number(price), 
        schemaDefinition: cleanedSchema 
      });
      
      alert("Template Created Successfully!");
      
      setTestCode(''); setTestName(''); setCategory('Pathology'); setPrice('');
      setSchemaDefinition([{ label: '', fieldName: '', inputType: 'text', unit: '', referenceRange: '', options: '' }]);
      fetchTemplates();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create template");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("WARNING: Deleting this template removes it from the catalog. Existing patient records will not be deleted. Proceed?")) {
      try {
        await API.delete(`/templates/${id}`);
        fetchTemplates();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-160px)]">
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="bg-brand-blue p-8 text-white">
          <h2 className="text-xl font-black flex items-center gap-3">
            <Settings2 className="text-brand-orange" /> LIS Template Engine
          </h2>
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest mt-1">Configure diagnostic parameters & inputs</p>
        </div>

        <form onSubmit={handleCreateTemplate} className="p-8 space-y-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="text-[10px] font-black uppercase text-gray-400">Test Code</label>
              <input type="text" required value={testCode} onChange={e => setTestCode(e.target.value)} placeholder="e.g. FBC" className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue font-black text-brand-orange uppercase" />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-black uppercase text-gray-400">Test Name</label>
              <input type="text" required value={testName} onChange={e => setTestName(e.target.value)} placeholder="Full Blood Count" className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue font-bold text-brand-blue" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400">Department / Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue font-bold text-brand-blue">
                <option value="Pathology">Pathology</option>
                <option value="Chemical Pathology">Chemical Pathology</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Serology">Serology</option>
                <option value="Parasitology">Parasitology</option>
                <option value="Imaging">Imaging</option>
              </select>
            </div>
            
            {/* <-- NEW: PRICE INPUT BOX --> */}
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400">Price (₦)</label>
              <input 
                type="number" 
                required 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                placeholder="e.g. 5000" 
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-blue font-black text-brand-blue" 
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-brand-blue">Parameter Configuration</h3>
              <button type="button" onClick={addField} className="text-[10px] font-black uppercase tracking-widest text-brand-orange flex items-center gap-1 hover:bg-orange-50 px-3 py-2 rounded-lg transition-colors">
                <Plus size={14} /> Add Parameter
              </button>
            </div>

            <div className="space-y-6">
              {schemaDefinition.map((field, index) => (
                <div key={index} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-[9px] font-black uppercase text-gray-400 mb-1 block">Display Label</label>
                      <input type="text" required placeholder="e.g. Fasting Sugar" value={field.label} onChange={e => handleFieldChange(index, 'label', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-brand-blue text-sm font-bold text-brand-blue" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-gray-400 mb-1 block">Input Type</label>
                      <select value={field.inputType} onChange={e => handleFieldChange(index, 'inputType', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-brand-blue text-sm font-bold text-brand-blue">
                        <option value="text">Text (Alphanumeric)</option>
                        <option value="number">Number (Quantitative)</option>
                        <option value="select">Dropdown (Qualitative)</option>
                        <option value="textarea">Large Textbox (e.g. X-Ray Report)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {field.inputType === 'select' ? (
                      <div className="md:col-span-2">
                        <label className="text-[9px] font-black uppercase text-brand-orange mb-1 block">Dropdown Options (Comma separated)</label>
                        <input type="text" required placeholder="e.g. Negative, 1:20, 1:40, 1:80" value={field.options} onChange={e => handleFieldChange(index, 'options', e.target.value)} className="w-full p-3 bg-white border border-orange-200 rounded-lg outline-none focus:border-brand-orange text-sm font-medium" />
                      </div>
                    ) : field.inputType === 'textarea' ? (
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-400 italic">This parameter will render as a large, multi-line text box.</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="text-[9px] font-black uppercase text-gray-400 mb-1 block">Unit</label>
                          <input type="text" placeholder="e.g. mg/dl" value={field.unit} onChange={e => handleFieldChange(index, 'unit', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm font-medium" />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase text-gray-400 mb-1 block">Reference Range</label>
                          <input type="text" placeholder="e.g. 70 - 100" value={field.referenceRange} onChange={e => handleFieldChange(index, 'referenceRange', e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-lg outline-none text-sm font-medium" />
                        </div>
                      </>
                    )}
                  </div>

                  {schemaDefinition.length > 1 && (
                    <button type="button" onClick={() => removeField(index)} className="absolute -top-3 -right-3 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full transition-all shadow-md">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black shadow-xl flex justify-center items-center gap-2 hover:bg-blue-900 transition-all mt-8">
            {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Deploy Configuration</>}
          </button>
        </form>
      </div>

      {/* Right: Active Catalog View */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/50">
          <h2 className="text-xl font-black text-brand-blue">Active Catalog</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">Currently live on the Receptionist Dashboard</p>
        </div>
        
        {loading ? (
           <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-brand-orange" size={40} /></div>
        ) : (
          <div className="flex-1 overflow-y-auto p-8 space-y-4">
            {templates.length === 0 ? (
              <div className="text-center p-10 text-gray-400">
                <ListPlus size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold italic">No templates configured yet.</p>
              </div>
            ) : (
              templates.map(test => (
                <div key={test._id} className="p-5 bg-white border border-gray-100 hover:border-brand-blue/30 rounded-2xl flex justify-between items-center group transition-colors shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-brand-orange">
                      <Beaker size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-brand-blue">{test.testName}</h3>
                        <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{test.testCode}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-brand-orange uppercase">{test.category}</span>
                        {/* <-- NEW: Displays Price in the list --> */}
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded">₦{test.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(test._id)} className="p-3 text-gray-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateManager;