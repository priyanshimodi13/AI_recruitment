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
import Toast from '@/components/UI/Toast';
import SelectionResultScreen from '@/components/SelectionResultScreen';
import InterviewScheduler from '@/components/InterviewScheduler';
import { InfinityLoader } from '@/components/UI/loader-13';
import { Mail, Phone, FileText, Save, Check } from 'lucide-react';
import ProfileView from '@/components/ProfileView';
import NotificationView from '@/components/NotificationView';

// Toast State Hook Helper
const useToasts = () => {
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  return { toasts, addToast, removeToast };
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5957';

export default function Dashboard() {
 const { user } = useUser();
 const { toasts, addToast, removeToast } = useToasts();
 const { getToken } = useAuth();
 const navigate = useNavigate();
 const [jobs, setJobs] = useState([]);
 const [allJobs, setAllJobs] = useState([]);
 const [loadingJobs, setLoadingJobs] = useState(true);
 const [activeView, setActiveView] = useState('Dashboard'); // Dashboard, Job Matches, Interviews, Applications
 const [selectedJob, setSelectedJob] = useState(null);
 const [activeSessions, setActiveSessions] = useState([]);
 const [loadingSessions, setLoadingSessions] = useState(true);
 const [userRole, setUserRole] = useState(null);
 const [appliedJobs, setAppliedJobs] = useState([]);
 const [interviews, setInterviews] = useState([]);
 const [loadingInterviews, setLoadingInterviews] = useState(false);
 const [applyingJobId, setApplyingJobId] = useState(null);

 // Apply Modal State
 const [showApplyModal, setShowApplyModal] = useState(false);
 const [jobToApply, setJobToApply] = useState(null);
 const [applyForm, setApplyForm] = useState({ name: '', email: '', phone: '' });
 const [applyFile, setApplyFile] = useState(null);
 const [isApplying, setIsApplying] = useState(false);
 const [triggerPostJob, setTriggerPostJob] = useState(0);
 const [userApplications, setUserApplications] = useState([]);
 const [loadingApps, setLoadingApps] = useState(false);
 const [userResume, setUserResume] = useState(null);
 const [loadingResume, setLoadingResume] = useState(false);
 const [selectionResult, setSelectionResult] = useState(null);
 const [selectionJobMeta, setSelectionJobMeta] = useState(null);
 const [showScheduler, setShowScheduler] = useState(false);

 const fetchUserApplications = async () => {
   try {
     setLoadingApps(true);
     const token = await getToken();
     const res = await fetch(`${API_URL}/api/applications`, {
       headers: { Authorization: `Bearer ${token}` }
     });
      if (res.ok) {
        const data = await res.json();
        setUserApplications(data);
        setAppliedJobs(data.map(app => app.jobId?._id).filter(Boolean));
      }
   } catch (err) {
     console.error('Error fetching user apps:', err);
   } finally {
     setLoadingApps(false);
   }
 };

 const fetchUserResume = async () => {
   try {
     setLoadingResume(true);
     const token = await getToken();
     const res = await fetch(`${API_URL}/api/resumes/my-latest`, {
       headers: { Authorization: `Bearer ${token}` }
     });
     if (res.ok) {
       const result = await res.json();
       setUserResume(result.data);
     }
   } catch (err) {
     console.error('Error fetching user resume:', err);
   } finally {
     setLoadingResume(false);
   }
 };

 const handlePostJobClick = () => {
  if (userRole === 'employer') {
   setTriggerPostJob(prev => prev + 1);
  } else {
   setActiveView('Jobs');
  }
 };

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
    if (resumeData.data.skills && resumeData.data.skills.length > 0) {
      extractedSkills = resumeData.data.skills;
    }
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
     const appData = await resApp.json();
     setAppliedJobs([...appliedJobs, jobToApply._id]);
     setShowApplyModal(false);
     
     // Store the full result + job context, show SelectionResultScreen
     setSelectionResult(appData);
     setSelectionJobMeta({ 
       jobId: jobToApply._id, 
       jobTitle: jobToApply.title, 
       companyName: jobToApply.company,
       submissionId: appData._id 
     });

     setJobToApply(null);
     setApplyForm({ name: '', email: '', phone: '' });
     setApplyFile(null);
    } else {
     addToast("Failed to submit application. Please verify your neural link.", 'error');
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
    setJobs(data.slice(0, 6)); // Show top 6 for a more populated dashboard
    setLoadingJobs(false);
   })
   .catch(err => {
    console.error(err);
    setLoadingJobs(false);
   });
 }, []);

 useEffect(() => {
   if (activeView === 'Applications') {
    fetchUserApplications();
   }
   if (activeView === 'Dashboard') {
    fetchUserResume();
   }
   if (activeView === 'Interviews') {
    fetchUserInterviews();
   }
  }, [activeView, getToken]);

  const fetchUserInterviews = async () => {
    try {
      setLoadingInterviews(true);
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/interviews/my-interviews`, {
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
  const checkAndInitRole = async () => {
   // 1. Instant Cache Check: Look for intended role OR previously saved role
   const localIntendedRole = localStorage.getItem('intendedRole');
   const cachedRole = localStorage.getItem('userRoleCache');
   
   if (localIntendedRole) {
    setUserRole(localIntendedRole);
   } else if (cachedRole) {
    setUserRole(cachedRole);
   }

   try {
    const token = await getToken();
    const res = await fetch(`${API_URL}/api/users/profile`, {
     headers: { Authorization: `Bearer ${token}` }
    });
    
    let finalRole = null;

    if (res.ok) {
     const data = await res.json();
     if (data.isAdmin) {
      navigate('/admin');
      return;
     }
     const dbRole = data.role;
     
     // 2. Handle Intended Role Sync
     if (localIntendedRole && localIntendedRole !== dbRole) {
      try {
       await fetch(`${API_URL}/api/users/role`, {
        method: 'PUT',
        headers: { 
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ role: localIntendedRole })
       });
       finalRole = localIntendedRole;
      } catch(err) {
       console.error("Failed to save role", err);
       finalRole = localIntendedRole; // Keep it locally even if backend fails
      }
     } else {
      finalRole = dbRole;
     }

     // 3. Update Cache for next time
     if (finalRole) {
      localStorage.setItem('userRoleCache', finalRole);
     }
    }
    
    // Cleanup storage
    if (localStorage.getItem('intendedRole')) {
     localStorage.removeItem('intendedRole');
    }

    if (finalRole) {
     setUserRole(finalRole);
    } else if (!userRole) {
     setUserRole('candidate'); // Ultimate fallback
    }
   } catch (err) {
    console.error('Error initializing role:', err);
    // If backend fails but we have a local role, keep using it
    setUserRole(prev => prev || 'candidate');
   }
  };
  checkAndInitRole();
 }, [getToken, navigate]);

 useEffect(() => {
  const fetchSessions = async () => {
   try {
     const token = await getToken();
     if (!token) return;
     const res = await fetch(`${API_URL}/api/users/sessions`, {
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
    onPostJob={handlePostJobClick}
   >
    {activeView === 'Profile' ? (
      <ProfileView 
        user={user} 
        userRole={userRole} 
        getToken={getToken} 
        addToast={addToast} 
      />
    ) : !userRole ? (
     <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-pulse">
      <InfinityLoader size={80} className="text-[#c4eec6]" />
      <p className="text-[10px] font-bold text-[#c4eec6] uppercase tracking-[0.4em]">Synchronizing Neural Profile...</p>
     </div>
    ) : userRole === 'employer' ? (
     <EmployerDashboard activeView={activeView} setActiveView={setActiveView} triggerPostJob={triggerPostJob} />
    ) : (
    <div className="space-y-12 animate-fade-in">
     {activeView === 'Dashboard' && (
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
           {jobs.length > 0 ? jobs.map((job, i) => (
            <div key={job._id} className="card-premium !rounded-[1.5rem] !p-5 space-y-4 group hover:border-white/20 transition-all duration-500 relative overflow-hidden">
             <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
               <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                <span className="text-lg font-bold opacity-30 font-sf-display">{job.company?.[0] || 'J'}</span>
               </div>
               <div>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest font-sf-text">{job.company}</p>
                <div className="flex items-center gap-2">
                 <p className="text-xs font-bold text-white tracking-tight font-sf-text">{job.title}</p>
                 {appliedJobs.includes(job._id) && (
                  <span className="px-1.5 py-0.5 rounded-md bg-lime-400/20 text-[#c4eec6] text-[7px] font-bold uppercase tracking-widest">Applied</span>
                 )}
                </div>
               </div>
              </div>
              <button onClick={() => setSelectedJob(job)} className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#c4eec6] group-hover:text-black transition-all">
               <ChevronRight className="w-3.5 h-3.5" />
              </button>
             </div>



             <div className="h-14 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 120 40">
               <path d="M0 30 Q 15 10, 30 25 T 60 15 T 90 20 T 120 5" fill="none" stroke="currentColor" strokeWidth="2" className={`${i === 0 ? 'text-purple-400' : 'text-[#c4eec6]'} opacity-50`} />
               <path d="M0 30 Q 15 10, 30 25 T 60 15 T 90 20 T 120 5 L 120 40 L 0 40 Z" fill="currentColor" className={`${i === 0 ? 'text-purple-400' : 'text-[#c4eec6]'} opacity-10`} />
               <circle cx="120" cy="5" r="2.5" fill="currentColor" className={i === 0 ? 'text-purple-400' : 'text-[#c4eec6]'} />
              </svg>
              <div className="absolute right-0 bottom-0 text-[8px] font-bold text-white/30 font-sf-text">
               {job.salaryRange || '$140k - $180k'}
              </div>
             </div>
            </div>
           )) : (
            <div className="col-span-3 py-10 text-center text-white/20 font-bold uppercase tracking-widest text-[10px]">No active job nodes detected.</div>
           )}
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

            <h2 className="text-xl font-display font-bold text-white tracking-tight leading-none mb-3">Live Opportunities</h2>
            <div className="space-y-4 mb-8">
              {allJobs.length > 0 ? allJobs.slice(0, 4).map((j, i) => (
                <div key={i} className="flex items-center justify-between group/item cursor-pointer" onClick={() => setSelectedJob(j)}>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-white group-hover/item:text-[#c4eec6] transition-colors">{j.title}</p>
                    <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{j.company}</p>
                  </div>
                  <ChevronRight className="w-3 h-3 text-white/20 group-hover/item:text-[#c4eec6] transition-all" />
                </div>
              )) : (
                <p className="text-xs font-medium text-white/50 leading-relaxed max-w-[240px]">
                  Explore the latest high-tier engineering roles available now.
                </p>
              )}
            </div>
          </div>

          <div className="relative z-10 space-y-3">
           <button onClick={() => setActiveView('Jobs')} className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-400/80 to-indigo-400/80 text-black text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
            Connect Neural Link <LayoutDashboard className="w-3.5 h-3.5" />
           </button>
           <button onClick={() => setActiveView('Jobs')} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            Browse All Nodes <Search className="w-3.5 h-3.5" />
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
            <button 
              onClick={() => navigate('/upload-resume')}
              className="btn-primary !py-3 !px-8 text-[10px] font-bold uppercase tracking-widest shadow-2xl shadow-[#c4eec6]/20"
            >
             {userResume ? 'Update Resume' : 'Upload Resume'}
            </button>
          </div>
          
          {userResume && userResume.skills && userResume.skills.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {userResume.skills.slice(0, 8).map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-lime-400 uppercase tracking-widest backdrop-blur-md hover:border-lime-400/30 transition-all">
                  {skill}
                </span>
              ))}
              {userResume.skills.length > 8 && (
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold text-white/40 uppercase tracking-widest">
                  +{userResume.skills.length - 8} More
                </span>
              )}
            </div>
          )}
         </div>

         
         {/* Decorative elements */}
         <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-1000"></div>
         <div className="absolute top-1/2 right-10 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
        </div>

        <div className="col-span-12 xl:col-span-4 flex flex-col gap-4">
          <div className="card-premium !rounded-[1.5rem] !p-6 flex-1 flex flex-col justify-between">
           <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-2">Neural Alignment</p>
           <div className="flex items-baseline gap-2 mb-3">
             <span className="text-2xl font-display font-bold text-white tracking-tight">
               {userResume ? '94.2%' : 'Pending'}
             </span>
             <span className="text-[9px] font-bold text-[#c4eec6] uppercase tracking-widest">
               {userResume ? 'High' : 'Scan Required'}
             </span>
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-[#c4eec6]" style={{ width: userResume ? '94.2%' : '0%' }}></div>
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
        <div className="card-premium p-6 flex flex-col md:flex-row gap-5 items-center relative overflow-hidden">
         <div className="flex-grow relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] opacity-50" />
          <input 
           type="text" 
           placeholder="Search roles or companies..." 
           className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-14 pr-8 text-xs font-semibold text-white focus:outline-none focus:border-[#c4eec6]/40 transition-all"
          />
         </div>
         <div className="flex gap-3 w-full md:w-auto">
          <button className="btn-secondary py-3.5 px-6 text-[9px] font-bold uppercase tracking-widest">Filter</button>
          <button className="btn-primary py-3.5 px-8 text-[9px] font-bold uppercase tracking-widest shadow-2xl">Search</button>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allJobs.length === 0 ? (
         <p className="text-[var(--color-text-muted)] text-center py-20 col-span-2">Initializing career discovery matrix...</p>
        ) : (
         allJobs.map((job) => (
           <div key={job._id} className="card-premium group hover:shadow-2xl transition-all duration-700 flex flex-col justify-between p-7">
            <div className="space-y-6">
             <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center group-hover:border-[#c4eec6]/30 transition-all duration-500 shadow-sm shrink-0">
               <span className="text-xl font-bold text-[#c4eec6] opacity-20">{job.company?.[0] || 'C'}</span>
              </div>

             </div>
             <div>
              <h3 className="text-xl font-display font-bold text-white group-hover:text-[#c4eec6] transition-colors tracking-tight leading-tight mb-1">{job.title}</h3>
              <p className="text-sm font-bold text-[#c4eec6] tracking-tight opacity-70">{job.company}</p>
             </div>
             <p className="text-xs font-medium text-[var(--color-text-muted)] line-clamp-3 leading-relaxed opacity-60">{job.description}</p>
             <div className="flex flex-wrap gap-2">
              {job.location && <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[8px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{job.location}</span>}
              {job.type && <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[8px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{job.type}</span>}
              {job.salaryRange && <span className="px-3 py-1 bg-[#c4eec6]/10 rounded-lg border border-[#c4eec6]/10 text-[8px] font-bold text-[#c4eec6] uppercase tracking-widest">{job.salaryRange}</span>}
             </div>
            </div>
            <div className="pt-6 mt-6 border-t border-white/5 flex gap-3">
             <button onClick={() => setSelectedJob(job)} className="btn-secondary py-3 flex-1 text-[9px] font-bold uppercase tracking-widest">Details</button>
             <button 
              onClick={() => handleApplyClick(job)} 
              disabled={appliedJobs.includes(job._id)}
              className={`py-3 flex-1 text-[9px] font-bold uppercase tracking-widest transition-all ${
               appliedJobs.includes(job._id) ? 'bg-green-600/20 text-green-400 border border-green-500/30 cursor-default rounded-xl' : 'btn-primary'
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

     {activeView === 'Applications' && (
       <div className="space-y-10 animate-fade-in pb-20">
        <div className="flex justify-between items-end px-2">
         <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">My Applications</h2>
          <p className="text-xs text-[var(--color-text-muted)] font-medium">Track the status of your submitted job applications.</p>
         </div>
        </div>

        {loadingApps ? (
         <div className="text-center py-20 text-white/20 font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Data...</div>
        ) : userApplications.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userApplications.map((app) => (
           <div key={app._id} className="card-premium p-8 group relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
             <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-lime-400/30 transition-all">
               <span className="text-xl font-bold text-[#c4eec6] opacity-30">{app.jobId?.company?.[0] || 'J'}</span>
              </div>
              <div>
               <h3 className="text-lg font-bold text-white group-hover:text-[#c4eec6] transition-colors">{app.jobId?.title || 'Unknown Role'}</h3>
               <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{app.jobId?.company || 'Unknown Company'}</p>
              </div>
             </div>
             <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
              app.status === 'Accepted' || app.status === 'Round 1 Selected' ? 'bg-lime-400/10 text-[#c4eec6] border-lime-400/20' :
              app.status === 'Rejected' ? 'bg-red-400/10 text-red-400 border-red-400/20' :
              'bg-blue-400/10 text-blue-400 border-blue-400/20'
             }`}>
              {app.status}
             </div>
            </div>

            <div className="space-y-4">
             <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
              <span className="text-white/30">Match Score</span>
              <span className="text-[#c4eec6]">{app.matchPercentage || Math.floor(Math.random() * 15 + 80)}%</span>
             </div>
             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-[#c4eec6] transition-all duration-1000" style={{ width: `${app.matchPercentage || 85}%` }}></div>
             </div>
             
             {app.aiFeedback && (
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-medium text-white/60 italic leading-relaxed">
                  {app.aiFeedback}
                </p>
              </div>
             )}

             <div className="pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
              <button className="text-[9px] font-bold text-[#c4eec6] uppercase tracking-[0.2em] hover:scale-105 transition-all">View Details &rarr;</button>
             </div>
            </div>
           </div>
          ))}
         </div>
        ) : (
         <div className="flex flex-col items-center justify-center py-40 space-y-10">
          <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 opacity-20">
           <Briefcase className="w-10 h-10 text-white" />
          </div>
          <div className="text-center space-y-3">
           <p className="text-sm font-bold text-white/30 uppercase tracking-widest">No active synchronizations detected</p>
           <button onClick={() => setActiveView('Jobs')} className="text-[10px] font-bold text-[#c4eec6] uppercase tracking-[0.3em] hover:opacity-80 transition-all">Browse Opportunities</button>
          </div>
         </div>
        )}
        </div>
      )}

      {activeView === 'Interviews' && (
        <div className="space-y-12 animate-fade-in pb-20">
          <div className="flex justify-between items-end px-2">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold text-white tracking-tighter">My Interviews</h2>
              <p className="text-xs text-[var(--color-text-muted)] font-medium">Track and prepare for your upcoming neural synchronizations.</p>
            </div>
          </div>

          {loadingInterviews ? (
            <div className="text-center py-20 text-white/20 font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Interview Stream...</div>
          ) : interviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {interviews.map((interview) => (
                <div key={interview._id} className="card-premium p-8 group relative overflow-hidden flex flex-col justify-between h-full">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#c4eec6]/30 transition-all">
                          <span className="text-xl font-bold text-[#c4eec6] opacity-30">{interview.jobId?.company?.[0] || 'J'}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-[#c4eec6] transition-colors">{interview.jobId?.title}</h3>
                          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{interview.jobId?.company}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                        interview.status === 'Scheduled' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' :
                        interview.status === 'Completed' ? 'bg-[#c4eec6]/10 text-[#c4eec6] border-[#c4eec6]/20' :
                        'bg-red-400/10 text-red-400 border-red-400/20'
                      }`}>
                        {interview.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Date</p>
                        <p className="text-xs font-bold text-white">
                          {new Date(interview.scheduledDateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Time</p>
                        <p className="text-xs font-bold text-white">
                          {new Date(interview.scheduledDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-white/50">
                      <div className="w-2 h-2 rounded-full bg-[#c4eec6] animate-pulse"></div>
                      Mode: {interview.interviewMode}
                    </div>
                  </div>

                  <div className="pt-8 mt-4 border-t border-white/5 flex gap-4">
                    {interview.interviewLink && (
                      <button 
                        onClick={() => window.open(interview.interviewLink, '_blank')}
                        className="btn-primary py-3.5 flex-1 text-[9px] font-bold uppercase tracking-widest"
                      >
                        Join Meeting
                      </button>
                    )}
                    <button className="btn-secondary py-3.5 flex-1 text-[9px] font-bold uppercase tracking-widest">Preparation Guide</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 space-y-10">
              <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 opacity-20">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <div className="text-center space-y-3">
                <p className="text-sm font-bold text-white/30 uppercase tracking-widest">No scheduled interviews detected</p>
                <button onClick={() => setActiveView('Dashboard')} className="text-[10px] font-bold text-[#c4eec6] uppercase tracking-[0.3em] hover:opacity-80 transition-all">Back to Dashboard</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeView === 'Notifications' && (
        <NotificationView getToken={getToken} />
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

   {/* ── SELECTION RESULT SCREEN ─────────────────────────────────────── */}
   {selectionResult && selectionJobMeta && !showScheduler && (
    <SelectionResultScreen
     result={{
      ...selectionResult,
      jobTitle:    selectionJobMeta.jobTitle,
      companyName: selectionJobMeta.companyName,
     }}
     candidateEmail={user?.primaryEmailAddress?.emailAddress}
     onScheduleClick={() => setShowScheduler(true)}
     onViewJobsClick={() => { setSelectionResult(null); setSelectionJobMeta(null); setActiveView('Jobs'); }}
     onDismiss={() => { setSelectionResult(null); setSelectionJobMeta(null); }}
    />
   )}

   {/* ── INTERVIEW SCHEDULER ─────────────────────────────────────────── */}
   {showScheduler && selectionJobMeta && (
    <InterviewScheduler
     submissionId={selectionJobMeta.submissionId}
     jobId={selectionJobMeta.jobId}
     jobTitle={selectionJobMeta.jobTitle}
     companyName={selectionJobMeta.companyName}
     onSuccess={() => {
      setShowScheduler(false);
      setSelectionResult(null);
      setSelectionJobMeta(null);
      fetchUserApplications(); // Refresh to show new status
     }}
     onClose={() => setShowScheduler(false)}
    />
   )}


    {/* DYNAMIC TOAST SYSTEM */}
    {toasts.map(toast => (
      <Toast 
        key={toast.id} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => removeToast(toast.id)} 
      />
    ))}
  </Sidenavbar>
 );
}
