import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-32 bg-[var(--color-bg)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent pointer-events-none"></div>
      <div className="w-full max-w-md animate-fade-in-up relative z-10 px-6">
        <SignIn 
          path="/sign-in" 
          routing="path" 
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              card: "glass-premium border-white/10 rounded-[2.5rem] shadow-2xl p-4",
              headerTitle: "text-[var(--color-heading)] font-display font-black italic tracking-tighter text-4xl mb-2",
              headerSubtitle: "text-[var(--color-text-muted)] font-medium italic opacity-70",
              socialButtonsBlockButton: "bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-heading)] hover:bg-[var(--color-surface)] hover:border-[var(--color-accent)]/30 transition-all rounded-2xl py-3 shadow-sm",
              socialButtonsBlockButtonText: "text-[var(--color-text-muted)] font-black uppercase text-[9px] tracking-widest",
              dividerLine: "bg-[var(--color-border)] opacity-30",
              dividerText: "text-[var(--color-text-muted)] uppercase text-[9px] font-black tracking-[0.3em] opacity-40",
              formFieldLabel: "text-[var(--color-text-muted)] uppercase text-[9px] font-black tracking-widest opacity-60 mb-2",
              formFieldInput: "bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-heading)] rounded-2xl focus:border-[var(--color-accent)]/30 focus:ring-4 focus:ring-[var(--color-accent)]/5 transition-all py-3 font-semibold",
              formButtonPrimary: "btn-primary w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/10 active:scale-95 transition-all",
              footerActionText: "text-[var(--color-text-muted)] font-medium italic",
              footerActionLink: "text-[var(--color-accent)] font-black italic hover:underline ml-1",
              identityPreviewText: "text-[var(--color-heading)]",
              identityPreviewEditButtonIcon: "text-[var(--color-accent)]",
              formField__phoneNumber: "hidden",
              formFieldRow__phoneNumber: "hidden"
            },
            variables: {
              colorPrimary: "#6EC6C6",
              colorBackground: "transparent",
              colorText: "#D4D4E0"
            }
          }}
        />
      </div>
    </div>
  );
}