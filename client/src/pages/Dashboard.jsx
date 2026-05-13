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
 Package,
 MoreVertical,
 ChevronRight,
 Filter,
 Users
} from 'lucide-react';
import { useUser, useAuth } from '@clerk/clerk-react';
import Sidenavbar from '@/components/UI/sidenavbar';
import Toast from '@/components/UI/Toast';
import SelectionResultScreen from '@/components/SelectionResultScreen';
import InterviewScheduler from '@/components/InterviewScheduler';
import { InfinityLoader } from '@/components/UI/loader-13';
import { Mail, Phone, FileText, Save, Check } from 'lucide-react';
import HelpSupportView from '../components/HelpSupportView';
import ProfileView from '@/components/ProfileView';
import CommunityView from '../components/CommunityView';
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
        
        {/* FULL WIDTH: NEURAL JOB FEED */}
        <div className="col-span-12 space-y-4">
          <div className="flex justify-between items-end px-2">
           <div className="space-y-1">
            <p className="text-[10px] font-bold text-[#c4eec6] uppercase tracking-[0.4em] mb-1">Recommended for You</p>
            <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-bold text-white/40 w-fit">3 New</div>
           </div>
          </div>
          
          <h3 className="text-2xl font-display font-bold text-white tracking-tight uppercase leading-none mb-6">Neural Job Feed</h3>
          <div className="grid grid-cols-1 gap-6 pb-20">
            {jobs.length > 0 ? jobs.map((job, i) => (
              <div key={job._id} className="w-full card-premium !rounded-[2.5rem] !p-0 overflow-hidden group hover:border-[#c4eec6]/40 transition-all duration-700 relative animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                {/* Connection Line Animation */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c4eec6] to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-[2000ms] ease-linear"></div>
                
                <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#c4eec6]/10 group-hover:border-[#c4eec6]/20 transition-all duration-500 shadow-xl shrink-0">
                      <span className="text-3xl font-bold text-[#c4eec6] opacity-30 font-sf-display">{job.company?.[0] || 'J'}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{job.company}</p>
                        {appliedJobs.includes(job._id) && (
                          <div className="px-3 py-1 rounded-full bg-lime-400/20 border border-lime-400/30 text-[#c4eec6] text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Applied
                          </div>
                        )}
                      </div>
                      <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight group-hover:text-[#c4eec6] transition-colors">{job.title}</h4>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-widest pt-2">
                        <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> {job.location || 'Remote'}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                        <span>{job.salaryRange || '$120k+'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t border-white/5 md:border-none">
                    <button onClick={() => setSelectedJob(job)} className="flex-1 md:w-32 py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                      Analysis
                    </button>
                    <button 
                      onClick={() => handleApplyClick(job)}
                      disabled={appliedJobs.includes(job._id)}
                      className={`flex-[2] md:w-48 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest shadow-2xl transition-all ${
                        appliedJobs.includes(job._id) 
                        ? 'bg-white/5 border border-white/10 text-white/20 cursor-default' 
                        : 'btn-primary'
                      }`}
                    >
                      {appliedJobs.includes(job._id) ? 'Linked' : 'Sync Role'}
                    </button>
                  </div>
                </div>

                {/* Background Glow Overlay */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#c4eec6]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              </div>
            )) : (
              <div className="w-full py-20 text-center card-premium !border-dashed !border-white/10 text-white/20 font-bold uppercase tracking-[0.4em] text-[10px]">
                Initializing Job Node Stream...
              </div>
            )}
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
       <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-20">
        <div className="space-y-2">
         <h2 className="text-3xl font-display font-bold text-white tracking-tighter">My Applications</h2>
         <p className="text-sm text-white/40 font-medium">Track the status of your submitted job synchronizations.</p>
        </div>

        {loadingApps ? (
          <div className="py-40 text-center card-premium !border-dashed !border-white/10">
            <div className="w-10 h-10 border-2 border-[#c4eec6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Fetching Application Stream...</p>
          </div>
        ) : userApplications.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {userApplications.map((app, i) => (
              <div key={app._id} className="card-premium p-8 group hover:border-[#c4eec6]/40 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#c4eec6]/10 group-hover:border-[#c4eec6]/20 transition-all duration-500 shadow-xl shrink-0">
                    <Briefcase className="w-8 h-8 text-[#c4eec6] opacity-30" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] font-bold text-[#c4eec6] uppercase tracking-[0.2em]">{app.jobId?.company || 'Organization'}</p>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
                        app.status === 'Accepted' || app.status === 'SCHEDULED' || app.status === 'Round 1 Selected' ? 'bg-lime-400/10 text-lime-400 border-lime-400/20' :
                        app.status === 'Rejected' ? 'bg-red-400/10 text-red-400 border-red-400/20' :
                        'bg-blue-400/10 text-blue-400 border-blue-400/20'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight group-hover:text-[#c4eec6] transition-colors">{app.jobId?.title || 'Applied Position'}</h4>
                    <div className="flex flex-wrap items-center gap-5 text-[10px] font-bold text-white/30 uppercase tracking-widest pt-1">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(app.createdAt).toLocaleDateString()}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10"></span>
                      <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> ID: {app._id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 relative z-10 pt-6 md:pt-0 border-t border-white/5 md:border-none">
                  <button 
                    onClick={() => {
                      setSelectionResult(app);
                      setSelectionJobMeta({
                        jobId: app.jobId?._id,
                        jobTitle: app.jobId?.title,
                        companyName: app.jobId?.company,
                        submissionId: app._id
                      });
                    }}
                    className="flex-1 md:w-44 py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                  >
                    Review Selection
                  </button>
                  {app.status === 'SCHEDULED' && (
                    <button 
                      onClick={() => setActiveView('Interviews')}
                      className="flex-1 md:w-44 py-4 rounded-2xl bg-lime-400 text-black text-[9px] font-bold uppercase tracking-widest hover:bg-lime-500 transition-all shadow-xl shadow-lime-400/20"
                    >
                      View Interview
                    </button>
                  )}
                </div>

                {/* Decoration */}
                <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-[#c4eec6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
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
            <div className="text-center py-40 card-premium !border-dashed !border-white/10">
              <div className="w-10 h-10 border-2 border-[#c4eec6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.4em]">Synchronizing Interview Stream...</p>
            </div>
          ) : interviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 pb-20">
              {interviews.map((interview, i) => (
                <div key={interview._id} className="card-premium p-8 group hover:border-[#c4eec6]/40 transition-all duration-500 relative flex flex-col md:flex-row md:items-center justify-between gap-8 overflow-hidden animate-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#c4eec6]/10 group-hover:border-[#c4eec6]/20 transition-all duration-500 shadow-xl shrink-0">
                      <Calendar className="w-8 h-8 text-[#c4eec6] opacity-40" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold text-[#c4eec6] uppercase tracking-[0.2em]">{interview.jobId?.company}</p>
                        <span className={`px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[8px] font-bold uppercase tracking-widest border border-blue-500/20`}>
                          {interview.status}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight group-hover:text-[#c4eec6] transition-colors">{interview.jobId?.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-widest pt-2">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(interview.scheduledDateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                        <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> {new Date(interview.scheduledDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                        <span className="text-lime-400/60 uppercase">{interview.interviewMode} Session</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto pt-6 md:pt-0 border-t border-white/5 md:border-none relative z-10">
                    {interview.interviewLink && (
                      <button 
                        onClick={() => window.open(interview.interviewLink, '_blank')}
                        className="flex-1 md:w-44 py-4 rounded-2xl bg-[#c4eec6] text-black text-[9px] font-bold uppercase tracking-widest hover:bg-[#c4eec6]/90 transition-all shadow-xl shadow-lime-400/20"
                      >
                        Join Meeting
                      </button>
                    )}
                    <button className="flex-1 md:w-44 py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                      Prep Guide
                    </button>
                  </div>
                  
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#c4eec6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
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

      {activeView === 'Help & Support' && (
        <HelpSupportView addToast={addToast} setActiveView={setActiveView} />
      )}

      {activeView === 'Community' && (
        <CommunityView />
      )}
      </div>
     )}

   {/* APPLY MODAL */}
   {showApplyModal && jobToApply && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl overflow-y-auto">
     <div className="relative w-full max-w-xl bg-[#09090b] rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl p-6 md:p-12 overflow-hidden my-auto">
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
     <div className="relative w-full max-w-3xl bg-[#030712] rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 md:p-12">
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
