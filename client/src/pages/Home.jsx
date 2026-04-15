import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { GlowCard } from '../components/UI/spotlight-card';
import { ShineBorder } from '../components/UI/shine-border';
import { SparkleButton } from '../components/UI/button-8';
import { BorderBeam } from '../components/UI/border-beam';

import {
  CheckCircle2,
  ArrowRight,
  Target,
  Zap,
  Shield,
  BarChart3,
  Cpu,
  Users,
  MessageSquare,
  Sparkles,
  PlayCircle
} from 'lucide-react';
import { HeroActionButton } from '../components/UI/hero-action-button';

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  // If user is already signed in, send them to dashboard
  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="pt-24 space-y-32 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-accent)] opacity-[0.03] blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500 opacity-[0.03] blur-[120px] rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="text-left space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium border-white/10 text-xs font-bold tracking-widest uppercase text-[var(--color-accent)] animate-fade-in shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next Gen AI Career Intelligence</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-display font-bold leading-[1.2] tracking-tight text-[var(--color-heading)] animate-fade-in-up">
              Master Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-[#8b5cf6]">Career Step</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--color-text-muted)] max-w-xl font-medium leading-relaxed opacity-90">
              HireVision connects your unique skills to the world's top job matches and prepares you for the interview with real-time AI coaching.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <SparkleButton to="/sign-up" className="shadow-2xl shadow-blue-500/20">
                Get Started Free <ArrowRight className="w-5 h-5 ml-1" />
              </SparkleButton>
              <HeroActionButton 
                to="/prepare-interview" 
                icon={<PlayCircle className="w-5 h-5" />}
                title="See Demo"
                size="sm"
                className="scale-100"
              />
            </div>

            <div className="flex items-center gap-5 pt-10 border-t border-[var(--color-border)]">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-xl border-2 border-[var(--color-bg)] bg-[var(--color-surface-2)] flex items-center justify-center ring-1 ring-black/5 overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                <span className="text-[var(--color-heading)] font-bold">12,000+</span> professionals growing with us
              </p>
            </div>
          </div>

          <div className="relative group animate-fade-in-right hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 opacity-50 blur-3xl rounded-[40px]"></div>
            <ShineBorder 
              className="!p-1 glass-premium shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] w-full h-full rounded-[32px]"
              borderRadius={32}
              color={["#3b82f6", "#8b5cf6", "#3b82f6"]}
              borderWidth={2}
            >
                <img
                  src="/hero_dashboard.png"
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover rounded-[31px] shadow-inner"
                />
            </ShineBorder>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-heading)] tracking-tight">
              Traditional job hunting is <span className="text-red-500/80">exhausting</span>
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg font-medium max-w-xl mx-auto opacity-80">
              Stop sending generic applications into the void. The old process is broken, we fixed it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: MessageSquare, title: "Recruiter Ghosting", desc: "Never hear back? We use AI to track recruiter activity and optimize your follow-up timing.", color: "red" },
              { icon: Shield, title: "ATS Invisibility", desc: "Your resume might be perfect, but bots can't read it. We optimize your profile for instant discovery.", color: "purple" },
              { icon: Users, title: "Unprepared Moments", desc: "Interviewing is a skill. Practice with AI that mimics the tone and culture of your target company.", color: "blue" }
            ].map((p, i) => (
              <GlowCard key={i} glowColor={p.color} customSize={true} className="w-full card-premium">
                <div className="w-14 h-14 bg-[var(--color-surface-2)] rounded-2xl flex items-center justify-center mb-8 border border-[var(--color-border)] shadow-sm">
                  <p.icon className={`w-7 h-7 ${p.color === 'red' ? 'text-red-500' : p.color === 'purple' ? 'text-purple-500' : 'text-blue-500'}`} />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-heading)] mb-4 tracking-tight">{p.title}</h3>
                <p className="text-[var(--color-text-muted)] font-medium leading-relaxed">{p.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SOLUTION / FEATURES SECTION */}
      <section className="py-32 px-6 glass-premium border-y border-[var(--color-border)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-6">
                <div className="inline-block px-4 py-1.5 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[10px] font-black tracking-[0.2em] uppercase">The Platform</div>
                <h2 className="text-3xl font-display font-bold text-[var(--color-heading)] tracking-tight leading-[1.2]">
                  Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-cyan-500">get hired</span>
                </h2>
                <p className="text-lg text-[var(--color-text-muted)] font-medium">
                  We've built the ultimate toolset for the modern job seeker. Focused, fast, and driven by data.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { title: "AI-Skill Intelligence", desc: "Deep analysis of your profile against 1M+ live job requirements." },
                  { title: "Contextual Applications", desc: "Automated tailoring that maintains your unique voice and personality." },
                  { title: "Behavioral Coaching", desc: "Real-time feedback on your speech, tone, and confidence during mock interviews." }
                ].map((f, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0 border border-[var(--color-accent)]/20 group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all duration-300">
                      <CheckCircle2 className="w-6 h-6 text-[var(--color-accent)] group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[var(--color-heading)] mb-1 tracking-tight">{f.title}</h4>
                      <p className="text-[var(--color-text-muted)] font-medium text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full relative group">
              <div className="absolute -inset-10 bg-gradient-to-br from-[var(--color-accent)]/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-[100px] transition-opacity duration-1000"></div>
              <ShineBorder 
                className="!p-1 glass-premium shadow-2xl w-full h-full bg-[var(--color-surface-2)]/50 rounded-[40px]"
                borderRadius={40}
                color={["#ec4899", "#8b5cf6", "#3b82f6"]}
                borderWidth={2}
              >
                <img src="/resume-analysis.png" alt="Product Demo" className="w-full h-full object-cover rounded-[39px]" />
              </ShineBorder>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section className="py-20 px-6" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-heading)] tracking-tight">
              Simple, transparent <span className="text-[var(--color-accent)]">Value</span>
            </h2>
            <p className="text-[var(--color-text-muted)] font-medium text-lg">Choose the path that fits your career goals.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: "Starter", price: "0", features: ["AI Match Score", "Unlimited Resume Uploads", "Basic Skill Mapping"], cta: "Start Free" },
              { name: "Pro", price: "29", features: ["Everything in Starter", "Interview Coaching (5 sessions)", "ATS Auto-Optimization", "Priority Industry Insights"], cta: "Get Pro Access", recommended: true },
              { name: "Elite", price: "99", features: ["Everything in Pro", "Unlimited Interview Coaching", "Direct Skill Gap Analysis", "1-on-1 Strategy Session"], cta: "Join Elite" }
            ].map((t, i) => (
              <div key={i} className={`card-premium relative overflow-hidden flex flex-col p-10 ${t.recommended ? 'scale-105 border-[var(--color-accent)]/40 ring-4 ring-[var(--color-accent)]/5 shadow-2xl' : ''}`}>
                {t.recommended && (
                  <div className="absolute top-0 right-0 py-2 px-8 bg-gradient-to-r from-[var(--color-accent)] to-purple-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-bl-3xl shadow-lg">
                    Popular
                  </div>
                )}
                <div className="mb-10">
                  <h3 className="text-lg font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-4">{t.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-bold text-[var(--color-heading)] leading-none">${t.price}</span>
                    <span className="text-sm font-bold text-[var(--color-text-muted)]">/mo</span>
                  </div>
                </div>
                <div className="space-y-6 mb-12 flex-grow">
                  {t.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
                      </div>
                      <span className="text-sm font-semibold text-[var(--color-text)]">{f}</span>
                    </div>
                  ))}
                </div>
                <button className={`w-full py-5 rounded-2xl font-black transition-all duration-500 uppercase tracking-widest text-xs ${t.recommended ? 'btn-primary' : 'bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-heading)] hover:bg-[var(--color-border)]'}`}>
                  {t.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto group relative">
          <div className="glass-premium rounded-[48px] p-16 lg:p-24 relative overflow-hidden text-center space-y-10 shadow-2xl border-[var(--color-border)]">
            <BorderBeam size={400} duration={15} delay={9} colorFrom="var(--color-accent)" colorTo="#8b5cf6" borderWidth={3} />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl lg:text-5xl font-display font-bold leading-tight text-[var(--color-heading)] tracking-tight">
                Ready to land your <br/><span className="text-[var(--color-accent)]">dream job?</span>
              </h2>
              <p className="text-lg text-[var(--color-text-muted)] max-w-xl mx-auto font-medium leading-relaxed opacity-80">
                Join 12,000+ professionals already scaling their careers with HireVision. No credit card required.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <SparkleButton to="/sign-up" className="px-12 py-5 text-lg">Get Started Free Now</SparkleButton>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-32 px-6 border-t border-[var(--color-border)] bg-[var(--color-surface-2)]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-24">
          <div className="col-span-2 space-y-8">
            <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform">
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-blue-500/20">
                 <span className="text-white font-black text-xl">H</span>
              </div>
              <span className="text-2xl font-black text-[var(--color-heading)] font-display tracking-tight">HireVision</span>
            </Link>
            <p className="text-[var(--color-text-muted)] text-sm font-medium max-w-xs leading-relaxed opacity-80">
              AI-driven career intelligence to help modern professionals scale faster and achieve their ultimate potential.
            </p>
            <div className="flex items-center gap-5">
               <a href="#" className="w-10 h-10 rounded-xl glass-premium flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-accent)] transition-all"><MessageSquare className="w-5 h-5" /></a>
               <a href="#" className="w-10 h-10 rounded-xl glass-premium flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-accent)] transition-all"><Shield className="w-5 h-5" /></a>
               <a href="#" className="w-10 h-10 rounded-xl glass-premium flex items-center justify-center text-[var(--color-text)] hover:text-[var(--color-accent)] transition-all"><BarChart3 className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h5 className="text-[var(--color-heading)] font-black mb-8 text-xs uppercase tracking-[0.2em]">Product</h5>
            <div className="space-y-5">
              <Link to="/jobs" className="block text-[var(--color-text-muted)] hover:text-[var(--color-accent)] text-sm font-bold transition-colors">Job Marketplace</Link>
              <Link to="/prepare-interview" className="block text-[var(--color-text-muted)] hover:text-[var(--color-accent)] text-sm font-bold transition-colors">AI Interview Coach</Link>
              <Link to="/pricing" className="block text-[var(--color-text-muted)] hover:text-[var(--color-accent)] text-sm font-bold transition-colors">Pricing</Link>
            </div>
          </div>
          <div>
            <h5 className="text-[var(--color-heading)] font-black mb-8 text-xs uppercase tracking-[0.2em]">Company</h5>
            <div className="space-y-5">
              <a href="#" className="block text-[var(--color-text-muted)] hover:text-[var(--color-accent)] text-sm font-bold transition-colors">About Us</a>
              <a href="#" className="block text-[var(--color-text-muted)] hover:text(--color-accent)] text-sm font-bold transition-colors">Research</a>
              <a href="#" className="block text-[var(--color-text-muted)] hover:text-[var(--color-accent)] text-sm font-bold transition-colors">Careers</a>
            </div>
          </div>
          <div>
            <h5 className="text-[var(--color-heading)] font-black mb-8 text-xs uppercase tracking-[0.2em]">Support</h5>
            <div className="space-y-5">
              <a href="#" className="block text-[var(--color-text-muted)] hover:text-[var(--color-accent)] text-sm font-bold transition-colors">Help Center</a>
              <a href="#" className="block text-[var(--color-text-muted)] hover:text-[var(--color-accent)] text-sm font-bold transition-colors">Terms of Service</a>
              <a href="#" className="block text-[var(--color-text-muted)] hover:text-[var(--color-accent)] text-sm font-bold transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-widest">&copy; 2026 HireVision Intelligence Inc. Engineered for the future of talent.</p>
          <div className="flex items-center gap-3 text-xs font-bold text-[var(--color-text-muted)]">
            <span>Built with precision</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]"></div>
            <span>Powered by Llama</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
