import React, { useEffect } from 'react';
import Hero from './animated-shader-hero';

export default function HeroSplashScreen({ onFinish }) {
 useEffect(() => {
  // Automatically dismiss the splash screen after 5 seconds if not clicked
  const timer = setTimeout(() => {
   onFinish();
  }, 5000);

  return () => clearTimeout(timer);
 }, [onFinish]);

 return (
  <div className="fixed inset-0 z-50">
   <Hero
    trustBadge={{
     text: "Powered by AI Recruitment",
     icons: ["✨", "🚀"]
    }}
    headline={{
     line1: "Hire Vision",
     line2: "Future of Recruitment"
    }}
    subtitle="Supercharge your hiring process with AI-driven analytics, resume matching, and intelligent interviews."
    buttons={{
     primary: {
      text: "Enter Platform",
      onClick: onFinish
     }
    }}
   />
  </div>
 );
}
