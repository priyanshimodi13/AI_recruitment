import React from 'react';
import { Link } from 'react-router-dom';
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
  return (
    <div className="pt-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24 px-6">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)] opacity-5 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 opacity-5 blur-[120px] rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-sm font-medium text-[var(--color-accent)] animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Next Gen AI Career Intelligence</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight text-white animate-fade-in-up">
              Master Your Next <span className="text-[var(--color-accent)]">Career Step</span> with AI
            </h1>

            <p className="text-xl md:text-2xl text-[var(--color-text-muted)] max-w-2xl mx-auto font-light leading-relaxed">
              HireVision connects your skills to the world's top job matches and prepares you for the interview with real-time coaching.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <SparkleButton to="/sign-up">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </SparkleButton>
              <HeroActionButton 
                to="/prepare-interview" 
                icon={<PlayCircle />}
                title="See How It Works"
                size="sm"
                className="scale-90 origin-left"
              />
            </div>

            <div className="flex items-center gap-4 pt-8 border-t border-white/5">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--color-bg)] bg-gray-800 flex items-center justify-center text-xs font-bold ring-1 ring-white/5 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                <span className="text-white font-semibold">12,000+</span> professionals already scaling their careers
              </p>
            </div>
          </div>

          <div className="relative group animate-fade-in-right">
            <div className="absolute inset-0 bg-blue-400 opacity-20 blur-[80px] rounded-full group-hover:opacity-30 transition-opacity"></div>
            <ShineBorder 
              className="!p-1 bg-[#1A1A1A]/80 glass shadow-2xl w-full h-full"
              borderRadius={16}
              color={["#3b82f6", "#ec4899", "#8b5cf6"]}
              borderWidth={2}
            >
              <img
                src="/hero_dashboard.png"
                alt="AI Platform Dashboard"
                className="w-full h-full object-cover rounded-xl"
              />
            </ShineBorder>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl font-display font-bold text-white">Traditional job hunting is <span className="text-red-400">broken</span></h2>
            <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">
              Applying to 100+ jobs and never hearing back? That's the old way.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MessageSquare, title: "Recruiter Ghosting", desc: "Never hear back? We use AI to track recruiter activity and optimize follow-up timing.", color: "red" },
              { icon: Shield, title: "Keyword Mismatch", desc: "Your resume might be perfect, but Applicant Tracking Systems (ATS) can't see it without the right keywords.", color: "purple" },
              { icon: Users, title: "Blind Interviews", desc: "Going into interviews with zero practice is a recipe for nerves and missed opportunities.", color: "blue" }
            ].map((p, i) => (
              <GlowCard key={i} glowColor={p.color} customSize={true} className="w-full">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-white/30 transition-colors">
                  <p.icon className={`w-6 h-6 ${p.color === 'red' ? 'text-red-400' : p.color === 'purple' ? 'text-purple-400' : 'text-blue-400'}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{p.title}</h3>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{p.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SOLUTION / FEATURES */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="text-center max-w-2xl mx-auto space-y-6 mb-20 relative z-10">
              <div className="inline-block px-3 py-1 rounded bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-bold tracking-widest uppercase">The HireVision Solution</div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-heading)] italic tracking-tight text-white">
                Everything you need to <span className="text-[var(--color-accent)]">land the job</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: "AI-Skill Mapping", desc: "We map your actual skills to the precise requirements of job listings." },
                  { title: "One-Click Context Apply", desc: "Tailor every single application in seconds, not hours." },
                  { title: "Real-time Mock Interviews", desc: "Practice with an AI that mimics the tone of specific companies." }
                ].map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[var(--color-accent)] shrink-0" />
                    <div>
                      <h4 className="text-white font-bold mb-1">{f.title}</h4>
                      <p className="text-sm text-[var(--color-text-muted)]">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full relative">
              <div className="absolute -inset-10 bg-[var(--color-accent)] opacity-5 blur-[100px] rounded-full"></div>
              <ShineBorder 
                className="!p-1 glass shadow-2xl w-full h-full bg-[#1A1A1A]/80"
                borderRadius={16}
                color={["#ec4899", "#8b5cf6", "#3b82f6"]}
                borderWidth={2}
              >
                <img src="/feature_demo.png" alt="Product Demo" className="w-full h-full object-cover rounded-xl" />
              </ShineBorder>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section className="py-32 px-6" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white">Simple, transparent <span className="text-[var(--color-accent)]">Value</span></h2>
            <p className="text-[var(--color-text-muted)]">Invest in your career, not just software.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "0", features: ["AI Match Score", "Unlimited Resume Uploads", "Single Industry Analysis"], cta: "Start Free" },
              { name: "Pro", price: "29", features: ["Everything in Starter", "Interview Coaching (5 sessions)", "ATS Auto-Optimization", "Priority Recruiter Insights"], cta: "Try Pro Free", recommended: true },
              { name: "Elite", price: "99", features: ["Everything in Pro", "Unlimited Interview Coaching", "Direct Skill Gap Analysis", "Personal Career Roadmap"], cta: "Start Success" }
            ].map((t, i) => (
              <div key={i} className={`card-premium relative overflow-hidden flex flex-col ${t.recommended ? 'scale-105 border-[var(--color-accent)]/40 ring-1 ring-[var(--color-accent)]/20 shadow-[0_0_40px_rgba(77,255,255,0.05)]' : ''}`}>
                {t.recommended && <div className="absolute top-0 right-0 py-1.5 px-6 bg-[var(--color-accent)] text-black font-bold text-[10px] uppercase tracking-widest rounded-bl-xl shadow-lg">Recommended</div>}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">{t.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-bold text-white">${t.price}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                </div>
                <div className="space-y-4 mb-10 flex-grow">
                  {t.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
                      <span className="text-sm text-gray-300">{f}</span>
                    </div>
                  ))}
                </div>
                <button className={`w-full py-4 rounded-lg font-bold transition-all duration-300 ${t.recommended ? 'btn-primary' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
                  {t.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA SECTION */}
      <section className="py-20 px-6 overflow-hidden">
        <div className="max-w-3xl mx-auto group relative">
          <div className="glass rounded-[32px] p-10 lg:p-14 relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 text-center space-y-8 shadow-2xl">
            <BorderBeam size={250} duration={12} delay={9} colorFrom="#3b82f6" colorTo="#8b5cf6" borderWidth={2} />
            <div className="absolute inset-0 bg-[var(--color-accent)] opacity-5 blur-[120px] rounded-full scale-150 rotate-45 group-hover:opacity-10 transition-opacity"></div>
            <h2 className="text-3xl lg:text-5xl font-display font-bold leading-tight text-white relative z-10">
              Ready to land your <span className="text-[var(--color-accent)]">dream job?</span>
            </h2>
            <p className="text-base text-[var(--color-text-muted)] max-w-lg mx-auto mb-8 leading-relaxed italic z-10 relative">
              Join thousands of professionals already scaling their careers with HireVision. No credit card required.
            </p>
            <div className="relative z-10">
              <SparkleButton to="/sign-up">Get Started Free Now</SparkleButton>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)] flex items-center justify-center">
                 <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-xl font-bold text-white font-display">HireVision</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed italic">
              AI-driven career intelligence to help modern professionals scale faster.
            </p>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 text-sm">Product</h5>
            <div className="space-y-4">
              <Link to="/jobs" className="block text-gray-500 hover:text-white text-sm transition-colors">Job Matches</Link>
              <Link to="/prepare-interview" className="block text-gray-500 hover:text-white text-sm transition-colors">Interview Prep</Link>
              <Link to="/pricing" className="block text-gray-500 hover:text-white text-sm transition-colors">Pricing</Link>
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 text-sm">Company</h5>
            <div className="space-y-4">
              <a href="#" className="block text-gray-500 hover:text-white text-sm transition-colors">About Us</a>
              <a href="#" className="block text-gray-500 hover:text-white text-sm transition-colors">Careers</a>
              <a href="#" className="block text-gray-500 hover:text-white text-sm transition-colors">Blog</a>
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold mb-6 text-sm">Support</h5>
            <div className="space-y-4">
              <a href="#" className="block text-gray-500 hover:text-white text-sm transition-colors">Documentation</a>
              <a href="#" className="block text-gray-500 hover:text-white text-sm transition-colors">Contact</a>
              <a href="#" className="block text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">&copy; 2026 HireVision Inc. Crafted with precision for the future of work.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Shield className="w-4 h-4" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
