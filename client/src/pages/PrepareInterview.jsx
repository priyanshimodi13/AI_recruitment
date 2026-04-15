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
import { GlowCard } from '../components/UI/spotlight-card';

export default function PrepareInterview() {
  return (
    <div className="pt-24 space-y-32">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center py-24 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-accent)]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl glass-premium border-white/10 text-[var(--color-accent)] text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
              <Video className="w-4 h-4 animate-pulse" />
              <span>Real-time AI Syncing Active</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight text-[var(--color-heading)] tracking-tight">
              Master Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-cyan-400">Interview</span>
            </h1>
            <p className="text-lg text-[var(--color-text-muted)] max-w-xl font-medium leading-relaxed opacity-80">
              Practice with a behavioral intelligence engine that mimics the tone and patterns of world-class interviewers from top tech ecosystems.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <button className="btn-primary px-10 py-4 flex items-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">
                Start Mock Session <Play className="w-5 h-5 fill-current" />
              </button>
              <button className="btn-secondary px-10 py-4 text-xs font-black uppercase tracking-widest border-[var(--color-border)] bg-[var(--color-surface-2)]">Watch Strategy</button>
            </div>
          </div>

          <div className="relative group animate-fade-in-right">
            <div className="absolute -inset-8 bg-gradient-to-br from-[var(--color-accent)]/10 to-purple-500/10 opacity-60 blur-[80px] rounded-[64px]"></div>
            <div className="relative glass-premium border-[var(--color-border)] rounded-[3rem] overflow-hidden shadow-2xl p-6 bg-[var(--color-surface-2)]/50 backdrop-blur-2xl">
              <div className="aspect-video bg-black/40 rounded-[2rem] relative overflow-hidden flex items-center justify-center border border-[var(--color-border)] shadow-inner">
                <div className="absolute top-6 left-6 flex gap-3 z-10">
                  <div className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-500 text-[9px] font-black tracking-[0.2em] border border-red-500/20 uppercase flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                     SYNC_REC
                  </div>
                  <div className="px-3 py-1.5 rounded-xl glass-premium text-[var(--color-heading)] text-[9px] font-black tracking-widest italic border border-white/10">00:42:12</div>
                </div>
                <div className="text-center space-y-6 max-w-md px-10 relative z-10 transition-transform duration-700 group-hover:scale-105">
                   <div className="w-20 h-20 rounded-[2rem] bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto border border-[var(--color-accent)]/20 shadow-lg relative">
                      <div className="absolute inset-0 bg-[var(--color-accent)] blur-xl opacity-20"></div>
                      <Mic className="w-10 h-10 text-[var(--color-accent)] relative z-10" />
                   </div>
                   <p className="text-sm font-black text-[var(--color-heading)] italic leading-relaxed tracking-tight group-hover:text-white transition-colors duration-500">"Can you synchronize your approach to scaling systems under unpredictable high-load environments?"</p>
                </div>
                <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end z-10">
                   <div className="space-y-3">
                      <div className="flex gap-3 items-center">
                         <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                         <span className="text-[9px] text-cyan-400 font-black tracking-[0.2em] uppercase">Metric: Confidence</span>
                      </div>
                      <div className="w-40 h-2 bg-[var(--color-border)] rounded-full overflow-hidden shadow-inner">
                         <div className="w-[85%] h-full bg-gradient-to-r from-[var(--color-accent)] to-cyan-400 rounded-full"></div>
                      </div>
                   </div>
                   <div className="text-[9px] font-black text-[var(--color-text-muted)] p-2 glass-premium border border-white/10 rounded-xl opacity-60">@CORE_SENTIMENT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="py-24 px-6 border-y border-[var(--color-border)] glass-premium">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-heading)] tracking-tight">Why standard prep <span className="text-red-500/80">fails</span></h2>
            <p className="text-[var(--color-text-muted)] text-lg font-medium italic opacity-80">The gap between practice and performance is where opportunity is lost.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: Zap, title: "Anxiety Threshold", desc: "Mental blocks under pressure cost high-stakes roles. We build psychological resilience through controlled simulation." },
              { icon: ShieldCheck, title: "Zero Data Loop", desc: "Standard practice provides no insights. Our engine analyzes 40+ biometric and semantic data points in real-time." },
              { icon: Target, title: "Generic Scenarios", desc: "Practicing the wrong material is high risk. We synchronize simulated prompts based on specific corporate cultures." }
            ].map((p, i) => (
              <div key={i} className="text-center space-y-8 animate-fade-in group">
                 <div className="w-20 h-20 bg-[var(--color-surface-2)] rounded-[2rem] flex items-center justify-center mx-auto border border-[var(--color-border)] shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative ring-1 ring-black/[0.02]">
                    <p.icon className="w-10 h-10 text-[var(--color-accent)]" />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[var(--color-heading)] tracking-tight uppercase">{p.title}</h3>
                    <p className="text-sm font-medium text-[var(--color-text-muted)] leading-relaxed max-w-xs mx-auto opacity-70">{p.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
           <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
              {[
                { icon: MessageSquare, title: "Semantic Analysis", desc: "Deep detection of filler words and sentence structural integrity." },
                { icon: Target, title: "Keyword Matrix", desc: "Instant matching against high-priority skill requirements." },
                { icon: TrendingUp, title: "Cadence Monitor", desc: "Tracking speech velocity and tonal modulation in real-time." },
                { icon: ShieldCheck, title: "Presence beta", desc: "Analyzing non-verbal cues including focus and interactive posture." }
              ].map((c, i) => (
                <GlowCard 
                  key={i} 
                  glowColor="blue" 
                  customSize={true} 
                  className="group block card-premium !shadow-lg hover:!shadow-2xl transition-all duration-500 border-[var(--color-border)] hover:border-[var(--color-accent)]/20"
                >
                   <div className="flex flex-col h-full space-y-6">
                     <div className="w-12 h-12 bg-[var(--color-surface-2)] rounded-2xl flex items-center justify-center border border-[var(--color-border)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all duration-300">
                        <c.icon className="w-6 h-6 text-[var(--color-accent)] group-hover:text-white transition-colors" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-[var(--color-heading)] font-black tracking-tight uppercase text-xs">{c.title}</h4>
                        <p className="text-xs font-semibold text-[var(--color-text-muted)] leading-relaxed opacity-70">{c.desc}</p>
                     </div>
                   </div>
                </GlowCard>
              ))}
           </div>
           <div className="space-y-12">
              <div className="space-y-6">
                 <div className="inline-block px-4 py-1.5 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[10px] font-black tracking-[0.2em] uppercase">Intelligence Matrix</div>
                 <h2 className="text-3xl lg:text-5xl font-display font-bold text-[var(--color-heading)] leading-[1.2] tracking-tight">
                   Specific <span className="text-[var(--color-accent)]">Feedback</span> at scale
                 </h2>
                 <p className="text-lg text-[var(--color-text-muted)] font-medium italic opacity-80 leading-relaxed max-w-xl">
                   We've engineered the ultimate behavioral feedback loop. Precise, objective, and driven by industry-best performance data.
                 </p>
              </div>
              <div className="space-y-8">
                 {[
                   "Synchronized question banks from Global Tier-1 firms.",
                   "Confidence metrics indexed against lead performers.",
                   "Objective optimization tips for every semantic output.",
                   "Progress visualization across practice cycles."
                 ].map((t, i) => (
                   <div key={i} className="flex gap-6 items-center group">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0 border border-[var(--color-accent)]/20 group-hover:bg-[var(--color-accent)] transition-all">
                        <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)] group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-[var(--color-heading)] font-bold tracking-tight text-lg italic opacity-90">{t}</span>
                   </div>
                 ))}
              </div>
              <button className="btn-primary px-12 py-5 flex items-center gap-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 group">
                 Initialize Coaching <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
           </div>
        </div>
      </section>

      {/* 4. FINAL CTA SECTION */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto glass-premium rounded-[4rem] p-20 text-center border-[var(--color-border)] shadow-2xl space-y-12 relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-40 group-hover:opacity-60 transition-opacity"></div>
           <div className="absolute -top-24 -left-24 w-64 h-64 bg-[var(--color-accent)]/10 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
           
           <div className="relative z-10 space-y-6">
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-[var(--color-heading)] leading-tight tracking-tight italic">
                 Ready to <span className="text-[var(--color-accent)]">Ace Everything?</span>
              </h2>
              <p className="text-xl text-[var(--color-text-muted)] max-w-xl mx-auto font-medium italic opacity-70">
                 HireVision delivers the data and the confidence you need for the future of work.
              </p>
           </div>
           
           <div className="relative z-10 pt-6">
              <button className="btn-primary px-14 py-6 text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30 active:scale-95 transition-all">Start Free Synchronized Session</button>
           </div>
        </div>
      </section>
    </div>
  );
}
