import React from "react";

export const GridBackground = ({ children, className = "" }) => {
  return (
    <div className={`min-h-screen w-full bg-[var(--color-bg)] relative overflow-hidden ${className}`}>
      {/* Light Mode / Dark Mode Adaptive Dotted Grid Background */}
      <div
        className="absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(circle, var(--color-accent) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0",
        }}
      />
      {/* Subtle secondary gradient for depth */}
      <div 
        className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, var(--color-accent) 0%, transparent 50%)
          `
        }}
      />
      
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default GridBackground;
