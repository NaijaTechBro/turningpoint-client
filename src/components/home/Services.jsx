import React from 'react';
import { Microscope, Activity, ScanLine, Stethoscope, CheckCircle2 } from 'lucide-react';

const Services = () => {
  const serviceCategories = [
    {
      title: "Imaging",
      icon: <ScanLine size={40} className="text-brand-orange" />,
      color: "bg-orange-50",
      items: ["CT-Scan & MRI", "Mammogram", "3D/4D Coloured Ultrasound", "Digital X-Ray"]
    },
    {
      title: "Cardiac & Endoscopy",
      icon: <Activity size={40} className="text-brand-green" />,
      color: "bg-green-50",
      items: ["ECHO, ECG & EEG", "Cardiac Stress Test", "24-Hour BP Monitoring", "Endoscopy"]
    },
    {
      title: "Advanced Pathology",
      icon: <Microscope size={40} className="text-brand-blue" />,
      color: "bg-blue-50",
      items: ["Biochemistry & Immunology", "DNA Sequencer", "Automated Microbiology", "Haematology & Histopathology", "Clinical Molecular Biology", "Blood Banking"]
    },
    {
      title: "Specialized Services",
      icon: <Stethoscope size={40} className="text-brand-orange" />,
      color: "bg-orange-50",
      items: ["Instant Reporting", "Comprehensive Health Check-up", "Dentistry", "Ambulance & Dispatch Services", "Overseas Second Medical Opinion"]
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-brand-orange font-bold tracking-widest uppercase text-sm mb-3">Our Expertise</h2>
          <h3 className="text-4xl font-extrabold text-brand-blue mb-4">
            Comprehensive Medical Solutions
          </h3>
          <p className="text-xl text-gray-600 italic">
            "... providing the care you need."
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceCategories.map((category, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Category Header */}
              <div className={`${category.color} p-8 flex flex-col items-center border-b border-gray-100`}>
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  {category.icon}
                </div>
                <h4 className="text-xl font-bold text-brand-blue text-center">{category.title}</h4>
              </div>
              
              {/* Service List */}
              <div className="p-6">
                <ul className="space-y-4">
                  {category.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-brand-green shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium text-sm leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;