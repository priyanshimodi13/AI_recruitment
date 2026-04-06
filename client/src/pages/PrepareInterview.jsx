import React from 'react';
import { 
  Video, 
  Mic, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck, 
  Target, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  LineChart 
} from 'lucide-react';

export default function PrepareInterview() {
  return (
    <div className="pt-20 bg-[var(--color-bg)]">
      {/* 1. HERO SECTION */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-accent)]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-widest">
              <Video className="w-3 h-3" />
              <span>Real-time AI Interview Coach</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight text-white italic">
              Master Your Next <span className="text-[var(--color-accent)]">Interview</span> with AI
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] max-w-xl leading-relaxed">
              Practice with an AI that mimics the tone and question style of top tech companies. Get instant feedback on your tone, pacing, and content.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="btn-primary flex items-center gap-2">
                Start Mock Interview <Play className="w-4 h-4" />
              </button>
              <button className="btn-secondary">Watch 60s Demo</button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-[var(--color-accent)]/10 blur-[60px] rounded-[40px]"></div>
            <div className="relative glass border-white/10 rounded-3xl overflow-hidden shadow-2xl p-4">
              <div className="aspect-video bg-black/40 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/5">
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="px-2 py-1 rounded-md bg-red-500/20 text-red-500 text-[8px] font-bold tracking-widest border border-red-500/40">LIVE_REC</div>
                  <div className="px-2 py-1 rounded-md bg-black/60 text-white text-[8px] font-bold font-mono border border-white/10 italic">00:42:12</div>
                </div>
                <div className="text-center space-y-4">
                   <div className="w-16 h-16 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center mx-auto border border-[var(--color-accent)]/40 ring-4 ring-black/40">
                      <Mic className="w-8 h-8 text-[var(--color-accent)]" />
                   </div>
                   <p className="text-xs text-gray-500 italic">"Can you explain your approach to managing conflict in a high-stakes environment?"</p>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                   <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                         <span className="text-[9px] text-green-500 font-bold tracking-widest uppercase italic">Confidence: High</span>
                      </div>
                      <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                         <div className="w-[85%] h-full bg-[var(--color-accent)] rounded-full"></div>
                      </div>
                   </div>
                   <div className="text-[9px] text-gray-400 font-mono tracking-tighter p-1 bg-black/40 border border-white/5 rounded italic">@AI_INTERVIEW_SENTIMENT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="py-24 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-6 mb-20">
            <h2 className="text-3xl font-display font-bold text-white italic">Why Interviewing is Hard</h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed italic">The stakes are high. The nerves are real. The feedback is silent.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: "Anxiety & Nerves", desc: "Mental blocks and stuttering under pressure cost jobs. We build your muscle memory in a safe environment." },
              { icon: ShieldCheck, title: "Zero Feedback", desc: "Most interviewers don't tell you why you failed. Our AI analyzes 40+ performance data points and tells you exactly what to fix." },
              { icon: Target, title: "Unprepared Questions", desc: "Walking into an interview with no plan for difficult questions is risky. We use real data to simulate company-specific interview prompts." }
            ].map((p, i) => (
              <div key={i} className="text-center space-y-4">
                 <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 group hover:border-[var(--color-accent)] transition-all">
                    <p.icon className="w-8 h-8 text-[var(--color-accent)]" />
                 </div>
                 <h3 className="text-lg font-bold text-white tracking-widest uppercase italic">{p.title}</h3>
                 <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
           <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: MessageSquare, title: "Tone Analysis", desc: "Detects confidence levels and filler words in real-time." },
                { icon: Target, title: "Keyword Sync", desc: "Are you mentioning the right skills listed in the job description?" },
                { icon: TrendingUp, title: "Pacing Monitor", desc: "Track if you're speaking too fast or taking too many pauses." },
                { icon: ShieldCheck, title: "Body Language", desc: "Beta feature analyzing eye contact and posture through video." }
              ].map((c, i) => (
                <div key={i} className="card-premium group relative">
                   <div className="w-10 h-10 bg-[var(--color-accent)]/5 rounded-lg flex items-center justify-center mb-6 border border-white/5 group-hover:border-[var(--color-accent)]/30 transition-colors">
                      <c.icon className="w-5 h-5 text-[var(--color-accent)]" />
                   </div>
                   <h4 className="text-white font-bold mb-2 tracking-tight uppercase italic text-sm">{c.title}</h4>
                   <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              ))}
           </div>
           <div className="space-y-10">
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight italic">
                Get <span className="text-[var(--color-accent)]">Specific Feedback</span> That Actually Works
              </h2>
              <div className="space-y-6">
                 {[
                   "Role-specific question banks from Meta, Stripe, Google.",
                   "Confidence scores vs. industry benchmarks.",
                   "Actionable tips for every single answer provided.",
                   "Progress tracking over multiple practice sessions."
                 ].map((t, i) => (
                   <div key={i} className="flex gap-4 items-center">
                      <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)]" />
                      <span className="text-gray-300 font-medium tracking-tight text-lg italic">{t}</span>
                   </div>
                 ))}
              </div>
              <button className="btn-primary px-10 py-4 flex items-center gap-3">
                 Experience AI Coaching <ArrowRight className="w-5 h-5" />
              </button>
           </div>
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-4xl mx-auto glass rounded-[40px] p-16 text-center border-white/10 space-y-8 relative group overflow-hidden">
           <div className="absolute inset-0 bg-[var(--color-accent)] opacity-5 blur-[120px] rounded-full scale-150 rotate-45 group-hover:opacity-10 transition-opacity"></div>
           <h2 className="text-3xl lg:text-5xl font-display font-bold text-white leading-tight italic relative z-10">
              Ready to <span className="text-[var(--color-accent)]">Ace Your Interviews?</span>
           </h2>
           <p className="text-lg text-[var(--color-text-muted)] max-w-xl mx-auto italic relative z-10">
              Nexus AI gives you the confidence and the data to land the role you deserve.
           </p>
           <div className="relative z-10 pt-4">
              <button className="btn-primary px-12 py-5 text-lg">Start Free Mock Interview Now</button>
           </div>
        </div>
      </section>
    </div>
  );
}
