import React from 'react';

export const HypKraftLogo: React.FC<{ size?: number; className?: string }> = ({ size = 34, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Official 3D Glassmorphism HypKraft Icon */}
      <img
        src="/hypkraft_logo.png"
        alt="HypKraft"
        style={{ width: size, height: size }}
        className="rounded-xl object-contain shrink-0 drop-shadow-[0_4px_16px_rgba(99,102,241,0.4)] transition-transform duration-300 hover:scale-105"
      />
      
      <span className="font-extrabold text-slate-900 tracking-tight text-xl font-sans">
        Hyp<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500">Kraft</span>
      </span>
    </div>
  );
};
