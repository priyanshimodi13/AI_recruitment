import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(77,255,255,0.4)]">
                <span className="text-black font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-display">
                Nexus<span className="text-[var(--color-accent)]">AI</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link to="/jobs" className="text-gray-300 hover:text-[var(--color-accent)] transition-colors font-medium">Job Matches</Link>
              <Link to="/prepare-interview" className="text-gray-300 hover:text-[var(--color-accent)] transition-colors font-medium">Interview Prep</Link>
              <Link to="/dashboard" className="text-gray-300 hover:text-[var(--color-accent)] transition-colors font-medium">Dashboard</Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <SignedOut>
              <div className="flex items-center gap-4">
                <Link to="/sign-in">
                  <button className="text-gray-300 hover:text-white transition-colors font-medium">Sign In</button>
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
                <div className="p-1 rounded-full border border-white/10">
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