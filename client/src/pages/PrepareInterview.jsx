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
  <div className="pt-24 space-y-32 bg-[var(--color-bg)] animate-fade-in">
   {/* 1. HERO SECTION */}
   <section className="relative min-h-[90vh] flex items-center justify-center py-24 px-6 overflow-hidden">
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime-400/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 animate-pulse"></div>
    
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
     <div className="space-y-12 animate-fade-in-up">
      <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-lime-400 text-[10px] font-bold uppercase tracking-[0.4em] shadow-sm ">
       <Video className="w-4 h-4 animate-pulse" />
       <span>Real-time AI Syncing Active</span>
      </div>
      <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] text-white tracking-tighter ">
       Master Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">Interview</span>
      </h1>
      <p className="text-xl text-[var(--color-text-muted)] max-w-xl font-medium leading-relaxed opacity-70 ">
       Practice with a behavioral intelligence engine that mimics the tone and patterns of world-class interviewers from top tech ecosystems.
      </p>
      <div className="flex flex-wrap gap-8 pt-6">
       <button className="btn-primary px-12 py-5 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] shadow-2xl group">
        Start Mock Session <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
       </button>
       <button className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white/50 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all ">Watch Strategy</button>
      </div>
     </div>

     <div className="relative group animate-fade-in-right">
      <div className="absolute -inset-12 bg-gradient-to-br from-lime-400/10 to-emerald-500/10 opacity-60 blur-[100px] rounded-[64px]"></div>
      <div className="relative card-premium p-6 overflow-hidden !rounded-[3.5rem]">
       <div className="aspect-video bg-black/60 rounded-[2.5rem] relative overflow-hidden flex items-center justify-center border border-white/10 shadow-inner group/video">
        <div className="absolute top-8 left-8 flex gap-4 z-10">
         <div className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-bold tracking-[0.3em] border border-red-500/20 uppercase flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
           SYNC_REC
         </div>
         <div className="px-4 py-2 rounded-xl bg-white/5 text-white/40 text-[10px] font-bold tracking-widest border border-white/10">00:42:12</div>
        </div>
        
        <div className="text-center space-y-8 max-w-md px-12 relative z-10 transition-transform duration-1000 group-hover/video:scale-105">
          <div className="w-24 h-24 rounded-[2.5rem] bg-lime-400/10 flex items-center justify-center mx-auto border border-lime-400/20 shadow-2xl relative">
           <div className="absolute inset-0 bg-lime-400 blur-2xl opacity-20 animate-pulse"></div>
           <Mic className="w-12 h-12 text-lime-400 relative z-10" />
          </div>
          <p className="text-lg font-bold text-white leading-tight tracking-tight opacity-90">"Can you synchronize your approach to scaling systems under unpredictable high-load environments?"</p>
        </div>

        <div className="absolute bottom-8 left-10 right-10 flex justify-between items-end z-10">
          <div className="space-y-4 flex-grow max-w-[240px]">
           <div className="flex gap-4 items-center">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
             <span className="text-[10px] text-emerald-400 font-bold tracking-[0.3em] uppercase ">Metric: Confidence</span>
           </div>
           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
             <div className="w-[85%] h-full bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full shadow-[0_0_20px_rgba(163,230,53,0.4)]"></div>
           </div>
          </div>
          <div className="text-[10px] font-bold text-white/20 p-3 bg-white/5 border border-white/10 rounded-2xl uppercase tracking-[0.2em] ">@NEURAL_ANALYSIS</div>
        </div>
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* 2. PROBLEM SECTION */}
   <section className="py-32 px-6 border-y border-white/5 bg-white/[0.01]">
    <div className="max-w-7xl mx-auto">
     <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
      <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter ">Why Standard Prep <span className="text-red-500/80">Fails</span></h2>
      <p className="text-[var(--color-text-muted)] text-xl font-medium opacity-60">The gap between practice and performance is where opportunity is lost.</p>
     </div>
     <div className="grid md:grid-cols-3 gap-16">
      {[
       { icon: Zap, title: "Anxiety Threshold", desc: "Mental blocks under pressure cost high-stakes roles. We build psychological resilience through controlled simulation." },
       { icon: ShieldCheck, title: "Zero Data Loop", desc: "Standard practice provides no insights. Our engine analyzes 40+ biometric and semantic data points in real-time." },
       { icon: Target, title: "Generic Scenarios", desc: "Practicing the wrong material is high risk. We synchronize simulated prompts based on specific corporate cultures." }
      ].map((p, i) => (
       <div key={i} className="text-center space-y-10 animate-fade-in group">
         <div className="w-24 h-24 bg-white/5 rounded-[3rem] flex items-center justify-center mx-auto border border-white/10 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p.icon className="w-12 h-12 text-lime-400 relative z-10" />
         </div>
         <div className="space-y-5">
          <h3 className="text-xl font-bold text-white tracking-tighter uppercase ">{p.title}</h3>
          <p className="text-sm font-medium text-[var(--color-text-muted)] leading-relaxed max-w-xs mx-auto opacity-70 ">{p.desc}</p>
         </div>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* 3. CAPABILITIES */}
   <section className="py-40 px-6">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
      <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
       {[
        { icon: MessageSquare, title: "Semantic Analysis", desc: "Deep detection of filler words and sentence structural integrity." },
        { icon: Target, title: "Keyword Matrix", desc: "Instant matching against high-priority skill requirements." },
        { icon: TrendingUp, title: "Cadence Monitor", desc: "Tracking speech velocity and tonal modulation in real-time." },
        { icon: ShieldCheck, title: "Presence Analysis", desc: "Analyzing non-verbal cues including focus and interactive posture." }
       ].map((c, i) => (
        <div 
         key={i} 
         className="card-premium p-8 space-y-8 group hover:border-lime-400/30 transition-all duration-700"
        >
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-lime-400 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(163,230,53,0.3)]">
           <c.icon className="w-7 h-7 text-lime-400 group-hover:text-black transition-colors" />
          </div>
          <div className="space-y-3">
           <h4 className="text-white font-bold tracking-widest uppercase text-xs ">{c.title}</h4>
           <p className="text-xs font-semibold text-[var(--color-text-muted)] leading-relaxed opacity-60 ">{c.desc}</p>
          </div>
        </div>
       ))}
      </div>
      <div className="space-y-12">
       <div className="space-y-8">
         <div className="inline-block px-5 py-2 rounded-2xl bg-lime-400/10 text-lime-400 text-[10px] font-bold tracking-[0.4em] uppercase border border-lime-400/20">Intelligence Matrix</div>
         <h2 className="text-5xl lg:text-7xl font-display font-bold text-white leading-[1] tracking-tighter ">
          Specific <span className="text-lime-400">Feedback</span> At Scale
         </h2>
         <p className="text-xl text-[var(--color-text-muted)] font-medium opacity-70 leading-relaxed max-w-xl">
          We've engineered the ultimate behavioral feedback loop. Precise, objective, and driven by industry-best performance data.
         </p>
       </div>
       <div className="space-y-10">
         {[
          "Synchronized question banks from Global Tier-1 firms.",
          "Confidence metrics indexed against lead performers.",
          "Objective optimization tips for every semantic output.",
          "Progress visualization across practice cycles."
         ].map((t, i) => (
          <div key={i} className="flex gap-8 items-center group">
           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-lime-400 group-hover:border-lime-400 transition-all duration-500">
            <CheckCircle2 className="w-6 h-6 text-lime-400 group-hover:text-black transition-colors" />
           </div>
           <span className="text-white font-bold tracking-tight text-xl opacity-80 group-hover:opacity-100 transition-opacity">{t}</span>
          </div>
         ))}
       </div>
       <button className="btn-primary px-14 py-6 flex items-center gap-6 text-xs font-bold uppercase tracking-[0.3em] shadow-2xl group">
         Initialize Coaching <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-500" />
       </button>
      </div>
    </div>
   </section>

   {/* 4. FINAL CTA SECTION */}
   <section className="py-40 px-6 overflow-hidden">
    <div className="max-w-5xl mx-auto card-premium !p-24 text-center space-y-14 relative group overflow-hidden !rounded-[5rem]">
      <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-emerald-400/5 opacity-40 group-hover:opacity-60 transition-opacity"></div>
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-lime-400/10 blur-[120px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
      
      <div className="relative z-10 space-y-8">
       <h2 className="text-5xl lg:text-7xl font-display font-bold text-white leading-tight tracking-tighter ">
         Ready To <span className="text-lime-400">Ace Everything?</span>
       </h2>
       <p className="text-2xl text-[var(--color-text-muted)] max-w-2xl mx-auto font-medium opacity-60 leading-relaxed">
         HireVision delivers the data and the confidence you need for the future of work. Practiced, polished, and powerful.
       </p>
      </div>
      
      <div className="relative z-10 pt-10">
       <button className="btn-primary px-16 py-7 text-sm font-bold uppercase tracking-[0.4em] shadow-[0_0_50px_rgba(163,230,53,0.3)] active:scale-95 transition-all ">Start Synchronized Session</button>
      </div>
    </div>
   </section>
  </div>
 );
}
