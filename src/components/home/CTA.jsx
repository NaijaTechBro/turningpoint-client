import React from 'react';

const CTA = () => {
  return (
    <section className="relative py-20 bg-brand-orange overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,100 C30,50 70,50 100,0 L100,100 Z" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
          Ready to experience the Turning Point difference?
        </h2>
        <p className="text-orange-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Walk into our facility today or securely access your existing results from our cloud portal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-brand-orange font-bold rounded-xl hover:bg-gray-100 shadow-xl transition-all text-lg">
            Download Patient App
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;