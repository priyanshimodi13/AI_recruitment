import { SignUp } from '@clerk/clerk-react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ThreeBackground from '../components/ThreeBackground';

export default function SignUpPage() {
  const formRef = useRef(null);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // GSAP animations
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 40, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.2)'
      }
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center pt-48 pb-32 bg-black relative overflow-hidden">
      <ThreeBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 to-transparent pointer-events-none"></div>
      <div className="w-full max-w-md relative z-20 px-6 mt-10" ref={formRef}>
        <SignUp 
          path="/sign-up" 
          routing="path" 
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              card: "backdrop-blur-2xl border border-lime-400/40 rounded-[2.5rem] shadow-2xl p-6 bg-slate-900/40",
              headerTitle: "text-white font-display font-black italic tracking-tighter text-2xl mb-2",
              headerSubtitle: "text-slate-300 font-medium italic opacity-80",
              socialButtonsBlockButton: "bg-slate-800/60 border border-lime-400/40 text-white hover:bg-slate-800/80 hover:border-lime-400/60 transition-all rounded-2xl py-3 shadow-sm",
              socialButtonsBlockButtonText: "text-slate-200 font-black uppercase text-[9px] tracking-widest",
              dividerLine: "bg-lime-400/20 opacity-40",
              dividerText: "text-slate-400 uppercase text-[9px] font-black tracking-[0.3em] opacity-60",
              formFieldLabel: "text-slate-300 uppercase text-[9px] font-black tracking-widest opacity-70 mb-2",
              formFieldInput: "bg-[#111] border border-lime-400/30 text-white rounded-2xl focus:border-lime-400/60 focus:ring-4 focus:ring-lime-400/10 transition-all py-3 px-4 font-semibold placeholder-slate-500",
              formButtonPrimary: "w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg bg-lime-400 text-black hover:bg-lime-300 active:scale-95 transition-all shadow-lime-400/30",
              footerActionText: "text-slate-400 font-medium italic",
              footerActionLink: "text-lime-400 font-black italic hover:underline ml-1",
              identityPreviewText: "text-white",
              identityPreviewEditButtonIcon: "text-lime-400",
              formField__phoneNumber: "hidden",
              formFieldRow__phoneNumber: "hidden"
            },
            variables: {
              colorPrimary: "#c8f135",
              colorBackground: "#050505",
              colorText: "#ffffff",
              colorInputBackground: "#111111",
              colorInputText: "#ffffff"
            }
          }}
        />
      </div>
    </div>
  );
}