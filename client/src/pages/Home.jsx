import React from 'react';
import { Link } from 'react-router-dom';
import { GlowCard } from '../components/UI/spotlight-card';

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
  Sparkles
} from 'lucide-react';

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

            <p className="text-xl text-[var(--color-text-muted)] max-w-xl leading-relaxed animate-fade-in-shimmer">
              Nexus AI connects your skills to the world's top job matches and prepares you for the interview with real-time coaching.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Link to="/sign-up" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/prepare-interview" className="btn-secondary text-lg flex items-center gap-2 px-8 py-4">
                See How It Works
              </Link>
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
            <div className="relative bg-[#1A1A1A] p-2 rounded-2xl border border-white/10 glass shadow-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1614729939124-032f0b5609ce?auto=format&fit=crop&q=80&w=1200"
                alt="AI Platform Dashboard"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
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
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-block px-3 py-1 rounded bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs font-bold tracking-widest uppercase">The Nexus Solution</div>
              <h2 className="text-4xl lg:text-6xl font-display font-bold leading-tight text-white">
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
              <div className="relative aspect-video rounded-2xl overflow-hidden glass border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1200" alt="Product Demo" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section className="py-32 px-6 bg-black" id="pricing">
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
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto glass rounded-[40px] border-white/10 p-12 lg:p-24 relative overflow-hidden bg-gradient-to-br from-blue-600/10 to-purple-600/10 text-center space-y-10 group">
          <div className="absolute inset-0 bg-[var(--color-accent)] opacity-5 blur-[120px] rounded-full scale-150 rotate-45 group-hover:opacity-10 transition-opacity"></div>
          <h2 className="text-4xl lg:text-7xl font-display font-bold leading-tight text-white relative z-10">
            Ready to land your <span className="text-[var(--color-accent)]">dream job?</span>
          </h2>
          <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto relative z-10">
            Join thousands of professionals already scaling their careers with Nexus AI. No credit card required.
          </p>
          <div className="relative z-10">
            <Link to="/sign-up" className="btn-primary px-12 py-5 text-xl inline-flex">Get Started Free Now</Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[var(--color-accent)] rounded flex items-center justify-center">
                <span className="text-black font-bold">N</span>
              </div>
              <span className="text-xl font-bold text-white font-display">NexusAI</span>
            </Link>
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
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-xs text-gray-600">&copy; 2026 Nexus AI Inc. Crafted with precision for the future of work.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><Shield className="w-4 h-4" /></a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
