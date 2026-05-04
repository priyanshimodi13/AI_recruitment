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
  <div className="min-h-screen pt-32 px-6 pb-32 bg-[var(--color-bg)] animate-fade-in">
   <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-12">
    {/* FILTERS SIDEBAR */}
    <aside className="lg:col-span-1 space-y-10 hidden lg:block">
      <div className="card-premium space-y-12 relative overflow-hidden group">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-20"></div>
       
       <div className="flex items-center justify-between px-2">
         <h2 className="text-white font-display font-bold text-2xl tracking-tighter ">Filters</h2>
         <button className="text-lime-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-70 transition-opacity ">Reset</button>
       </div>

       <div className="space-y-10">
         <div className="space-y-6">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] block px-2">Job Type</label>
          <div className="space-y-4">
            {['Full-time', 'Contract', 'Remote', 'Freelance'].map((type) => (
             <label key={type} className="flex items-center gap-4 cursor-pointer group/label px-2">
              <div className="w-5 h-5 rounded-lg border border-white/10 flex items-center justify-center group-hover/label:border-lime-400/50 transition-all bg-white/5">
                <div className="w-2 h-2 rounded-sm bg-lime-400 opacity-0 group-hover/label:opacity-20 transition-opacity"></div>
              </div>
              <span className="text-xs font-bold text-[var(--color-text-muted)] group-hover/label:text-white transition-colors ">{type}</span>
             </label>
            ))}
          </div>
         </div>

         <div className="space-y-6">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] block px-2">Experience</label>
          <div className="space-y-4">
            {['Junior', 'Mid-Level', 'Senior', 'Lead'].map((level) => (
             <label key={level} className="flex items-center gap-4 cursor-pointer group/label px-2">
              <div className="w-5 h-5 rounded-lg border border-white/10 flex items-center justify-center group-hover/label:border-lime-400/50 transition-all bg-white/5">
              </div>
              <span className="text-xs font-bold text-[var(--color-text-muted)] group-hover/label:text-white transition-colors ">{level}</span>
             </label>
            ))}
          </div>
         </div>

         <div className="space-y-6">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] block px-2">Compensation</label>
          <div className="pt-2 px-2">
            <input type="range" className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-lime-400" />
            <div className="flex justify-between mt-4 text-white/40 font-bold text-[9px] tracking-widest ">
             <span>$50K</span>
             <span>$300K+</span>
            </div>
          </div>
         </div>
       </div>
      </div>

      <div className="card-premium relative overflow-hidden group border-lime-400/10">
       <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
       <Sparkles className="w-8 h-8 text-lime-400 mb-6 animate-sparkle" />
       <h3 className="text-white font-bold text-xl mb-3 tracking-tighter leading-tight">Neural Targeting Active</h3>
       <p className="text-xs font-medium text-[var(--color-text-muted)] leading-relaxed mb-8 opacity-70 ">Your matches are currently prioritized based on your "Senior Architect" profile.</p>
       <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] text-white font-bold tracking-[0.3em] uppercase hover:bg-white/10 hover:border-lime-400/30 transition-all ">Recalibrate Profile</button>
      </div>
    </aside>

    {/* JOBS LIST FEED */}
    <main className="lg:col-span-3 space-y-12">
      {/* SEARCH BAR */}
      <div className="card-premium p-4 flex flex-col md:flex-row gap-4 items-center shadow-2xl relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lime-400/30 to-transparent"></div>
       <div className="flex-grow relative w-full">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
         <input 
          type="text" 
          placeholder="Identify roles, companies, or stack..." 
          className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 pl-16 pr-8 text-sm font-bold text-white focus:outline-none focus:border-lime-400/40 transition-all placeholder:font-bold placeholder: placeholder:text-white/10"
         />
       </div>
       <div className="flex items-center gap-4 w-full md:w-auto">
         <div className="relative flex-grow md:flex-grow-0 md:w-64">
          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input 
           type="text" 
           placeholder="Global / Remote" 
           className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 pl-16 pr-8 text-sm font-bold text-white focus:outline-none focus:border-lime-400/40 transition-all placeholder:font-bold placeholder: placeholder:text-white/10"
          />
         </div>
         <button className="btn-primary py-5 px-12 text-xs font-bold uppercase tracking-[0.2em] shadow-xl ">Analyze</button>
       </div>
      </div>

      {/* JOB CARDS */}
      <div className="space-y-8 animate-fade-in">
        {loading ? (
         <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="w-12 h-12 rounded-full border-4 border-lime-400/10 border-t-lime-400 animate-spin"></div>
          <p className="text-white/20 font-bold uppercase tracking-[0.4em] text-[10px] ">Curating Best Matches...</p>
         </div>
        ) : jobs.length === 0 ? (
         <div className="text-center py-32 card-premium border-dashed border-white/5 bg-transparent">
          <Briefcase className="w-16 h-16 text-white/5 mx-auto mb-6" />
          <p className="text-white/30 font-bold uppercase tracking-widest text-xs ">No neural patterns detected matching your filters.</p>
         </div>
        ) : jobs.map((job) => (
         <div key={job._id} className="card-premium group relative overflow-hidden transition-all duration-700 hover:shadow-2xl">
          <div className="absolute top-0 right-0 py-3 px-8 bg-lime-400/10 text-lime-400 text-[10px] font-bold tracking-[0.3em] rounded-bl-[2rem] border-l border-b border-lime-400/10 ">
            {Math.floor(Math.random() * 12 + 88)}% AI MATCH
          </div>
          
          <div className="flex flex-col xl:flex-row justify-between gap-12">
            <div className="flex gap-10 flex-grow">
             <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:rotate-2 transition-all duration-700 shadow-xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <span className="text-4xl font-bold text-lime-400 opacity-20 relative z-10">{job.company?.[0] || 'C'}</span>
             </div>
             
             <div className="space-y-6 pt-2">
               <div className="space-y-2">
                <h3 className="text-3xl font-display font-bold text-white group-hover:text-lime-400 transition-colors tracking-tighter leading-tight ">{job.title}</h3>
                <div className="flex items-center gap-3">
                 <p className="text-lime-400 text-base font-bold tracking-tight opacity-70">{job.company}</p>
                 <div className="w-1 h-1 rounded-full bg-white/10"></div>
                 <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{new Date(job.createdAt).toLocaleDateString() || 'Just Synchronized'}</span>
                </div>
               </div>
               
               <div className="flex flex-wrap gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                <div className="flex items-center gap-3 group/info">
                  <MapPin className="w-4 h-4 text-lime-400 group-hover/info:scale-125 transition-transform" />
                  <span className="group-hover/info:text-white transition-colors">{job.location}</span>
                </div>
                <div className="flex items-center gap-3 group/info">
                  <Briefcase className="w-4 h-4 text-purple-400 group-hover/info:scale-125 transition-transform" />
                  <span className="group-hover/info:text-white transition-colors">{job.type}</span>
                </div>
                <div className="flex items-center gap-3 group/info">
                  <TrendingUp className="w-4 h-4 text-blue-400 group-hover/info:scale-125 transition-transform" />
                  <span className="group-hover/info:text-white transition-colors">${job.salaryRange || 'Elite Pay'}</span>
                </div>
               </div>
             </div>
            </div>

            <div className="flex flex-row xl:flex-col justify-between items-end gap-10 xl:min-w-[320px]">
             <div className="hidden xl:block text-right space-y-2">
               <p className="text-3xl font-display font-bold text-white tracking-tighter leading-none">${job.salaryRange?.split('-')[0] || '160K'}<span className="text-xs text-white/20 ml-1">/YR</span></p>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-400/5 rounded-lg border border-lime-400/10 text-lime-400/60">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em]">High Growth Matrix</span>
               </div>
             </div>
             <div className="flex items-center gap-4 w-full">
               <button className="w-16 h-16 bg-white/5 rounded-[1.5rem] border border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/20 active:scale-90 transition-all flex items-center justify-center shrink-0 shadow-lg">
                <Bookmark className="w-7 h-7" />
               </button>
               <button className="btn-primary py-5 px-12 text-xs font-bold tracking-[0.2em] uppercase flex-grow shadow-2xl ">Apply & Analyze</button>
             </div>
            </div>
          </div>
         </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-center gap-8 pt-16">
       <button className="w-14 h-14 card-premium !p-0 rounded-2xl text-white/20 hover:text-white hover:border-lime-400/30 transition-all active:scale-90 flex items-center justify-center group">
         <ChevronRight className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
       </button>
       <div className="flex gap-4">
         {[1, 2, 3].map((n) => (
          <button key={n} className={`w-14 h-14 rounded-2xl font-bold text-xs transition-all active:scale-95 
           ${n === 1 ? 'bg-lime-400 text-black shadow-2xl' : 'card-premium !p-0 text-white/20 hover:text-white hover:border-lime-400/30'}`}>
           {n}
          </button>
         ))}
       </div>
       <button className="w-14 h-14 card-premium !p-0 rounded-2xl text-white/20 hover:text-white hover:border-lime-400/30 transition-all active:scale-90 flex items-center justify-center group">
         <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
       </button>
      </div>
    </main>
   </div>
  </div>
 );
}
