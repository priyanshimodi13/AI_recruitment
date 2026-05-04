import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Briefcase, Plus, TrendingUp, CheckCircle2, ChevronRight, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5957';

export default function EmployerDashboard({ activeView = 'Overview', setActiveView }) {
 const { user } = useUser();
 const { getToken } = useAuth();
 const [jobs, setJobs] = useState([]);
 const [candidates, setCandidates] = useState([]);
 const [loading, setLoading] = useState(true);
 const [showPostJobModal, setShowPostJobModal] = useState(false);
 const [isEditing, setIsEditing] = useState(false);
 const [editingJobId, setEditingJobId] = useState(null);
 
 // Job Form State
 const [formData, setFormData] = useState({
  title: '',
  company: user?.firstName ? `${user.firstName}'s Company` : '',
  companyWebsite: '',
  location: '',
  type: 'Full-time',
  experienceLevel: 'Mid Level',
  description: '',
  requirements: '',
  salaryRange: '',
  isActive: true
 });

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

 useEffect(() => {
  fetchJobs();
  fetchCandidates();
 }, [getToken, activeView]);

 const handleEditClick = (job) => {
  setFormData({
   title: job.title,
   company: job.company,
   companyWebsite: job.companyWebsite || '',
   location: job.location,
   type: job.type,
   experienceLevel: job.experienceLevel,
   description: job.description,
   requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements || '',
   salaryRange: job.salaryRange || '',
   isActive: job.isActive ?? true
  });
  setEditingJobId(job._id);
  setIsEditing(true);
  setShowPostJobModal(true);
 };

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

 const handlePostJob = async (e) => {
  e.preventDefault();
  try {
   const token = await getToken();
   const payload = {
    ...formData,
    requirements: formData.requirements.split('\n').filter(r => r.trim() !== '')
   };
   
   const url = isEditing ? `${API_URL}/api/jobs/${editingJobId}` : `${API_URL}/api/jobs`;
   const method = isEditing ? 'PUT' : 'POST';

   const res = await fetch(url, {
    method: method,
    headers: {
     'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
   });

   if (res.ok) {
    setShowPostJobModal(false);
    setIsEditing(false);
    setEditingJobId(null);
    setFormData({
     title: '',
     company: user?.firstName ? `${user.firstName}'s Company` : '',
     companyWebsite: '',
     location: '',
     type: 'Full-time',
     experienceLevel: 'Mid Level',
     description: '',
     requirements: '',
     salaryRange: '',
     isActive: true
    });
    fetchJobs();
   }
  } catch (err) {
   console.error('Error saving job:', err);
  }
 };

 const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 return (
  <div className="flex flex-col flex-grow space-y-12 animate-fade-in">
   {/* PAGE HEADER */}
    <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
     <div className="space-y-1">
      <h1 className="text-2xl font-sf-display font-bold text-white tracking-tight leading-none">
       {activeView === 'Overview' ? 'Company Dashboard' : activeView === 'Jobs' ? 'Job Listings' : activeView}
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] font-medium opacity-70 font-sf-text">
       {activeView === 'Overview' ? 'Manage your recruitment pipeline.' : `Refine your ${activeView === 'Jobs' ? 'job listings' : activeView.toLowerCase()} details.`}
      </p>
     </div>
     <div className="flex flex-wrap gap-3 w-full xl:w-auto">
      <button onClick={() => setShowPostJobModal(true)} className="btn-primary py-3 px-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider shadow-xl font-sf-text">
       <Plus className="w-3.5 h-3.5" /> Post Job
      </button>
     </div>
    </header>

   {/* OVERVIEW CONTENT */}
   {activeView === 'Overview' && (
    <div className="space-y-6 animate-fade-in pb-12">
     
     {/* METRIC GRID (Asset Style) */}
     <div className="grid grid-cols-12 gap-5">
       {[
        { label: "Active Postings", value: jobs.length, trend: "+12%", color: "text-[#c4eec6]", chart: "M0 25 L10 20 L20 28 L30 15 L40 22 L50 10 L60 18 L70 5 L80 12 L90 2 L100 8" },
        { label: "Total Impressions", value: (jobs.length * 142).toLocaleString(), trend: "+4.5%", color: "text-blue-400", chart: "M0 20 L10 25 L20 15 L30 22 L40 10 L50 18 L60 5 L70 12 L80 8 L90 15 L100 5" },
        { label: "Candidate Pool", value: candidates.length, trend: "+28%", color: "text-purple-400", chart: "M0 28 L10 22 L20 25 L30 18 L40 20 L50 12 L60 15 L70 8 L80 10 L90 5 L100 2" },
       ].map((m, i) => (
        <div key={i} className="col-span-12 md:col-span-4 card-premium !p-5 group relative overflow-hidden flex flex-col justify-between h-36 hover:border-white/20 transition-all duration-700">
         <div className="flex justify-between items-start relative z-10">
           <div className="space-y-1">
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest font-sf-text">{m.label}</p>
            <h3 className={`text-xl font-sf-display font-bold tracking-tight ${m.color}`}>{m.value}</h3>
           </div>
           <div className={`px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[7px] font-bold ${m.color} uppercase tracking-widest font-sf-text`}>
            {m.trend}
           </div>
         </div>
        
        {/* Mini Chart */}
        <div className="absolute bottom-0 left-0 w-full h-20 opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none">
         <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
          <defs>
           <linearGradient id={`grad-emp-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" className={m.color} />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" className={m.color} />
           </linearGradient>
          </defs>
          <path d={`${m.chart} L100 30 L0 30 Z`} fill={`url(#grad-emp-${i})`} className={m.color} />
          <path d={m.chart} fill="none" stroke="currentColor" strokeWidth="1" className={m.color} />
         </svg>
        </div>
        
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-all duration-700"></div>
       </div>
      ))}

      {/* RECRUITMENT STRATEGY HUB (Big Card) */}
      <div className="col-span-12 xl:col-span-8 card-premium !p-0 overflow-hidden group relative h-[18rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c4eec6]/10 via-[#09090b] to-[#c4eec6]/5 opacity-50 group-hover:opacity-80 transition-opacity duration-1000"></div>
        <div className="absolute inset-0 flex flex-col justify-between p-6 relative z-10">
         <div className="space-y-4">
           <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-3xl group-hover:scale-105 transition-all duration-700">
            <TrendingUp className="w-6 h-6 text-[#c4eec6]" />
           </div>
           <div className="space-y-1">
             <h2 className="text-xl font-sf-display font-bold text-white tracking-tight leading-none">Hiring Overview</h2>
             <p className="text-[10px] text-white/60 font-medium max-w-xl font-sf-text">Centralize your recruitment process and find top global talent.</p>
           </div>
         </div>
         
         <div className="flex flex-wrap gap-4 items-end justify-between">
           <div className="flex gap-6">
            <div className="space-y-1">
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest font-sf-text">Active Listings</p>
              <p className="text-base font-bold text-white font-sf-display">{jobs.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest font-sf-text">System Status</p>
              <p className="text-base font-bold text-[#c4eec6] font-sf-display">Active</p>
            </div>
           </div>
           <button onClick={() => setShowPostJobModal(true)} className="btn-primary !py-3 !px-8 text-[9px] font-bold uppercase tracking-wider shadow-xl font-sf-text">
            Create Posting <Plus className="ml-1.5 w-3 h-3" />
           </button>
         </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
      </div>

      {/* SYSTEM HEALTH */}
      <div className="col-span-12 xl:col-span-4 card-premium !p-5 space-y-5 relative overflow-hidden group h-[18rem]">
        <div className="space-y-1">
         <h3 className="text-sm font-sf-display font-bold text-white tracking-tight uppercase">System Health</h3>
         <p className="text-[9px] text-white/40 font-medium font-sf-text">Monitoring platform stability.</p>
        </div>
        
        <div className="space-y-5">
         {[
          { label: "Candidate Matching", status: "Active", val: "98.2%", color: "bg-[#c4eec6]" },
          { label: "System Speed", status: "Nominal", val: "12ms", color: "bg-blue-400" },
          { label: "Data Quality", status: "Verified", val: "100%", color: "bg-purple-400" },
          { label: "Urgency Level", status: "High", val: "Elite", color: "bg-orange-400" },
         ].map((s, i) => (
          <div key={i} className="space-y-1.5 group/item">
            <div className="flex justify-between items-end">
             <p className="text-[8px] font-bold text-white uppercase tracking-widest group-hover/item:text-[#c4eec6] transition-colors font-sf-text">{s.label}</p>
             <span className="text-[8px] font-bold text-white/40 uppercase tracking-tighter font-sf-text">{s.val}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div className={`h-full ${s.color} w-4/5 transition-all duration-1000`}></div>
            </div>
          </div>
         ))}
        </div>
        
        <div className="pt-2">
         <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 group-hover:bg-white/10 transition-all">
           <div className="w-8 h-8 rounded-lg bg-[#c4eec6]/20 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#c4eec6]" />
           </div>
           <div>
            <p className="text-[8px] font-bold text-white uppercase tracking-widest font-sf-text">System Ready</p>
            <p className="text-[7px] font-medium text-white/40 font-sf-text">All systems performing optimally.</p>
           </div>
         </div>
        </div>
      </div>

      {/* ACTIVE JOB POSTINGS */}
      <div className="col-span-12 space-y-5">
        <div className="flex justify-between items-end px-2">
         <div className="space-y-1">
           <div className="flex items-center gap-2">
            <div className="w-0.5 h-4 bg-[#c4eec6] rounded-full"></div>
            <h2 className="text-xl font-sf-display font-bold text-white tracking-tight uppercase">Active Job Postings</h2>
           </div>
           <p className="text-[9px] text-white/40 font-medium font-sf-text">Real-time monitoring of your active hiring pipelines.</p>
         </div>
         <button onClick={() => setActiveView('Jobs')} className="text-[9px] font-bold text-[#c4eec6] uppercase tracking-wider hover:tracking-widest transition-all px-3 py-1.5 border border-lime-400/20 rounded-lg bg-lime-400/5 font-sf-text">View All Jobs</button>
        </div>

        {loading ? (
         <div className="py-20 flex justify-center items-center">
           <div className="w-12 h-12 rounded-full border-4 border-lime-400/20 border-t-lime-400 animate-spin"></div>
         </div>
        ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {jobs.slice(0, 4).map((job) => (
           <div key={job._id} className="card-premium !p-12 group relative overflow-hidden hover:border-white/20 transition-all duration-700">
            <div className="flex justify-between items-start mb-10">
              <div className="flex gap-8">
               <div className="w-20 h-20 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center shrink-0 group-hover:rotate-6 transition-all duration-700">
                 <span className="text-4xl font-bold text-[#c4eec6] opacity-20">{job.title?.[0] || 'J'}</span>
               </div>
               <div className="space-y-2">
                 <h3 className="text-3xl font-display font-bold text-white group-hover:text-[#c4eec6] transition-colors tracking-tighter leading-none">{job.title}</h3>
                 <p className="text-sm font-bold text-white/40 uppercase tracking-widest ">{job.location} &bull; {job.type}</p>
               </div>
              </div>
              <div className={`px-4 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest border ${job.isActive ? 'bg-green-400/10 text-green-400 border-green-400/10' : 'bg-red-400/10 text-red-400 border-red-400/10'}`}>
               {job.isActive ? 'Active' : 'Closed'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-10">
              {[
               { label: "Sync Potential", val: "98%", color: "text-[#c4eec6]" },
               { label: "Applicants", val: candidates.filter(c => c.jobId?._id === job._id).length, color: "text-white" },
               { label: "Match Score", val: "Elite", color: "text-purple-400" },
              ].map((stat, idx) => (
               <div key={idx} className="space-y-1">
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{stat.label}</p>
                 <p className={`text-xl font-bold ${stat.color}`}>{stat.val}</p>
               </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5 flex gap-4">
              <button onClick={() => handleEditClick(job)} className="flex-1 btn-secondary !py-4 text-[10px] font-bold uppercase tracking-widest ">Modify Node</button>
              <button onClick={() => setActiveView('Candidates')} className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest transition-all">Review Talent</button>
            </div>
            
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-lime-400/10 to-transparent blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
           </div>
          ))}
         </div>
        )}
      </div>
     </div>
    </div>
   )}

   {/* JOBS LIST VIEW */}
   {activeView === 'Jobs' && (
    <div className="space-y-10 animate-fade-in">
     <div className="flex justify-between items-end px-2">
       <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold text-white tracking-tighter">Listing Matrix</h2>
        <p className="text-xs text-[var(--color-text-muted)] font-medium">Full repository of your active and archived openings.</p>
       </div>
     </div>
     <div className="grid md:grid-cols-2 gap-10">
      {jobs.map((job) => (
       <div key={job._id} className="card-premium group hover:shadow-2xl transition-all duration-700 flex flex-col justify-between p-10">
        <div className="space-y-8">
         <div className="flex justify-between items-start">
          <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center group-hover:border-lime-400/30 transition-all duration-500 shadow-sm shrink-0">
           <span className="text-2xl font-bold text-[#c4eec6] opacity-20">{job.title?.[0] || 'J'}</span>
          </div>
          <div className={`px-4 py-2 rounded-2xl text-[10px] font-bold border uppercase tracking-[0.2em] ${job.isActive ? 'bg-green-400/10 text-green-400 border-green-400/10' : 'bg-red-400/10 text-red-400 border-red-400/10'}`}>
           {job.isActive ? 'Active' : 'Closed'}
          </div>
         </div>
         <div>
          <h3 className="text-3xl font-display font-bold text-white group-hover:text-[#c4eec6] transition-colors tracking-tighter leading-tight mb-2">{job.title}</h3>
          <p className="text-lg font-bold text-[#c4eec6] tracking-tight opacity-70">{job.location}</p>
         </div>
         <p className="text-sm font-medium text-[var(--color-text-muted)] line-clamp-3 leading-relaxed">{job.description}</p>
         <div className="flex flex-wrap gap-4">
          <span className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{candidates.filter(c => c.jobId?._id === job._id).length} Applicants</span>
          <span className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{job.type}</span>
          {job.salaryRange && <span className="px-4 py-2 bg-lime-400/10 rounded-xl border border-lime-400/10 text-[10px] font-bold text-[#c4eec6] uppercase tracking-widest">{job.salaryRange}</span>}
         </div>
        </div>
        <div className="pt-10 mt-10 border-t border-white/5">
         <button onClick={() => handleEditClick(job)} className="w-full btn-secondary py-4 text-[10px] font-bold uppercase tracking-widest">Modify Posting</button>
        </div>
       </div>
      ))}
     </div>
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
          <span className={`text-[10px] font-bold uppercase tracking-widest ${candidate.status === 'Accepted' ? 'text-green-400' : candidate.status === 'Rejected' ? 'text-red-400' : 'text-blue-400'}`}>
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
    <div className="flex flex-col items-center justify-center py-40 space-y-10 animate-in zoom-in duration-700">
      <div className="w-32 h-32 bg-lime-400/10 rounded-[3rem] flex items-center justify-center border border-lime-400/20 shadow-2xl group relative overflow-hidden">
       <CheckCircle2 className="w-12 h-12 text-[#c4eec6] opacity-40 group-hover:opacity-100 transition-opacity animate-pulse" />
       <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 to-transparent"></div>
      </div>
      <div className="text-center space-y-4">
       <h3 className="text-4xl font-display font-bold text-white tracking-tighter ">{activeView} Optimization</h3>
       <p className="text-lg font-medium text-[var(--color-text-muted)] max-w-lg mx-auto opacity-70">Our neural engine is currently prioritizing your hiring matrix. This module will be synchronized shortly.</p>
      </div>
      <button onClick={() => setActiveView('Overview')} className="btn-secondary py-4 px-12 text-[10px] font-bold uppercase tracking-widest hover:border-#c4eec6/40 transition-all">Synchronize Dashboard</button>
    </div>
   )}

   {/* POST JOB MODAL */}
   {showPostJobModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl">
     <div className="relative w-full max-w-2xl bg-[#09090b] rounded-[3rem] border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-12 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-#c4eec6 to-transparent opacity-30"></div>
      <button 
       onClick={() => {
        setShowPostJobModal(false);
        setIsEditing(false);
        setEditingJobId(null);
        setFormData({
         title: '',
         company: user?.firstName ? `${user.firstName}'s Company` : '',
         companyWebsite: '',
         location: '',
         type: 'Full-time',
         experienceLevel: 'Mid Level',
         description: '',
         requirements: '',
         salaryRange: '',
         isActive: true
        });
       }} 
       className="absolute top-10 right-10 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
      >
       <X className="w-5 h-5" />
      </button>
      
      <h2 className="text-4xl font-display font-bold text-white tracking-tighter mb-10">
       {isEditing ? 'Modify Listing' : 'Initiate New Stream'}
      </h2>
      
      <form onSubmit={handlePostJob} className="space-y-8">
       <div className="grid grid-cols-2 gap-8">
        <div className="col-span-2 md:col-span-1 space-y-2">
         <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Job Title</label>
         <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-#c4eec6/40 focus:outline-none transition-all" placeholder="e.g. Lead Neural Architect" />
        </div>
        <div className="col-span-2 md:col-span-1 space-y-2">
         <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Experience Matrix</label>
         <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-#c4eec6/40 focus:outline-none transition-all appearance-none">
          <option>Entry Level</option>
          <option>Mid Level</option>
          <option>Senior</option>
          <option>Executive</option>
         </select>
        </div>
        <div className="col-span-2 md:col-span-1 space-y-2">
         <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Location Node</label>
         <input required name="location" value={formData.location} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-#c4eec6/40 focus:outline-none transition-all" placeholder="e.g. Remote / Global" />
        </div>
        <div className="col-span-2 md:col-span-1 space-y-2">
         <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Stream Type</label>
         <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-#c4eec6/40 focus:outline-none transition-all appearance-none">
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
         </select>
        </div>
        <div className="col-span-2 md:col-span-1 space-y-2">
         <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Compensation Matrix</label>
         <input name="salaryRange" value={formData.salaryRange} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-#c4eec6/40 focus:outline-none transition-all" placeholder="e.g. $140k - $180k" />
        </div>
        
        {isEditing && (
         <div className="col-span-2 md:col-span-1 space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Stream Status</label>
          <select name="isActive" value={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-#c4eec6/40 focus:outline-none transition-all appearance-none">
           <option value="true">Active (Synchronizing)</option>
           <option value="false">Closed (Archived)</option>
          </select>
         </div>
        )}
        <div className="col-span-2 space-y-2">
         <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Neural Description</label>
         <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-#c4eec6/40 focus:outline-none transition-all resize-none" placeholder="Describe the neural synchronization role..."></textarea>
        </div>
        <div className="col-span-2 space-y-2">
         <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Key Requirements (One per line)</label>
         <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows="4" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-#c4eec6/40 focus:outline-none transition-all resize-none" placeholder="Architectural expertise in React&#10;Neural pattern matching..."></textarea>
        </div>
       </div>
       
       <div className="pt-6 flex gap-6">
        <button type="button" onClick={() => setShowPostJobModal(false)} className="btn-secondary py-5 px-10 text-[10px] font-bold uppercase tracking-widest w-1/3">Cancel</button>
        <button type="submit" className="btn-primary py-5 px-10 text-[10px] font-bold uppercase tracking-widest w-2/3 shadow-2xl">
         {isEditing ? 'Commit Changes' : 'Initialize Stream'}
        </button>
       </div>
      </form>
     </div>
    </div>
   )}
  </div>
 );
}
