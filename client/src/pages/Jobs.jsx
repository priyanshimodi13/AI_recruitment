import React from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  Sparkles, 
  Filter, 
  ChevronRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';

export default function Jobs() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-28 px-6 pb-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-12">
        {/* FILTERS SIDEBAR */}
        <aside className="lg:col-span-1 space-y-8 hidden lg:block">
           <div className="card-premium space-y-8 glass p-6">
              <div className="flex items-center justify-between">
                 <h2 className="text-white font-display font-bold text-xl italic underline-offset-8 underline decoration-[var(--color-accent)]/30">Filters</h2>
                 <button className="text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-tight hover:underline">Reset All</button>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Job Type</label>
                    <div className="space-y-3">
                       {['Full-time', 'Contract', 'Remote', 'Freelance'].map((type) => (
                         <label key={type} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded border border-white/10 flex items-center justify-center group-hover:border-[var(--color-accent)]/50 transition-colors">
                               <div className="w-2 h-2 rounded bg-[var(--color-accent)] opacity-0 group-hover:opacity-20"></div>
                            </div>
                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{type}</span>
                         </label>
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Experience Level</label>
                    <div className="space-y-3">
                       {['Junior', 'Mid-Level', 'Senior', 'Lead'].map((level) => (
                         <label key={level} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded border border-white/10 flex items-center justify-center group-hover:border-[var(--color-accent)]/50 transition-colors">
                            </div>
                            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{level}</span>
                         </label>
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Salary Range</label>
                    <div className="pt-2">
                       <input type="range" className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]" />
                       <div className="flex justify-between mt-2">
                          <span className="text-[10px] text-gray-600 font-bold">$50k</span>
                          <span className="text-[10px] text-gray-600 font-bold">$300k+</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="card-premium glass p-6 bg-gradient-to-br from-blue-600/10 to-purple-600/10">
              <Sparkles className="w-6 h-6 text-[var(--color-accent)] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2 italic tracking-tight">AI Matching is active</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">Jobs are currently ranked by your "Cloud Architect" resume profile.</p>
              <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] text-white font-bold tracking-widest uppercase hover:bg-white/10">Switch Profile</button>
           </div>
        </aside>

        {/* JOBS LIST FEED */}
        <main className="lg:col-span-3 space-y-8">
           {/* SEARCH BAR */}
           <div className="card-premium glass p-4 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-grow relative w-full">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                 <input 
                   type="text" 
                   placeholder="Search roles, companies, or technologies (⌘K)" 
                   className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[var(--color-accent)]/30 transition-all placeholder:italic"
                 />
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="relative flex-grow md:flex-grow-0 md:w-48">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Location" 
                      className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-[var(--color-accent)]/30 transition-all"
                    />
                 </div>
                 <button className="btn-primary py-3 px-8 text-sm">Fine Jobs</button>
              </div>
           </div>

           {/* JOB CARDS */}
           <div className="space-y-6">
              {[
                { title: "Senior AI Engineer", company: "Anthropic", location: "San Francisco, CA / Remote", salary: "$180k - $240k", type: "Full-time", time: "2h ago", match: "98%" },
                { title: "Staff Product Designer", company: "Linear", location: "Remote", salary: "$160k - $220k", type: "Full-time", time: "5h ago", match: "95%" },
                { title: "Backend Systems Lead", company: "Vercel", location: "Global / Remote", salary: "$190k - $250k", type: "Contract", time: "1d ago", match: "92%" },
                { title: "Frontend Developer (React)", company: "Stripe", location: "New York, NY", salary: "$150k - $200k", type: "Full-time", time: "2d ago", match: "89%" },
                { title: "Machine Learning Researcher", company: "Mistral AI", location: "Paris, France / Hybrid", salary: "€120k - €180k", type: "Full-time", time: "3d ago", match: "87%" }
              ].map((job, i) => (
                <div key={i} className="card-premium glass p-8 flex flex-col md:flex-row justify-between gap-8 group relative overflow-hidden transition-all duration-500">
                   <div className="absolute top-0 right-0 py-1.5 px-4 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[10px] font-bold tracking-widest rounded-bl-xl border-l border-b border-[var(--color-accent)]/20 animate-pulse">
                      {job.match} AI MATCH SCORE
                   </div>
                   
                   <div className="flex gap-6 flex-grow">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center shrink-0 group-hover:border-[var(--color-accent)]/30 transition-colors uppercase font-bold text-gray-500 italic text-xl">
                         {job.company[0]}
                      </div>
                      <div className="space-y-3">
                         <div className="space-y-1">
                            <h3 className="text-xl font-display font-bold text-white group-hover:text-[var(--color-accent)] transition-colors italic tracking-tight">{job.title}</h3>
                            <p className="text-[var(--color-accent)] text-sm font-medium italic opacity-80">{job.company}</p>
                         </div>
                         <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5">
                               <MapPin className="w-3.5 h-3.5" />
                               <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                               <Briefcase className="w-3.5 h-3.5" />
                               <span>{job.type}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold tracking-tight text-gray-400">
                               <Clock className="w-3.5 h-3.5" />
                               <span>{job.time}</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col justify-between items-end gap-6 h-full min-w-[200px]">
                      <div className="text-right space-y-1">
                         <p className="text-xl font-display font-bold text-white italic">{job.salary}</p>
                         <div className="flex items-center justify-end gap-2 text-green-500">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Market High</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 w-full">
                         <button className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-500 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/20 transition-all flex items-center justify-center shrink-0">
                            <Bookmark className="w-5 h-5" />
                         </button>
                         <button className="btn-primary py-3 px-8 text-xs flex-grow font-bold tracking-widest uppercase">Quick Apply</button>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           {/* PAGINATION */}
           <div className="flex items-center justify-center gap-4 pt-10">
              <button className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-500 hover:text-white transition-all">
                 <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div className="flex gap-2">
                 {[1, 2, 3].map((n) => (
                   <button key={n} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all
                     ${n === 1 ? 'bg-[var(--color-accent)] text-black' : 'bg-white/5 text-gray-500 hover:text-white border border-white/5'}`}>
                     {n}
                   </button>
                 ))}
              </div>
              <button className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-500 hover:text-white transition-all">
                 <ChevronRight className="w-5 h-5" />
              </button>
           </div>
        </main>
      </div>
    </div>
  );
}
