import React from 'react';
import { SignIn, useSignIn } from '@clerk/clerk-react';
import LoginPage from '../components/UI/gaming-login';

export default function SignInPage() {
 return (
  <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12 overflow-hidden">
   {/* Video Background */}
   <LoginPage.VideoBackground videoUrl="/18514338-hd_1920_1080_60fps.mp4" />

   {/* Clerk SignIn overlaid in the gaming-styled card layout */}
   <div className="relative z-20 w-full max-w-md">
    <div className="p-10 rounded-[2.5rem] backdrop-blur-xl bg-black/60 border border-white/10 shadow-2xl"
     style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
     {/* Header */}
     <div className="mb-10 text-center">
      <h2 className="text-4xl font-bold mb-3 tracking-tighter uppercase">
       <span className="text-white">HIRE </span>
       <span className="text-lime-400">VISION</span>
      </h2>
      <p className="text-white/60 text-sm font-medium mb-1">Your professional future awaits</p>
      <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">[Sign in to continue]</p>
     </div>

     {/* Clerk Sign In Form */}
     <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/dashboard"
      appearance={{
       elements: {
        card: "shadow-none bg-transparent border-0 p-0",
        headerTitle: "hidden",
        headerSubtitle: "hidden",
        logoBox: "hidden",
        socialButtonsBlockButton: "flex items-center justify-center p-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 hover:border-lime-400/40 transition-all duration-300 w-full",
        socialButtonsBlockButtonText: "text-[11px] font-bold uppercase tracking-widest text-white",
        socialButtonsBlockButtonArrow: "hidden",
        dividerLine: "bg-white/20",
        dividerText: "text-[10px] font-bold uppercase tracking-[0.3em] text-white/60",
        formFieldLabel: "text-[10px] font-bold uppercase tracking-widest text-white/70 mb-2",
        formFieldInput: "w-full pl-4 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-lime-400/60 transition-all duration-300 text-sm font-medium",
        formButtonPrimary: "w-full py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 bg-lime-400 text-black hover:bg-white shadow-xl shadow-lime-400/10",
        footerActionText: "text-xs text-white/40 font-medium",
        footerActionLink: "text-xs font-bold text-white hover:text-lime-400 transition-colors uppercase tracking-widest ml-1",
        identityPreviewText: "text-white",
        identityPreviewEditButtonIcon: "text-lime-400",
        formField__phoneNumber: "hidden",
        formFieldRow__phoneNumber: "hidden",
        footer: "mt-6",
        formFieldInputShowPasswordButton: "text-white/40 hover:text-white",
        alert: "bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs",
       },
       variables: {
        colorPrimary: "#c8f135",
        colorBackground: "#0a0a0a",
        colorText: "#ffffff",
        colorTextSecondary: "rgba(255,255,255,0.7)",
        colorNeutral: "#ffffff",
        colorInputBackground: "rgba(255,255,255,0.08)",
        colorInputText: "#ffffff",
        borderRadius: "0.75rem",
       }
      }}
     />
    </div>
   </div>

   <footer className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-xs z-20 uppercase tracking-widest font-bold">
    © 2025 Hire Vision. All rights reserved.
   </footer>
  </div>
 );
}
