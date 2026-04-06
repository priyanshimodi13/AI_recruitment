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
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Recruitment Logo" className="h-10 w-auto object-contain" />
              <span className="text-2xl font-bold tracking-tight text-[var(--color-heading)] font-display hidden sm:block">
                Hire<span className="text-[var(--color-accent)]">Vision</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/jobs" className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors font-medium">Job Matches</Link>
              <Link to="/prepare-interview" className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors font-medium">Interview Prep</Link>
              <Link to="/dashboard" className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors font-medium">Dashboard</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <AnimatedThemeToggle
              isDark={isDark}
              onToggle={() => setIsDark(!isDark)}
              className="h-10 w-10 border-none bg-transparent hover:bg-[var(--color-surface-2)]"
            />
            
            <SignedOut>
              <div className="flex items-center gap-4">
                <Link to="/sign-in">
                  <button className="text-[var(--color-text)] hover:text-[var(--color-heading)] transition-colors font-medium">Sign In</button>
                </Link>
                <Link to="/sign-up">
                  <button className="btn-primary py-2 px-5 text-sm">Get Started</button>
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link to="/upload-resume">
                  <button className="btn-secondary py-2 px-5 text-sm">Upload Resume</button>
                </Link>
                <div className="p-1 rounded-full border border-[var(--color-border)]">
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-9 h-9",
                        userButtonTrigger: "focus:shadow-none"
                      }
                    }} 
                  />
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}