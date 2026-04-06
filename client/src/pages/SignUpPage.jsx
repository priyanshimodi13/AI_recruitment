import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center py-20 bg-[var(--color-bg)]">
      <div className="w-full max-w-md animate-fade-in-up">
        <SignUp 
          path="/sign-up" 
          routing="path" 
          signInUrl="/sign-in"
          afterSignUpUrl="/dashboard"
          appearance={{
            elements: {
              card: "glass border-white/10 rounded-3xl",
              headerTitle: "text-white font-display italic tracking-tight text-3xl",
              headerSubtitle: "text-gray-500 italic",
              socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all rounded-xl",
              socialButtonsBlockButtonText: "text-gray-300 font-medium",
              dividerLine: "bg-white/5",
              dividerText: "text-gray-600 uppercase text-[10px] font-bold tracking-[0.2em]",
              formFieldLabel: "text-gray-500 uppercase text-[10px] font-bold tracking-widest",
              formFieldInput: "bg-black/40 border-white/5 text-white rounded-xl focus:border-[var(--color-accent)]/30",
              formButtonPrimary: "btn-primary w-full py-4 rounded-xl",
              footerActionText: "text-gray-500",
              footerActionLink: "text-[var(--color-accent)] hover:underline",
              formField__phoneNumber: "hidden",
              formFieldRow__phoneNumber: "hidden"
            },
            variables: {
              colorPrimary: "#6EC6C6",
              colorBackground: "#181824",
              colorText: "#D4D4E0"
            }
          }}
        />
      </div>
    </div>
  );
}