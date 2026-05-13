'use client';
import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import LoginPage from '../components/UI/gaming-login';

// Final styling integration with HireVision branding (Replaced NexusGate)
export default function SignUpPage() {

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 overflow-hidden font-sans">
            {/* High-Fidelity Video Background remains active with 4px blur */}
            <LoginPage.VideoBackground videoUrl="/18514338-hd_1920_1080_60fps.mp4" />

            <div className="relative z-20 w-full max-w-md animate-fadeIn">
                {/* 
                    Container - Background removed as requested. 
                    Kept only the structure and layout to hold the form elements 
                    directly against the blurred video.
                */}
                <div className="p-8 relative">
                    
                    {/* Header Section - HireVision Image Logo directly on video */}
                    <div className="mb-8 text-center relative z-10">
                        <div className="relative group inline-block mb-4">
                            <span className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-blue-500/30 blur-2xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse"></span>
                            <img 
                                src="/logohirevision.png" 
                                alt="HireVision Logo" 
                                className="relative h-24 md:h-32 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="text-white flex flex-col items-center space-y-1 mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                            <p className="text-xl font-bold relative group cursor-default tracking-tight">
                                <span className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                                <span className="relative animate-pulse">AI-Powered Recruitment Command Center</span>
                            </p>
                            <span className="text-[10px] text-white/70 uppercase tracking-[0.5em] font-black animate-pulse">
                                [Initialize recruitment sequence]
                            </span>
                        </div>
                    </div>

                    {/* Clerk Sign Up Form - Styled for transparency and HireVision branding */}
                    <SignUp
                        path="/sign-up"
                        routing="path"
                        signInUrl="/sign-in"
                        fallbackRedirectUrl="/dashboard"
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "shadow-none bg-transparent border-0 p-0 w-full",
                                header: "hidden",
                                formFieldLabel: "text-white text-[10px] font-black uppercase tracking-[0.2em] mb-2 block drop-shadow-lg",
                                // Darker inputs to ensure readability against the blurred video
                                formFieldInput: "w-full pl-5 pr-4 py-4 bg-black/50 border border-white/20 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-[#d4ff33]/50 transition-all duration-300 text-base backdrop-blur-sm shadow-inner",
                                formButtonPrimary: "w-full py-5 rounded-2xl text-xl font-black uppercase tracking-widest transition-all duration-300 bg-[#d4ff33] text-black shadow-[0_10px_40px_rgba(212,255,51,0.3)] hover:shadow-[0_20px_50px_rgba(212,255,51,0.5)] hover:-translate-y-1 active:scale-95 mt-6 border-0",
                                dividerLine: "bg-white/30",
                                dividerText: "text-[10px] font-black uppercase tracking-[0.4em] text-white/60",
                                socialButtonsBlockButton: "w-full h-14 bg-black/50 border border-white/20 rounded-xl text-white hover:bg-black/70 transition-all mb-4 backdrop-blur-sm group",
                                socialButtonsBlockButtonText: "font-black uppercase tracking-widest text-[10px] text-white",
                                footerActionText: "text-sm text-white/80 font-bold drop-shadow-xl",
                                footerActionLink: "text-[#d4ff33] font-black hover:underline transition-all ml-1",
                                footer: "mt-8 text-center",
                                formFieldAction__password: "text-white/60 hover:text-white transition-colors",
                            },
                            variables: {
                                colorPrimary: "#d4ff33",
                                colorBackground: "transparent",
                                colorText: "#ffffff",
                                fontFamily: "var(--font-sans)",
                            }
                        }}
                    />
                </div>
            </div>

            <footer className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-[9px] z-20 uppercase tracking-[0.6em] font-black pointer-events-none">
                © 2025 HireVision. Advanced Recruitment Systems.
            </footer>
        </div>
    );
}
