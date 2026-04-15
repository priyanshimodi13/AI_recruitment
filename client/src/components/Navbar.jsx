import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Moon, Sun } from 'lucide-react';
import { AnimatedThemeToggle } from './UI/animated-theme-toggle';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 glass-premium rounded-2xl mx-auto max-w-7xl">
      <div className="px-6 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 bg-blue-500 opacity-20 blur-lg rounded-full animate-pulse"></div>
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-blue-500 relative z-10 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--color-heading)] font-display">
                Hire<span className="text-[var(--color-accent)]">Vision</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {[
                { label: 'Marketplace', path: '/jobs' },
                { label: 'AI Coach', path: '/prepare-interview' },
                { label: 'Dashboard', path: '/dashboard' }
              ].map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-accent)] transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-accent)] group-hover:w-full transition-all duration-300 rounded-full"></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-6 w-[1px] bg-[var(--color-border)] mx-2 hidden sm:block"></div>
            <AnimatedThemeToggle
              isDark={isDark}
              onToggle={() => setIsDark(!isDark)}
              className="h-9 w-9 rounded-xl hover:bg-[var(--color-surface-2)] transition-colors"
            />
            
            <SignedOut>
              <div className="flex items-center gap-3">
                <Link to="/sign-in" className="text-sm font-bold text-[var(--color-text)] hover:text-[var(--color-heading)] transition-colors px-3">Sign In</Link>
                <Link to="/sign-up">
                  <button className="btn-primary py-2 px-5 text-sm rounded-xl">Get Started</button>
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-3">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 rounded-xl",
                      userButtonTrigger: "focus:shadow-none hover:scale-105 transition-transform"
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