import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EmployerDashboard from './EmployerDashboard';
import { 
 LayoutDashboard, 
 Search, 
 Calendar, 
 Briefcase, 
 User, 
 Settings, 
 Plus, 
 TrendingUp, 
 CheckCircle2, 
 Clock, 
 MoreVertical,
 ChevronRight,
 Filter
} from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import Sidenavbar from '@/components/UI/sidenavbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5957';

export default function Dashboard() {
 const { user } = useUser();
 const { getToken } = useAuth();
 const navigate = useNavigate();
 const [jobs, setJobs] = useState([]);
 const [allJobs, setAllJobs] = useState([]);
 const [loadingJobs, setLoadingJobs] = useState(true);
 const [activeView, setActiveView] = useState('Overview'); // Overview, Job Matches, Preparation, Applications
 const [selectedJob, setSelectedJob] = useState(null);
 const [activeSessions, setActiveSessions] = useState([]);
 const [loadingSessions, setLoadingSessions] = useState(true);
 const [userRole, setUserRole] = useState(null);
 const [appliedJobs, setAppliedJobs] = useState([]);
 const [applyingJobId, setApplyingJobId] = useState(null);

 // Apply Modal State
 const [showApplyModal, setShowApplyModal] = useState(false);
 const [jobToApply, setJobToApply] = useState(null);
 const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '' });
 const [applyFile, setApplyFile] = useState(null);
 const [isApplying, setIsApplying] = useState(false);

 const handleApplyClick = (job) => {
  setJobToApply(job);
  setApplyForm({ ...applyForm, name: user?.fullName || '', email: user?.primaryEmailAddress?.emailAddress || '' });
  setShowApplyModal(true);
 };

 const handleApplySubmit = async (e) => {
  e.preventDefault();
  if (!applyFile) return alert("Please select a resume file.");
  
  setIsApplying(true);
  try {
   const formData = new FormData();
   formData.append('name', applyForm.name);
   formData.append('email', applyForm.email);
   formData.append('phone', applyForm.phone);
   formData.append('position', jobToApply.title);
   formData.append('resume', applyFile);

   // 1. Upload resume to trigger AI processing
   const resResume = await fetch(`${API_URL}/api/resumes`, {
    method: 'POST',
    body: formData
   });
   const resumeData = await resResume.json();

   let extractedSkills = [];
   let resumeUrl = 'Uploaded via Modal';

   if (resumeData.data) {
    if (resumeData.data.filePath) resumeUrl = resumeData.data.filePath;
    if (resumeData.data.skills) extractedSkills = resumeData.data.skills;
   }

   // 2. Submit formal application linked to job
   const token = await getToken();
   const resApp = await fetch(`${API_URL}/api/applications`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
     jobId: jobToApply._id,
     resumeUrl,
     coverLetter: 'Applied directly from Dashboard.',
     extractedSkills
    })
   });

   if (resApp.ok) {
    setAppliedJobs([...appliedJobs, jobToApply._id]);
    setShowApplyModal(false);
    setJobToApply(null);
    setApplyForm({ name: '', email: '', phone: '' });
    setApplyFile(null);
    alert("Application submitted successfully!");
   } else {
    alert("Failed to submit application.");
   }
  } catch (error) {
   console.error(error);
   alert("Error applying for the job.");
  } finally {
   setIsApplying(false);
  }
 };


 useEffect(() => {
  fetch(`${API_URL}/api/jobs`)
   .then(res => res.json())
   .then(data => {
    setAllJobs(data);
    setJobs(data.slice(0, 3)); // Only show top 3 for overview
    setLoadingJobs(false);
   })
   .catch(err => {
    console.error(err);
    setLoadingJobs(false);
   });
 }, []);

 useEffect(() => {
  const checkAndInitRole = async () => {
   try {
    const token = await getToken();
    let currentRole = null;
    let dbRole = null;

    // 1. Fetch profile FIRST to ensure user exists in DB and get their current status
    const res = await fetch(`${API_URL}/api/users/profile`, {
     headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.ok) {
     const data = await res.json();
     if (data.isAdmin) {
      navigate('/admin');
      return;
     }
     dbRole = data.role;
    }

    // 2. Check if we have an intended role from RoleSelectionPage
    const intendedRole = localStorage.getItem('intendedRole');
    if (intendedRole && intendedRole !== dbRole) {
     // Send to backend to update the newly created/existing user
     const roleRes = await fetch(`${API_URL}/api/users/role`, {
      method: 'PUT',
      headers: { 
       'Content-Type': 'application/json',
       Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ role: intendedRole })
     });
     
     if (roleRes.ok) {
      currentRole = intendedRole;
     }
    } else if (intendedRole === dbRole) {
     currentRole = intendedRole;
    }

    // Only clear intendedRole after everything is processed
    if (intendedRole) {
     localStorage.removeItem('intendedRole');
    }

    // 3. Set the final role state
    if (currentRole) {
     setUserRole(currentRole);
    } else if (dbRole) {
     setUserRole(dbRole);
    } else {
     setUserRole('candidate'); // Default
    }

   } catch (err) {
    console.error('Error checking user role:', err);
   }
  };
  checkAndInitRole();
 }, [getToken, navigate]);

 useEffect(() => {
  const fetchSessions = async () => {
   try {
    const token = await getToken();
    if (!token) return;
    const res = await fetch(`${API_URL}/api/users/profile/sessions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setActiveSessions(data);
    }
   } catch (err) {
    console.error('Error fetching sessions:', err);
   } finally {
    setLoadingSessions(false);
   }
  };
  fetchSessions();
 }, [getToken]);

 return (
  <Sidenavbar 
   userRole={userRole} 
   activeView={activeView} 
   setActiveView={setActiveView}
  >
   {userRole === 'employer' ? (
    <EmployerDashboard activeView={activeView} setActiveView={setActiveView} />
   ) : (
    <div className="space-y-12 animate-fade-in">
     {activeView === 'Overview' && (
      <div className="space-y-6 animate-fade-in pb-12">
       {/* MAIN CONTENT GRID */}
       <div className="grid grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: TOP RECOMMENDATIONS */}
        <div className="col-span-12 xl:col-span-8 space-y-4">
         <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Recommended for You</p>
          <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-bold text-white/40">3 New</div>
         </div>
         
         <h3 className="text-2xl font-display font-bold text-white tracking-tight uppercase leading-none">Job Opportunities</h3>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
           { company: 'NVIDIA', role: 'Senior ML Engineer', score: '98%', trend: 'Elite Match', salary: '$180k - $240k', color: 'text-purple-400', chart: 'M0 30 Q 15 10, 30 25 T 60 15 T 90 20 T 120 5' },
           { company: 'OpenAI', role: 'Data Scientist', score: '94%', trend: 'High Fit', salary: '$160k - $210k', color: 'text-[#c4eec6]', chart: 'M0 30 Q 20 20, 40 25 T 80 15 T 120 20' },
           { company: 'DeepMind', role: 'Research Engineer', score: '89%', trend: 'Strong Fit', salary: '$150k - $190k', color: 'text-red-400', chart: 'M0 10 Q 30 15, 60 25 T 90 35 T 120 30' },
          ].map((asset, i) => (
           <div key={i} className="card-premium !rounded-[1.5rem] !p-5 space-y-4 group hover:border-white/20 transition-all duration-500 relative overflow-hidden">
            <div className="flex justify-between items-start">
             <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
               <span className="text-lg font-bold opacity-30 font-sf-display">{asset.company[0]}</span>
              </div>
              <div>
               <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-sf-text">{asset.company}</p>
               <p className="text-xs font-bold text-white tracking-tight font-sf-text">{asset.role}</p>
              </div>
             </div>
             <button className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#c4eec6] group-hover:text-black transition-all">
              <ChevronRight className="w-3.5 h-3.5" />
             </button>
            </div>

            <div className="space-y-1">
             <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest font-sf-text">Compatibility Score</p>
             <div className="flex items-baseline gap-2">
              <span className="text-2xl font-sf-display font-bold text-white tracking-tighter">{asset.score}</span>
             </div>
             <div className="flex items-center gap-1">
              
              <span className={`text-[9px] font-bold ${asset.color} font-sf-text`}>{asset.trend}</span>
             </div>
            </div>

            {/* MINI CHART */}
            <div className="h-14 w-full relative pt-2">
             <svg className="w-full h-full overflow-visible" viewBox="0 0 120 40">
              <path d={asset.chart} fill="none" stroke="currentColor" strokeWidth="2" className={`${asset.color} opacity-50`} />
              <path d={`${asset.chart} L 120 40 L 0 40 Z`} fill="currentColor" className={`${asset.color} opacity-10`} />
              <circle cx="120" cy="5" r="2.5" fill="currentColor" className={asset.color} />
             </svg>
             <div className="absolute right-0 bottom-0 text-[8px] font-bold text-white/30 font-sf-text">
              {asset.salary}
             </div>
            </div>
           </div>
          ))}
         </div>
        </div>

        {/* RIGHT COLUMN: JOB LISTINGS */}
        <div className="col-span-12 xl:col-span-4 flex flex-col">
         <div className="flex-grow card-premium !rounded-[1.5rem] !p-6 relative overflow-hidden flex flex-col justify-between group h-full">
          {/* Background Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-lime-400/5 transition-all duration-1000"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/5 transition-all duration-1000"></div>
          
          <div className="relative z-10">
           <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
             <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black">
               <TrendingUp className="w-4 h-4" />
             </div>
             <h4 className="text-lg font-display font-bold text-white uppercase tracking-tighter">Syncent®</h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[8px] font-bold uppercase tracking-widest text-white">New</span>
           </div>

           <h2 className="text-xl font-display font-bold text-white tracking-tight leading-none mb-3">Recent Listings</h2>
           <p className="text-xs font-medium text-white/50 leading-relaxed mb-8 max-w-[240px]">
            Explore the latest high-tier engineering roles available now.
           </p>
          </div>

          <div className="relative z-10 space-y-3">
           <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-400/80 to-indigo-400/80 text-black text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
            Connect Neural Link <LayoutDashboard className="w-3.5 h-3.5" />
           </button>
           <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            Enter Node Address <Settings className="w-3.5 h-3.5" />
           </button>
          </div>
         </div>
        </div>

        {/* PROFESSIONAL PROFILE (Big Card) */}
        <div className="col-span-12 xl:col-span-8 card-premium !p-0 overflow-hidden group relative h-[20rem]">
         <div className="absolute inset-0 bg-gradient-to-br from-[#c4eec6]/10 via-[#09090b] to-[#c4eec6]/5 opacity-50 group-hover:opacity-80 transition-opacity duration-1000"></div>
         
         {/* Large Background Chart Visualization */}
         <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
           <path d="M0 200 Q 150 150, 300 180 T 600 100 T 800 150" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#c4eec6]" />
          </svg>
         </div>

         <div className="absolute inset-0 flex flex-col justify-between p-8 relative z-10">
          <div className="space-y-5">
           <div className="w-14 h-14 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-3xl group-hover:scale-110 transition-all duration-700">
            <TrendingUp className="w-7 h-7 text-[#c4eec6]" />
           </div>
           <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-white tracking-tight leading-none">Your Professional Profile</h2>
            <p className="text-xs text-white/60 font-medium max-w-lg">Complete your profile to unlock elite opportunities and real-time market positioning.</p>
           </div>
          </div>
          
          <div className="flex flex-wrap gap-10 items-end justify-between">
           <div className="flex gap-8">
            <div className="space-y-0.5">
             <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Est. Salary Range</p>
             <p className="text-lg font-bold text-white">$142,500 <span className="text-[9px] text-white/40">/ year</span></p>
            </div>
            <div className="space-y-0.5">
             <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Market Status</p>
             <p className="text-lg font-bold text-[#c4eec6]">Top 2% <span className="text-[9px] text-white/40">Highly Skilled</span></p>
            </div>
           </div>
           <button className="btn-primary !py-3 !px-8 text-[10px] font-bold uppercase tracking-widest shadow-2xl shadow-[#c4eec6]/20">
            Update Profile
           </button>
          </div>
         </div>

         
         {/* Decorative elements */}
         <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-1000"></div>
         <div className="absolute top-1/2 right-10 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
        </div>

        <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
          <div className="card-premium !rounded-[1.5rem] !p-6 flex-1 flex flex-col justify-between">
           <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-2">Profile Match</p>
           <div className="flex items-baseline gap-2 mb-3">
             <span className="text-2xl font-display font-bold text-white tracking-tight">98.2%</span>
             <span className="text-[9px] font-bold text-[#c4eec6] uppercase tracking-widest">Strong</span>
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-[#c4eec6] w-[98%]"></div>
           </div>
          </div>
          <div className="card-premium !rounded-[1.5rem] !p-6 flex-1 flex flex-col justify-between bg-gradient-to-br from-purple-500/10 to-transparent">
           <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-2">Network Growth</p>
           <div className="flex items-baseline gap-2 mb-3">
             <span className="text-2xl font-sf-display font-bold text-white tracking-tighter">+42%</span>
             <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">Epoch</span>
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-purple-500 w-[42%] shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
           </div>
          </div>
        </div>
       </div>

       {/* BOTTOM SECTION: ACTIVE PIPELINE */}
       <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
         <h4 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] ">Active Deployments</h4>
         <div className="flex gap-4">
          <TrendingUp className="w-3.5 h-3.5 text-white/20" />
          <Plus className="w-3.5 h-3.5 text-white/20" />
          <Settings className="w-3.5 h-3.5 text-white/20" />
          <Filter className="w-3.5 h-3.5 text-white/20" />
         </div>
        </div>

        <div className="card-premium !rounded-[1.5rem] !p-6 relative overflow-hidden">
          <div className="grid grid-cols-12 gap-6">
           {/* Left Side: Large Asset */}
           <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2">
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest ">Last Update &bull; 45 minutes ago</p>
              <Clock className="w-3 h-3 text-white/30" />
            </div>

            <div className="flex items-center gap-3">
              <h2 className="text-xl font-sf-display font-bold text-white tracking-tight uppercase leading-none">Sync Avalanche (AVAX)</h2>
              <div className="w-6 h-6 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
               <span className="text-xs font-bold text-red-500 rotate-12">A</span>
              </div>
              <div className="flex gap-2">
               <button className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"><MoreVertical className="w-3.5 h-3.5" /></button>
               <button className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"><Settings className="w-3.5 h-3.5" /></button>
               <button className="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[7px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">View Profile ↗</button>
              </div>
            </div>

            <div className="flex items-end gap-6">
              <div className="space-y-1">
               <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest font-sf-text">Current Neural Balance, AVAX</p>
               <h1 className="text-4xl font-sf-display font-bold text-white tracking-tight leading-none">31.39686</h1>
              </div>
              <div className="flex gap-2 pb-1">
               <button className="px-5 py-2 rounded-xl bg-purple-400/80 text-black text-[9px] font-bold uppercase tracking-wider shadow-xl hover:scale-105 transition-all font-sf-text">Upgrade</button>
               <button className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-[9px] font-bold uppercase tracking-wider hover:bg-white/10 transition-all font-sf-text">Unsync</button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 pt-8 border-t border-white/5">
              {[
               { label: 'Momentum', val: 'Growth dynamics' },
               { label: 'General', val: 'Overview' },
               { label: 'Risk', val: 'Risk assessment' },
               { label: 'Reward', val: 'Expected profit' },
              ].map((stat, i) => (
               <div key={i} className="space-y-2">
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest ">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-tight">{stat.val}</span>
                  <TrendingUp className="w-3 h-3 text-white/10" />
                </div>
               </div>
              ))}
            </div>
           </div>

           {/* Right Side: Timeline Slider */}
           <div className="col-span-12 lg:col-span-4 flex flex-col justify-center">
             <div className="card-premium !bg-white/5 !border-white/5 !rounded-[1.25rem] !p-5 space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-sf-display font-bold text-white uppercase tracking-tight">Sync Period</h4>
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[7px] font-bold uppercase tracking-widest text-white/40">6 Month</span>
              </div>

              <div className="relative py-8">
                {/* Slider Track */}
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full w-2/3 bg-gradient-to-r from-purple-400 to-indigo-400"></div>
                </div>
                {/* Slider Thumb */}
                <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl group cursor-pointer">
                  <div className="w-1.5 h-3 bg-white/20 rounded-full"></div>
                  <div className="w-1.5 h-3 bg-white/20 rounded-full ml-0.5"></div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-indigo-500 text-white text-[7px] font-bold uppercase tracking-widest whitespace-nowrap shadow-lg">4 Month</div>
                </div>

                {/* Visual Pulse */}
                <div className="absolute inset-x-0 bottom-0 h-3 flex items-end gap-1 opacity-20">
                  {Array.from({ length: 30 }).map((_, i) => (
                   <div key={i} className="flex-1 bg-white" style={{ height: `${Math.random() * 100}%` }}></div>
                  ))}
                </div>
              </div>

              <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] text-center font-sf-text">Sync duration configuration</p>
             </div>
           </div>
          </div>
        </div>
       </div>
      </div>
     )}

     {activeView === 'Jobs' && (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
       <div className="card-premium p-8 flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
        <div className="flex-grow relative w-full">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)] opacity-50" />
         <input 
          type="text" 
          placeholder="Search specialized roles or companies..." 
          className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-5 pl-16 pr-8 text-sm font-semibold text-white focus:outline-none focus:border-#c4eec6/40 transition-all placeholder:"
         />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
         <button className="btn-secondary py-5 px-10 text-[10px] font-bold uppercase tracking-widest">Priority Ranking</button>
         <button className="btn-primary py-5 px-12 text-[10px] font-bold uppercase tracking-widest shadow-2xl">Find Now</button>
        </div>
       </div>

       <div className="grid md:grid-cols-2 gap-10">
        {allJobs.length === 0 ? (
         <p className="text-[var(--color-text-muted)] text-center py-20 col-span-2">Initializing career discovery matrix...</p>
        ) : (
         allJobs.map((job) => (
          <div key={job._id} className="card-premium group hover:shadow-2xl transition-all duration-700 flex flex-col justify-between p-10">
           <div className="space-y-8">
            <div className="flex justify-between items-start">
             <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center group-hover:border-#c4eec6/30 transition-all duration-500 shadow-sm shrink-0">
              <span className="text-2xl font-bold text-#c4eec6 opacity-20">{job.company?.[0] || 'C'}</span>
             </div>
             <div className="px-4 py-2 rounded-2xl bg-#c4eec6/10 text-#c4eec6 text-[10px] font-bold border border-#c4eec6/10 uppercase tracking-[0.2em]">
              {Math.floor(Math.random() * 20 + 80)}% Fit
             </div>
            </div>
            <div>
             <h3 className="text-3xl font-display font-bold text-white group-hover:text-#c4eec6 transition-colors tracking-tighter leading-tight mb-2">{job.title}</h3>
             <p className="text-lg font-bold text-#c4eec6 tracking-tight opacity-70">{job.company}</p>
            </div>
            <p className="text-sm font-medium text-[var(--color-text-muted)] line-clamp-3 leading-relaxed">{job.description}</p>
            <div className="flex flex-wrap gap-4">
             {job.location && <span className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{job.location}</span>}
             {job.type && <span className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{job.type}</span>}
             {job.salaryRange && <span className="px-4 py-2 bg-#c4eec6/10 rounded-xl border border-#c4eec6/10 text-[10px] font-bold text-#c4eec6 uppercase tracking-widest">{job.salaryRange}</span>}
            </div>
           </div>
           <div className="pt-10 mt-10 border-t border-white/5 flex gap-4">
            <button onClick={() => setSelectedJob(job)} className="btn-secondary py-4 flex-1 text-[10px] font-bold uppercase tracking-widest">Details</button>
            <button 
             onClick={() => handleApplyClick(job)} 
             disabled={appliedJobs.includes(job._id)}
             className={`py-4 flex-1 text-[10px] font-bold uppercase tracking-widest transition-all ${
              appliedJobs.includes(job._id) ? 'bg-green-600/20 text-green-400 border border-green-500/30 cursor-default rounded-[1.5rem]' : 'btn-primary'
             }`}
            >
             {appliedJobs.includes(job._id) ? 'Applied ✓' : 'Apply'}
            </button>
           </div>
          </div>
         ))
        )}
       </div>
      </div>
     )}

     {(activeView === 'Preparation' || activeView === 'Applications') && (
      <div className="flex flex-col items-center justify-center py-40 space-y-10 animate-in zoom-in duration-700">
       <div className="w-32 h-32 bg-#c4eec6/10 rounded-[3rem] flex items-center justify-center border border-#c4eec6/20 shadow-2xl group relative overflow-hidden">
        <LayoutDashboard className="w-12 h-12 text-#c4eec6 opacity-40 group-hover:opacity-100 transition-opacity animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-br from-#c4eec6/20 to-transparent"></div>
       </div>
       <div className="text-center space-y-4">
        <h3 className="text-4xl font-display font-bold text-white tracking-tighter ">{activeView} Optimization</h3>
        <p className="text-lg font-medium text-[var(--color-text-muted)] max-w-lg mx-auto opacity-70">Our neural engine is currently prioritizing your profile matrix. This module will be synchronized shortly.</p>
       </div>
       <button onClick={() => setActiveView('Overview')} className="btn-secondary py-4 px-12 text-[10px] font-bold uppercase tracking-widest hover:border-#c4eec6/40 transition-all">Synchronize Dashboard</button>
      </div>
     )}
    </div>
   )}

   {/* APPLY MODAL */}
   {showApplyModal && jobToApply && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl">
     <div className="relative w-full max-w-xl bg-[#09090b] rounded-[3rem] border border-white/10 shadow-2xl p-12 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-#c4eec6 to-transparent opacity-30"></div>
      <button onClick={() => setShowApplyModal(false)} className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all">✕</button>
      
      <h2 className="text-3xl font-display font-bold text-white tracking-tighter mb-3">Apply for {jobToApply.title}</h2>
      <p className="text-sm text-[var(--color-text-muted)] font-medium mb-10 opacity-70">Initiate your neural career synchronization for {jobToApply.company}.</p>
      
      <form onSubmit={handleApplySubmit} className="space-y-6">
       <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Full Name</label>
        <input required type="text" value={applyForm.name} onChange={(e) => setApplyForm({...applyForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-#c4eec6/40 focus:outline-none transition-all" placeholder="John Doe" />
       </div>
       <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Email Address</label>
        <input required type="email" value={applyForm.email} onChange={(e) => setApplyForm({...applyForm, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-#c4eec6/40 focus:outline-none transition-all" placeholder="john@example.com" />
       </div>
       <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Resume File (PDF/DOCX)</label>
        <input required type="file" accept=".pdf,.doc,.docx" onChange={(e) => setApplyFile(e.target.files[0])} className="w-full text-sm text-[var(--color-text-muted)] file:mr-6 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-white/5 file:text-white hover:file:bg-white/10 cursor-pointer" />
       </div>
       
       <div className="pt-6 flex gap-4">
        <button type="button" onClick={() => setShowApplyModal(false)} className="btn-secondary py-5 px-10 text-[10px] font-bold uppercase tracking-widest w-1/3">Cancel</button>
        <button type="submit" disabled={isApplying} className="btn-primary py-5 px-10 text-[10px] font-bold uppercase tracking-widest w-2/3 shadow-2xl disabled:opacity-50">
         {isApplying ? 'Synchronizing...' : 'Submit Application'}
        </button>
       </div>
      </form>
     </div>
    </div>
   )}

   {/* JOB DETAILS MODAL */}
   {selectedJob && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl">
     <div className="relative w-full max-w-3xl bg-[#030712] rounded-[3rem] border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-12">
      <button onClick={() => setSelectedJob(null)} className="absolute top-10 right-10 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all">✕</button>
      
      <div className="space-y-12">
       <div className="flex gap-8 items-start border-b border-white/5 pb-10">
        <div className="w-24 h-24 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center shadow-inner shrink-0">
         <span className="text-5xl font-bold text-lime-400 opacity-20">{selectedJob.company?.[0] || 'C'}</span>
        </div>
        <div className="space-y-3 pt-2">
         <h2 className="text-5xl font-display font-bold text-white tracking-tighter leading-none ">{selectedJob.title}</h2>
         <p className="text-2xl font-bold text-lime-400 tracking-tight opacity-70">{selectedJob.company}</p>
        </div>
       </div>

       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
         { label: 'Location', val: selectedJob.location },
         { label: 'Type', val: selectedJob.type },
         { label: 'Experience', val: selectedJob.experienceLevel },
         { label: 'Salary', val: selectedJob.salaryRange }
        ].map((badge, idx) => badge.val ? (
         <div key={idx} className="p-6 bg-white/5 border border-white/5 rounded-[2rem]">
          <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-widest mb-2 opacity-50">{badge.label}</p>
          <p className="text-sm font-bold text-white ">{badge.val}</p>
         </div>
        ) : null)}
       </div>

       <div className="space-y-6">
        <h3 className="text-[10px] font-bold uppercase text-lime-400 tracking-[0.3em] ">Role Intelligence</h3>
        <p className="text-lg font-medium text-[var(--color-text-muted)] leading-relaxed opacity-80">{selectedJob.description}</p>
       </div>

       {selectedJob.requirements && selectedJob.requirements.length > 0 && (
        <div className="space-y-6">
         <h3 className="text-[10px] font-bold uppercase text-lime-400 tracking-[0.3em] ">Matching Requirements</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedJob.requirements.map((req, i) => (
           <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-[2rem] border border-white/5">
            <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0 mt-0.5 opacity-40" />
            <span className="text-sm font-bold text-white opacity-80">{req}</span>
           </div>
          ))}
         </div>
        </div>
       )}

       <div className="pt-8">
        <button onClick={() => setSelectedJob(null)} className="w-full btn-primary py-5 text-[10px] font-bold tracking-[0.3em] uppercase shadow-2xl">Return to Dashboard</button>
       </div>
      </div>
     </div>
    </div>
   )}
  </Sidenavbar>
 );
}
