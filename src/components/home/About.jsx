import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const About = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Image Grid */}
        <div className="lg:w-1/2 relative">
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=800&auto=format&fit=crop" alt="Scientist" className="rounded-2xl shadow-lg w-full h-64 object-cover" />
            <img src="https://images.unsplash.com/photo-1582719478250-c89404bb8a0e?q=80&w=800&auto=format&fit=crop" alt="Microscope" className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8" />
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 text-center">
            <span className="block text-4xl font-extrabold text-brand-orange mb-1">10+</span>
            <span className="text-sm font-bold text-brand-blue uppercase tracking-wider">Years of<br/>Excellence</span>
          </div>
        </div>

        {/* Right Text */}
        <div className="lg:w-1/2">
          <h2 className="text-brand-orange font-bold tracking-widest uppercase text-sm mb-3">About Turning Point</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-brand-blue mb-6 leading-tight">
            Redefining Diagnostic Accuracy on a Global Scale.
          </h3>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            We merge brilliant scientific minds with the world's most advanced analytical equipment. Whether you are a local patient or an international corporate partner, we guarantee rapid turnaround times without sacrificing a microscopic detail of accuracy.
          </p>
          
          <div className="space-y-4">
            {['Next-Generation Sequencing & Molecular Diagnostics', 'Real-time digital result delivery via encrypted portal', 'Strict adherence to international laboratory protocols'].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="text-brand-green mt-1 shrink-0" size={20} />
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;