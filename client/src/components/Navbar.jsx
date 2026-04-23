import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Force dark styling on html for the whole site whenever the app loads now that we have a dark theme
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = '#000000';
    document.documentElement.style.color = '#ffffff';

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled || !isHomePage 
          ? 'bg-black/90 backdrop-blur-md border-b border-[#333333] py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="w-full px-6 sm:px-12 mx-auto" style={{ maxWidth: 'min(1200px, 90vw)' }}>
        <div className="flex items-center justify-between h-10">
          
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3">
              <span 
                className="text-2xl font-light tracking-wide text-white font-display uppercase hover:opacity-70 transition-opacity"
                style={{ fontFamily: "'Jost', sans-serif" }}
              >
                Hire <span style={{ fontWeight: 400, color: '#c8f135' }}>Vision</span>
              </span>
            </Link>
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8 ml-8">
              {[
                { label: 'Jobs', path: '/jobs' },
                { label: 'AI Coach', path: '/prepare-interview' },
                { label: 'Dashboard', path: '/dashboard' }
              ].map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="text-xs uppercase tracking-widest font-light text-[#a3a3a3] hover:text-white transition-all duration-300 relative group"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            <SignedOut>
              <div className="flex items-center gap-6">
                <Link 
                  to="/sign-in" 
                  className="text-xs uppercase tracking-widest font-light text-[#a3a3a3] hover:text-white transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Sign In
                </Link>
                <Link to="/sign-up">
                  <button 
                    className="px-6 py-2 text-xs uppercase tracking-widest font-normal text-black bg-[#c8f135] rounded-full hover:bg-white hover:scale-105 transition-all duration-300"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-3">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 rounded-full border border-[#333333]",
                      userButtonTrigger: "focus:shadow-none hover:opacity-80 transition-opacity"
                    }
                  }} 
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}