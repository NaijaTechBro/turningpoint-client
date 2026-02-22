import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, ShieldCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative w-full bg-brand-blue overflow-hidden min-h-[85vh] flex items-center">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop" 
          alt="Advanced Laboratory" 
          className="w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/95 to-transparent"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-orange/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center justify-between w-full">
        
        {/* Left Content - Global Messaging */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="lg:w-3/5 text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
            <Globe size={16} className="text-brand-orange" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">International Diagnostic Standards</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            World-Class Insights.<br />
            <span className="text-brand-green">Uncompromising Precision.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            Empowering healthcare providers and patients globally with fully automated, state-of-the-art laboratory testing and clinically actionable results in record time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/test-menu" className="px-8 py-4 bg-brand-orange text-white font-bold rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 text-lg">
              Explore Test Menu <ArrowRight size={20} />
            </Link>
            <Link to="/results" className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white hover:text-brand-blue transition-all text-lg backdrop-blur-sm">
              Access Patient Portal
            </Link>
          </div>
        </motion.div>

        {/* Right Content - Floating Trust Badges */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:flex lg:w-2/5 flex-col gap-6 pl-12"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl transform translate-x-8 hover:-translate-x-2 transition-transform duration-500">
            <div className="flex items-center gap-4">
              <div className="bg-brand-green/20 p-3 rounded-xl">
                <Activity className="text-brand-green" size={28} />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Fully Automated</h3>
                <p className="text-gray-400 text-sm">Robotic processing ensures zero human error.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:translate-x-2 transition-transform duration-500">
            <div className="flex items-center gap-4">
              <div className="bg-brand-orange/20 p-3 rounded-xl">
                <ShieldCheck className="text-brand-orange" size={28} />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">ISO Certified</h3>
                <p className="text-gray-400 text-sm">Rigorous global quality assurance controls.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;