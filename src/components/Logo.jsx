import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 60 Q 25 30 50 35" stroke="#228B22" strokeWidth="6" strokeLinecap="round" fill="transparent" />
        <path d="M50 85 C 50 85 15 55 15 35 C 15 20 30 15 40 25 C 50 35 50 35 50 35 C 50 35 50 35 60 25 C 70 15 85 20 85 35 C 85 55 50 85 50 85 Z" fill="#FF6B35" />
        <rect x="44" y="32" width="12" height="26" rx="2" fill="#FFFFFF" />
        <rect x="37" y="39" width="26" height="12" rx="2" fill="#FFFFFF" />
      </svg>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-brand-orange leading-none">Turning Point</span>
        <span className="text-[10px] text-brand-green tracking-[0.2em] uppercase font-bold mt-1">HEALTH</span>
        {/* <span className="text-[10px] font-bold text-brand-orange leading-none"> SERVICES</span> */}
      </div>
    </div>
  );
};

export default Logo;