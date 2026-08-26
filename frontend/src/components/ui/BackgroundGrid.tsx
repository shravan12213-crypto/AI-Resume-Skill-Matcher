// frontend/src/components/ui/BackgroundGrid.tsx
import React from 'react';

export const BackgroundGrid: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Radial Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl opacity-70" />
      
      {/* Subtle Dot Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      
      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-indigo-950/20 blur-3xl opacity-50" />
    </div>
  );
};
