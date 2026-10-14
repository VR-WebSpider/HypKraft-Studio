import React from 'react';

export const IridescentBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base soft sky/violet tint */}
      <div className="absolute inset-0 bg-[#f5f7fc]" />

      {/* Top Left Cyan Luminous Orb */}
      <div 
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px] opacity-40 mix-blend-multiply"
        style={{ background: 'radial-gradient(circle, #38bdf8 0%, #818cf8 100%)' }}
      />

      {/* Top Right Lavender / Violet Luminous Orb */}
      <div 
        className="absolute top-10 -right-20 w-[550px] h-[550px] rounded-full blur-[130px] opacity-45 mix-blend-multiply"
        style={{ background: 'radial-gradient(circle, #c084fc 0%, #f472b6 100%)' }}
      />

      {/* Center Subtle Pastel Bloom */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[160px] opacity-25 mix-blend-multiply"
        style={{ background: 'radial-gradient(circle, #a5b4fc 0%, #e0e7ff 100%)' }}
      />

      {/* Bottom Floating Rose / Magenta Orb */}
      <div 
        className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full blur-[150px] opacity-35 mix-blend-multiply"
        style={{ background: 'radial-gradient(circle, #f43f5e 0%, #a855f7 100%)' }}
      />

      {/* Subtle fine geometric grid */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};
