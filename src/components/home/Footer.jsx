import React from 'react';
import { TestTube, HeartPulse, Microscope } from 'lucide-react';

const Services = () => {
  const services = [
    { title: "Routine Checkups", desc: "Comprehensive blood counts, lipid profiles, and metabolic panels.", icon: <HeartPulse size={40} className="text-brand-orange" /> },
    { title: "Advanced Pathology", desc: "Detailed immunoassay, hormonal profiles, and cancer markers.", icon: <Microscope size={40} className="text-brand-green" /> },
    { title: "Microbiology", desc: "Accurate cultures, sensitivities, and parasitic examinations.", icon: <TestTube size={40} className="text-brand-blue" /> }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-brand-blue mb-12">Our Core Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6 flex justify-center">{srv.icon}</div>
              <h3 className="text-xl font-bold text-brand-blue mb-3">{srv.title}</h3>
              <p className="text-gray-600">{srv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;