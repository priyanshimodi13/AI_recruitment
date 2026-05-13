import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Briefcase, Plus, TrendingUp, CheckCircle2, ChevronRight, X, MoreHorizontal, Bookmark, Eye, Pencil } from 'lucide-react';
import PostJobSection from '@/components/ui/PostJobSection';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5957';

export default function EmployerDashboard({ activeView = 'Overview', setActiveView, triggerPostJob }) {
 const { user } = useUser();
 const { getToken } = useAuth();
 const [jobs, setJobs] = useState([]);
 const [candidates, setCandidates] = useState([]);
 const [interviews, setInterviews] = useState([]);
 const [loading, setLoading] = useState(true);
 const [loadingInterviews, setLoadingInterviews] = useState(false);
 const [timeFilter, setTimeFilter] = useState('Day');
 const [selectedJobId, setSelectedJobId] = useState('');

 useEffect(() => {
  if (triggerPostJob > 0) {
    setActiveView('Jobs');
  }
 }, [triggerPostJob]);
 


 const fetchJobs = async () => {
  try {
   const token = await getToken();
   const res = await fetch(`${API_URL}/api/jobs/employer`, {
    headers: { Authorization: `Bearer ${token}` }
   });
   if (res.ok) {
    const data = await res.json();
    setJobs(data);
   }
  } catch (err) {
   console.error('Error fetching jobs:', err);
  } finally {
   setLoading(false);
  }
 };

 const fetchCandidates = async () => {
  try {
   const token = await getToken();
   const res = await fetch(`${API_URL}/api/applications/employer`, {
    headers: { Authorization: `Bearer ${token}` }
   });
   if (res.ok) {
    const data = await res.json();
    setCandidates(data);
   }
  } catch (err) {
   console.error('Error fetching candidates:', err);
  }
 };

 const fetchInterviews = async () => {
  try {
    setLoadingInterviews(true);
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/interviews/employer`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setInterviews(data.interviews || []);
    }
  } catch (err) {
    console.error('Error fetching interviews:', err);
  } finally {
    setLoadingInterviews(false);
  }
 };

 useEffect(() => {
  fetchJobs();
  fetchCandidates();
  if (activeView === 'Interviews') {
    fetchInterviews();
  }
 }, [getToken, activeView]);



 const openResume = (url) => {
  if (!url || url === 'Uploaded via Modal') {
   alert("No resume file available for this candidate.");
   return;
  }
  // Clean backslashes and ensure no double leading slashes
  let path = url.replace(/\\/g, '/');
  while (path.startsWith('/')) {
   path = path.substring(1);
  }
  
  const fullUrl = url.startsWith('http') ? url : `${API_URL}/${path}`;
  window.open(fullUrl, '_blank');
 };



 return (
  <div className="flex flex-col flex-grow space-y-12 animate-fade-in">
   {/* PAGE HEADER */}
    <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
     <div className="space-y-1">
      <h1 className="text-2xl font-sf-display font-bold text-white tracking-tight leading-none">
       {activeView === 'Dashboard' ? 'Company Dashboard' : activeView === 'Jobs' ? 'Job Listings' : activeView}
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] font-medium opacity-70 font-sf-text">
       {activeView === 'Dashboard' ? 'Manage your recruitment pipeline.' : `Refine your ${activeView === 'Jobs' ? 'job listings' : activeView.toLowerCase()} details.`}
      </p>
     </div>

    </header>

   {/* OVERVIEW CONTENT */}
   {activeView === 'Dashboard' && (
    <div className="space-y-6 animate-fade-in pb-12">
     
     {/* TOP METRIC CARDS */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
       {[
        { label: "Posted Job", value: jobs.length < 10 ? `0${jobs.length}` : jobs.length, icon: Briefcase },
        { label: "Shortlisted", value: candidates.filter(c => c?.status === 'Accepted' || c?.status === 'Round 1 Selected' || c?.status === 'Shortlisted').length < 10 ? `0${candidates.filter(c => c?.status === 'Accepted' || c?.status === 'Round 1 Selected' || c?.status === 'Shortlisted').length}` : candidates.filter(c => c?.status === 'Accepted' || c?.status === 'Round 1 Selected' || c?.status === 'Shortlisted').length, icon: Bookmark },
        { label: "Application", value: candidates.length >= 1000 ? `${(candidates.length/1000).toFixed(1)}k` : candidates.length, icon: Eye },
        { label: "Save Candidate", value: "04", icon: Pencil },
       ].map((m, i) => (
        <div key={i} className="card-premium !p-6 flex items-center justify-between group hover:border-white/20 transition-all duration-700">
          <div className="space-y-1">
            <h3 className="text-3xl font-display font-bold text-white tracking-tight">{m.value}</h3>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{m.label}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#c4eec6] flex items-center justify-center text-black shadow-[0_0_15px_rgba(196,238,198,0.3)] group-hover:scale-110 transition-transform">
            <m.icon className="w-5 h-5" />
          </div>
        </div>
       ))}
     </div>

     {/* BOTTOM SECTION */}
     <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        
        {/* LEFT: JOB VIEWS GRAPH */}
        <div className="xl:col-span-8 card-premium !p-8 space-y-8 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-display font-bold text-white tracking-tight">Job Views</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs font-bold text-white/60">Jobs:</span>
              <select 
                value={selectedJobId} 
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c4eec6]/40 appearance-none w-full sm:w-64 font-bold"
              >
                {jobs.length > 0 ? jobs.map(j => (
                  <option key={j?._id || Math.random()} value={j?._id} className="bg-[#09090b] text-white">
                    {j?.title && j.title.length > 30 ? j.title.substring(0,30)+'...' : (j?.title || 'Untitled Job')}
                  </option>
                )) : <option className="bg-[#09090b] text-white">No jobs posted</option>}
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              {['1h', 'Day', 'Week', 'Month', 'Year'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setTimeFilter(t)}
                  className={`text-xs font-bold transition-all ${timeFilter === t ? 'px-4 py-1.5 rounded-full bg-[#3d4f40] text-white' : 'text-white/40 hover:text-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          {/* SVG GRAPH AREA */}
          <div className="h-64 mt-4 relative w-full border-b border-white/10">
            {/* Y Axis labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] font-bold text-white/20">
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>50</span>
            </div>
            
            {/* Graph Content */}
            <div className="absolute left-10 right-0 top-0 bottom-8 relative">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                <div className="border-b border-white/5 border-dashed w-full h-0"></div>
                <div className="border-b border-white/5 border-dashed w-full h-0"></div>
                <div className="border-b border-white/5 border-dashed w-full h-0"></div>
                <div className="border-b border-white/5 border-dashed w-full h-0"></div>
              </div>
              
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c4eec6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#c4eec6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Dynamically shift path based on selected job or timeFilter so it feels real-time/interactive */}
                <path d={`M 0 80 Q 15 20, 25 70 T 45 ${timeFilter === 'Day' ? 10 : timeFilter === 'Week' ? 30 : 50} T 65 30 T 100 70 L 100 100 L 0 100 Z`} fill="url(#viewGrad)" className="transition-all duration-700" />
                <path d={`M 0 80 Q 15 20, 25 70 T 45 ${timeFilter === 'Day' ? 10 : timeFilter === 'Week' ? 30 : 50} T 65 30 T 100 70`} fill="none" stroke="#c4eec6" strokeWidth="2.5" className="transition-all duration-700" />
                <circle cx="45" cy={timeFilter === 'Day' ? 10 : timeFilter === 'Week' ? 30 : 50} r="4" fill="#c4eec6" stroke="#09090b" strokeWidth="2" className="animate-pulse transition-all duration-700" />
              </svg>
            </div>
            
            {/* X Axis labels */}
            <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <span>Sun</span>
              <span>Sat</span>
              <span>Mon</span>
              <span className="text-[#c4eec6]">Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>
          </div>
        </div>

        {/* RIGHT: POSTED JOBS LIST */}
        <div className="xl:col-span-4 card-premium !p-6 flex flex-col h-[28rem]">
          <h2 className="text-lg font-display font-bold text-white tracking-tight mb-6">Posted Job</h2>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
            {jobs.length === 0 ? (
              <div className="text-center text-white/40 text-sm font-medium py-10">No jobs posted yet.</div>
            ) : (
              jobs.map(job => (
                <div key={job?._id || Math.random()} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                      {job?.companyLogo ? (
                        <img src={job.companyLogo} alt="" className="w-6 h-6 object-contain" />
                      ) : (
                        <span className="text-lg font-bold text-[#c4eec6]">{job?.title?.[0] || 'J'}</span>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#c4eec6] transition-colors">{job?.title || 'Untitled Job'}</h4>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{job?.type || 'Full-time'} &bull; {job?.location || 'Remote'}</p>
                    </div>
                  </div>
                  <button className="text-white/20 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
     </div>
    </div>
   )}

   {/* JOBS LIST VIEW */}
   {activeView === 'Jobs' && (
    <div className="space-y-10 animate-fade-in">
     <PostJobSection userRole="employer" />
    </div>
   )}

   {/* CANDIDATES VIEW */}
   {activeView === 'Candidates' && (
    <div className="space-y-10 animate-fade-in">
     <div className="flex justify-between items-end px-2">
       <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold text-white tracking-tighter">Intelligence Portal</h2>
        <p className="text-xs text-[var(--color-text-muted)] font-medium">AI-ranked candidate synchronization matrix.</p>
       </div>
     </div>
     <div className="grid xl:grid-cols-2 gap-10">
      {candidates.map((candidate) => (
       <div key={candidate._id} className="card-premium flex flex-col gap-8 p-10 group">
        <div className="flex justify-between items-start">
         <div className="flex items-center gap-6">
          {candidate.userId?.profileImageUrl ? (
           <img src={candidate.userId.profileImageUrl} alt="" className="w-16 h-16 rounded-[1.5rem] object-cover border border-white/10 group-hover:border-lime-400/30 transition-all" />
          ) : (
           <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-white/10 group-hover:border-lime-400/30 transition-all">
            <span className="text-2xl font-bold text-[#c4eec6] opacity-20">{candidate.userId?.firstName?.[0] || 'C'}</span>
           </div>
          )}
          <div className="space-y-1">
           <h3 className="text-2xl font-display font-bold text-white group-hover:text-[#c4eec6] transition-colors tracking-tight">{candidate.userId?.firstName} {candidate.userId?.lastName}</h3>
           <p className="text-sm font-bold text-[var(--color-text-muted)] opacity-60 tracking-tight">{candidate.userId?.email}</p>
          </div>
         </div>
         <div className="px-4 py-2 rounded-2xl bg-lime-400/10 text-[#c4eec6] text-[10px] font-bold border border-lime-400/10 uppercase tracking-[0.2em]">
          {candidate.matchPercentage || 92}% Match
         </div>
        </div>
        
        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-4">
         <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Applied Stream</span>
          <span className="text-xs font-bold text-white ">{candidate.jobId?.title}</span>
         </div>
         <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Neural Status</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${
            candidate.status === 'Accepted' || candidate.status === 'Round 1 Selected' ? 'text-[#c4eec6]' : 
            candidate.status === 'Rejected' ? 'text-red-400' : 
            'text-blue-400'
          }`}>
           {candidate.status}
          </span>
         </div>
        </div>

        <div className="pt-4 flex gap-4">
         <button onClick={() => openResume(candidate.resumeUrl)} className="btn-secondary py-4 flex-1 text-[10px] font-bold uppercase tracking-widest">Analyze Resume</button>
         <button className="btn-primary py-4 flex-1 text-[10px] font-bold uppercase tracking-widest">Initiate Sync</button>
        </div>
       </div>
      ))}
     </div>
    </div>
   )}

   {/* PLACEHOLDER VIEWS */}
   {activeView === 'Interviews' && (
    <div className="space-y-10 animate-fade-in">
      <div className="flex justify-between items-end px-2">
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-bold text-white tracking-tighter">Scheduled Interviews</h2>
          <p className="text-xs text-[var(--color-text-muted)] font-medium">Manage and track upcoming candidate synchronizations.</p>
        </div>
      </div>

      {loadingInterviews ? (
        <div className="text-center py-20 text-white/20 font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Interview Matrix...</div>
      ) : interviews.length > 0 ? (
        <div className="grid xl:grid-cols-2 gap-8 pb-20">
          {interviews.map((interview) => (
            <div key={interview._id} className="card-premium p-8 group relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-4">
                 <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                  interview.status === 'Scheduled' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' :
                  interview.status === 'Completed' ? 'bg-lime-400/10 text-[#c4eec6] border-lime-400/20' :
                  'bg-red-400/10 text-red-400 border-red-400/20'
                }`}>
                  {interview.status}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-lime-400/30 transition-all">
                    <span className="text-xl font-bold text-[#c4eec6] opacity-30">
                      {interview.candidateId?.firstName?.[0] || 'C'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#c4eec6] transition-colors">
                      {interview.candidateId?.firstName} {interview.candidateId?.lastName}
                    </h3>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                      {interview.candidateId?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Position</p>
                    <p className="text-xs font-bold text-white truncate">{interview.jobId?.title || 'Unknown Job'}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Mode</p>
                    <p className="text-xs font-bold text-white">{interview.interviewMode}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-white/60">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-[#c4eec6]" />
                    <span className="text-xs font-bold text-white">
                      {new Date(interview.scheduledDateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c4eec6]" />
                    <span className="text-xs font-bold text-white">
                      {new Date(interview.scheduledDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                {interview.interviewLink && (
                  <button 
                    onClick={() => window.open(interview.interviewLink, '_blank')}
                    className="btn-primary py-3 flex-1 text-[9px] font-bold uppercase tracking-widest shadow-lg"
                  >
                    Join Meeting
                  </button>
                )}
                <button className="btn-secondary py-3 flex-1 text-[9px] font-bold uppercase tracking-widest">Reschedule</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 space-y-10">
          <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 opacity-20">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <div className="text-center space-y-3">
            <p className="text-sm font-bold text-white/30 uppercase tracking-widest">No scheduled synchronizations detected</p>
            <button onClick={() => setActiveView('Overview')} className="text-[10px] font-bold text-[#c4eec6] uppercase tracking-[0.3em] hover:opacity-80 transition-all">Return to Dashboard</button>
          </div>
        </div>
      )}
    </div>
   )}


  </div>
 );
}
