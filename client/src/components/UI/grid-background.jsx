import React from "react";

export const GridBackground = ({ children, className = "" }) => {
 return (
  <div className={`min-h-screen w-full bg-[var(--color-bg)] relative overflow-hidden ${className}`}>


   
   <div className="relative z-10 w-full min-h-screen">
    {children}
   </div>
  </div>
 );
};

export default GridBackground;
