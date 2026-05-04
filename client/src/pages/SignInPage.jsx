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
            <h2 className="text-4xl font-black mb-3 tracking-tighter italic uppercase">
              <span className="text-white">HIRE </span>
              <span className="text-lime-400">VISION</span>
            </h2>
            <p className="text-white/60 text-sm font-medium mb-1">Your professional future awaits</p>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">[Sign in to continue]</p>
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
                socialButtonsBlockButton: "flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 hover:text-white hover:border-lime-400/30 transition-all duration-300 w-full",
                socialButtonsBlockButtonText: "text-[10px] font-black uppercase tracking-widest text-white/80",
                socialButtonsBlockButtonArrow: "hidden",
                dividerLine: "bg-white/10",
                dividerText: "text-[10px] font-black uppercase tracking-[0.3em] text-white/30",
                formFieldLabel: "text-[10px] font-black uppercase tracking-widest text-white/50 mb-2",
                formFieldInput: "w-full pl-4 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-lime-400/50 transition-all duration-300 text-sm",
                formButtonPrimary: "w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 bg-lime-400 text-black hover:bg-white shadow-xl shadow-lime-400/10",
                footerActionText: "text-xs text-white/40 font-medium",
                footerActionLink: "text-xs font-black text-white hover:text-lime-400 transition-colors uppercase tracking-widest ml-1",
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
                colorBackground: "transparent",
                colorText: "#ffffff",
                colorInputBackground: "transparent",
                colorInputText: "#ffffff",
                borderRadius: "0.75rem",
              }
            }}
          />
        </div>
      </div>

      <footer className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-xs z-20 uppercase tracking-widest font-black">
        © 2025 Hire Vision. All rights reserved.
      </footer>
    </div>
  );
}