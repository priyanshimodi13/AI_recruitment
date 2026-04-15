import React, { useState, useEffect } from 'react';
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
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5957/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-12">
        {/* FILTERS SIDEBAR */}
        <aside className="lg:col-span-1 space-y-10 hidden lg:block">
           <div className="card-premium space-y-10 glass-premium p-8">
              <div className="flex items-center justify-between">
                 <h2 className="text-[var(--color-heading)] font-display font-black text-2xl tracking-tight">Filters</h2>
                 <button className="text-[var(--color-accent)] text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">Reset All</button>
              </div>

              <div className="space-y-8">
                 <div>
                    <label className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.3em] block mb-5">Job Type</label>
                    <div className="space-y-4">
                       {['Full-time', 'Contract', 'Remote', 'Freelance'].map((type) => (
                         <label key={type} className="flex items-center gap-4 cursor-pointer group">
                            <div className="w-5 h-5 rounded-lg border border-[var(--color-border)] flex items-center justify-center group-hover:border-[var(--color-accent)]/50 transition-all group-active:scale-90 bg-[var(--color-surface-2)]">
                               <div className="w-2 h-2 rounded-sm bg-[var(--color-accent)] opacity-0 group-hover:opacity-20"></div>
                            </div>
                            <span className="text-sm font-semibold text-[var(--color-text-muted)] group-hover:text-[var(--color-heading)] transition-colors">{type}</span>
                         </label>
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.3em] block mb-5">Experience Level</label>
                    <div className="space-y-4">
                       {['Junior', 'Mid-Level', 'Senior', 'Lead'].map((level) => (
                         <label key={level} className="flex items-center gap-4 cursor-pointer group">
                            <div className="w-5 h-5 rounded-lg border border-[var(--color-border)] flex items-center justify-center group-hover:border-[var(--color-accent)]/50 transition-all bg-[var(--color-surface-2)]">
                            </div>
                            <span className="text-sm font-semibold text-[var(--color-text-muted)] group-hover:text-[var(--color-heading)] transition-colors">{level}</span>
                         </label>
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-[var(--color-text-muted)] uppercase tracking-[0.3em] block mb-5">Salary Range</label>
                    <div className="pt-2">
                       <input type="range" className="w-full h-1.5 bg-[var(--color-border)] rounded-full appearance-none cursor-pointer accent-[var(--color-accent)]" />
                       <div className="flex justify-between mt-3 text-[var(--color-text-muted)] font-black text-[10px] tracking-widest">
                          <span>$50K</span>
                          <span>$300K+</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="card-premium glass-premium p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-accent)] opacity-5 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <Sparkles className="w-8 h-8 text-[var(--color-accent)] mb-6 animate-sparkle" />
              <h3 className="text-[var(--color-heading)] font-bold text-lg mb-3 tracking-tight italic">AI Intelligence Active</h3>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] leading-relaxed mb-6 opacity-80">Jobs are currently prioritized based on your "Senior Architect" profile.</p>
              <button className="w-full py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-xl text-[10px] text-[var(--color-heading)] font-black tracking-[0.2em] uppercase hover:bg-[var(--color-border)] transition-all">Switch Profile</button>
           </div>
        </aside>

        {/* JOBS LIST FEED */}
        <main className="lg:col-span-3 space-y-10">
           {/* SEARCH BAR */}
           <div className="card-premium glass-premium p-4 flex flex-col md:flex-row gap-4 items-center shadow-xl">
              <div className="flex-grow relative w-full">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                 <input 
                   type="text" 
                   placeholder="Search roles, companies, or tech stack..." 
                   className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl py-4 pl-14 pr-6 text-sm font-semibold text-[var(--color-heading)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all placeholder:font-medium placeholder:italic"
                 />
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="relative flex-grow md:flex-grow-0 md:w-56">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input 
                      type="text" 
                      placeholder="Global / Remote" 
                      className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-2xl py-4 pl-14 pr-6 text-sm font-semibold text-[var(--color-heading)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 transition-all"
                    />
                 </div>
                 <button className="btn-primary py-4 px-10 text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Find</button>
              </div>
           </div>

           {/* JOB CARDS */}
           <div className="space-y-8 animate-fade-in">
               {loading ? (
                 <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div className="w-12 h-12 rounded-full border-4 border-[var(--color-accent)] border-t-transparent animate-spin mb-4"></div>
                    <p className="text-[var(--color-text-muted)] font-black uppercase tracking-widest text-xs">Curating Best Matches...</p>
                 </div>
               ) : jobs.length === 0 ? (
                 <div className="text-center py-20 card-premium glass-premium">
                    <Briefcase className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4 opacity-20" />
                    <p className="text-[var(--color-text-muted)] font-bold italic">No positions found matching your current filters.</p>
                 </div>
               ) : jobs.map((job) => (
                 <div key={job._id} className="card-premium group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--color-accent)]/5">
                    <div className="absolute top-0 right-0 py-2 px-6 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[10px] font-black tracking-[0.2em] rounded-bl-3xl border-l border-b border-[var(--color-accent)]/10">
                       {Math.floor(Math.random() * 15 + 85)}% AI FIT
                    </div>
                    
                    <div className="flex flex-col xl:flex-row justify-between gap-10">
                       <div className="flex gap-8 flex-grow">
                          <div className="w-20 h-20 bg-[var(--color-surface-2)] rounded-[2rem] border border-[var(--color-border)] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm relative pt-1 ring-1 ring-black/[0.02]">
                             <span className="text-3xl font-black text-[var(--color-accent)] italic opacity-30">{job.company?.[0] || 'C'}</span>
                          </div>
                          
                          <div className="space-y-4 pt-1">
                             <div className="space-y-1">
                                <h3 className="text-2xl font-display font-black text-[var(--color-heading)] group-hover:text-[var(--color-accent)] transition-colors tracking-tighter leading-tight">{job.title}</h3>
                                <p className="text-[var(--color-accent)] text-sm font-black italic tracking-tight opacity-90">{job.company}</p>
                             </div>
                             
                             <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)]">
                                <div className="flex items-center gap-2 group/info">
                                   <MapPin className="w-4 h-4 text-[var(--color-accent)] group-hover/info:scale-110 transition-transform" />
                                   <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2 group/info">
                                   <Briefcase className="w-4 h-4 text-purple-400 group-hover/info:scale-110 transition-transform" />
                                   <span>{job.type}</span>
                                </div>
                                <div className="flex items-center gap-2 group/info">
                                   <Clock className="w-4 h-4 text-cyan-400 group-hover/info:scale-110 transition-transform" />
                                   <span>{new Date(job.createdAt).toLocaleDateString() || 'Recently'}</span>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="flex flex-col justify-between items-end gap-10 xl:min-w-[280px]">
                          <div className="text-right space-y-1.5">
                             <p className="text-xl font-display font-bold text-[var(--color-heading)] tracking-tight leading-none">${job.salaryRange || 'Competitive'}</p>
                             <div className="flex items-center justify-end gap-2 text-[var(--color-success)] opacity-80">
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Top Percentile</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 w-full">
                             <button className="w-14 h-14 bg-[var(--color-surface-2)] rounded-2xl border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-red-500 hover:border-red-500/20 active:scale-90 transition-all flex items-center justify-center shrink-0">
                                <Bookmark className="w-6 h-6" />
                             </button>
                             <button className="btn-primary py-4 px-10 text-xs font-black tracking-widest uppercase flex-grow">Analyze & Apply</button>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
           </div>

           {/* PAGINATION */}
           <div className="flex items-center justify-center gap-6 pt-12">
              <button className="w-12 h-12 glass-premium rounded-2xl text-[var(--color-text-muted)] hover:text-[var(--color-heading)] hover:border-[var(--color-accent)]/30 transition-all active:scale-90 flex items-center justify-center">
                 <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div className="flex gap-3">
                 {[1, 2, 3].map((n) => (
                   <button key={n} className={`w-12 h-12 rounded-2xl font-black text-xs transition-all active:scale-95
                     ${n === 1 ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-blue-500/20' : 'glass-premium text-[var(--color-text-muted)] hover:text-[var(--color-heading)]'}`}>
                     {n}
                   </button>
                 ))}
              </div>
              <button className="w-12 h-12 glass-premium rounded-2xl text-[var(--color-text-muted)] hover:text-[var(--color-heading)] hover:border-[var(--color-accent)]/30 transition-all active:scale-90 flex items-center justify-center">
                 <ChevronRight className="w-5 h-5" />
              </button>
           </div>
        </main>
      </div>
    </div>
  );
}
