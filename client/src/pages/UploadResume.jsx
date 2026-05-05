import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { CheckCircle2 } from 'lucide-react';
import SelectionResultScreen from '../components/SelectionResultScreen';
import InterviewScheduler from '../components/InterviewScheduler';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5957';

export default function UploadResume() {
 const navigate = useNavigate();
 const { getToken } = useAuth();
 const { user } = useUser();
 const [form, setForm] = useState({
  name: '',
  email: '',
  phone: '',
  position: '',
 });
 const [file, setFile] = useState(null);
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState('');
 const [error, setError] = useState('');

 const [extractedSkills, setExtractedSkills] = useState([]);
 const [suggestedJobs, setSuggestedJobs] = useState([]);
 const [uploadedResumeId, setUploadedResumeId] = useState(null);
 const [uploadedResumeUrl, setUploadedResumeUrl] = useState(null);
 const [appliedJobIds, setAppliedJobIds] = useState([]);
 const [applyingTo, setApplyingTo] = useState(null);
 const [debugInfo, setDebugInfo] = useState(null);
 const [selectionResult, setSelectionResult]       = useState(null);  // holds full API result
 const [selectionJobMeta, setSelectionJobMeta]     = useState(null);  // { jobId, jobTitle, companyName }
 const [showScheduler, setShowScheduler]           = useState(false);

 const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
 };

 const handleFileChange = (e) => {
  setFile(e.target.files[0]);
  setError('');
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccess('');
  setError('');
  setExtractedSkills([]);
  setSuggestedJobs([]);
  setUploadedResumeId(null);
  setAppliedJobIds([]);
  setDebugInfo(null);

  if (!file) {
   setError('Please select a resume file.');
   return;
  }

  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('email', form.email);
  formData.append('phone', form.phone);
  formData.append('position', form.position);
  formData.append('resume', file);

  try {
   setLoading(true);
   const response = await axios.post(`${API_URL}/api/resumes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
   });

   setSuccess('✅ Resume submitted successfully! We will get back to you soon.');
   
   if (response.data.debug) {
    console.log("Backend Debug Info:", response.data.debug);
    setDebugInfo(response.data.debug);
   }

   if (response.data.data) {
    setUploadedResumeId(response.data.data._id);
    if (response.data.data.filePath) {
     setUploadedResumeUrl(response.data.data.filePath);
    }
    if (response.data.data.skills) {
     setExtractedSkills(response.data.data.skills);
    }
   }
   
   if (response.data.suggestedJobs) {
    setSuggestedJobs(response.data.suggestedJobs);
   }
   setForm({ name: '', email: '', phone: '', position: '' });
   setFile(null);
   // Reset file input
   e.target.reset();
  } catch (err) {
   setError(
    err.response?.data?.message || '❌ Something went wrong. Please try again.'
   );
  } finally {
   setLoading(false);
  }
 };

 const handleQuickApply = async (jobId, jobTitle, companyName = '') => {
  if (!uploadedResumeId) return;
  setApplyingTo(jobId);
  setError('');
  try {
   // Mark the resume as applied in the resume collection
   await axios.patch(`${API_URL}/api/resumes/${uploadedResumeId}/apply`, {
    positionTitle: jobTitle
   });

   const token = await getToken();
   const resApp = await fetch(`${API_URL}/api/applications`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
     jobId,
     resumeUrl: uploadedResumeUrl || 'Applied via Quick Apply',
     coverLetter: 'Applied via Upload Resume AI Matcher.',
     extractedSkills: extractedSkills
    })
   });

   setAppliedJobIds(prev => [...prev, jobId]);

   if (resApp.ok) {
     const appData = await resApp.json();
     // Store the full result + job context, show SelectionResultScreen
     setSelectionResult(appData);
     setSelectionJobMeta({ jobId, jobTitle, companyName, submissionId: appData._id });
   } else {
     setSuccess(`✅ Automatically applied! You are now visible to the employer for the ${jobTitle} position.`);
   }
  } catch (err) {
   setError(err.response?.data?.message || '❌ Failed to apply. Please try again.');
  } finally {
   setApplyingTo(null);
  }
 };

 return (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 bg-[var(--color-bg)] animate-fade-in">
   <div className="w-full max-w-xl mb-8 flex justify-start">
    <button 
     onClick={() => navigate(-1)}
     className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--color-text-muted)] hover:text-white transition-all group text-xs font-bold uppercase tracking-widest "
    >
     <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
     </svg>
     Return to Portal
    </button>
   </div>

   <div className="w-full max-w-xl card-premium space-y-10 relative overflow-hidden group">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-30"></div>
    
    <div className="space-y-4">
     <h1 className="text-4xl font-display font-bold text-white tracking-tighter ">Upload Intelligence</h1>
     <p className="text-sm font-medium text-[var(--color-text-muted)] opacity-70">
      Let our neural engine analyze your career trajectory and synchronize matches.
     </p>
    </div>

    {success && (
     <div className="p-4 rounded-2xl bg-green-400/10 border border-green-400/20 text-green-400 text-[11px] font-bold uppercase tracking-widest animate-in slide-in-from-top duration-500">
      {success}
     </div>
    )}
    {error && (
     <div className="p-4 rounded-2xl bg-red-400/10 border border-red-400/20 text-red-400 text-[11px] font-bold uppercase tracking-widest animate-in slide-in-from-top duration-500">
      {error}
     </div>
    )}

    {extractedSkills.length > 0 && (
     <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6">
      <div className="flex items-center gap-4">
       <div className="w-10 h-10 bg-lime-400/10 rounded-2xl flex items-center justify-center border border-lime-400/20 shadow-sm">
        <svg className="w-5 h-5 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
       </div>
       <h3 className="text-sm font-bold text-white uppercase tracking-widest ">Extracted Neural Skills</h3>
      </div>
      <div className="flex flex-wrap gap-3">
       {extractedSkills.map((skill, index) => (
        <span
         key={index}
         className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-bold text-lime-400 uppercase tracking-widest rounded-xl hover:border-lime-400/30 transition-all cursor-default"
        >
         {skill}
        </span>
       ))}
      </div>
     </div>
    )}

    {suggestedJobs.length > 0 && (
     <div className="space-y-6">
      <div className="flex items-center gap-4 px-2">
       <h3 className="text-sm font-bold text-white uppercase tracking-widest ">Synchronized Opportunities</h3>
       <div className="flex-grow h-px bg-white/10"></div>
      </div>
      <div className="grid gap-6">
       {suggestedJobs.map((job) => (
        <div key={job._id} className="p-6 bg-white/5 border border-white/10 rounded-[2rem] flex flex-col gap-6 group/item hover:border-lime-400/30 transition-all">
         <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
           <h4 className="text-xl font-display font-bold text-white group-hover/item:text-lime-400 transition-colors tracking-tight">{job.title}</h4>
           <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{job.company} &bull; {job.location}</p>
          </div>
          <div className="px-3 py-1.5 bg-lime-400/10 border border-lime-400/10 text-lime-400 text-[9px] font-bold rounded-xl uppercase tracking-widest shrink-0">
           {Math.floor((job.matchCount / job.totalRequirements) * 100)}% Match
          </div>
         </div>
         
         <div className="flex items-center justify-between gap-4">
          <div className="text-[9px] font-bold text-[var(--color-text-muted)] max-w-[200px] line-clamp-1">
           Matched: {job.matchedSkills.join(', ')}
          </div>
          <button
           onClick={() => handleQuickApply(job._id, job.title)}
           disabled={applyingTo === job._id || appliedJobIds.includes(job._id)}
           className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
            appliedJobIds.includes(job._id)
             ? 'bg-green-400/10 text-green-400 border border-green-400/10 cursor-default'
             : 'btn-primary shadow-xl shrink-0'
           }`}
          >
           {appliedJobIds.includes(job._id) 
            ? 'Synchronized ✓' 
            : (applyingTo === job._id ? 'Syncing...' : 'Quick Sync')}
          </button>
         </div>
        </div>
       ))}
      </div>
     </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-8">
     <div className="grid grid-cols-2 gap-8">
      <div className="col-span-2 md:col-span-1 space-y-2">
       <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-2">Full Identity</label>
       <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        placeholder="e.g. Alex Rivera"
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-lime-400/40 focus:outline-none transition-all placeholder:text-white/20"
       />
      </div>

      <div className="col-span-2 md:col-span-1 space-y-2">
       <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-2">Neural Contact</label>
       <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
        placeholder="alex@neural.ai"
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-lime-400/40 focus:outline-none transition-all placeholder:text-white/20"
       />
      </div>

      <div className="col-span-2 md:col-span-1 space-y-2">
       <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-2">Signal Line</label>
       <input
        type="tel"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        required
        placeholder="+91 XXXXX XXXXX"
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-lime-400/40 focus:outline-none transition-all placeholder:text-white/20"
       />
      </div>

      <div className="col-span-2 md:col-span-1 space-y-2">
       <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-2">Target Node</label>
       <input
        type="text"
        name="position"
        value={form.position}
        onChange={handleChange}
        required
        placeholder="e.g. Lead Developer"
        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-semibold text-white focus:border-lime-400/40 focus:outline-none transition-all placeholder:text-white/20"
       />
      </div>

      <div className="col-span-2 space-y-4">
       <label className="text-[10px] uppercase font-bold tracking-widest text-white/40 ml-2">Repository File (.pdf, .doc)</label>
       <div className="relative">
        <input
         type="file"
         accept=".pdf,.doc,.docx"
         onChange={handleFileChange}
         required
         id="resume-upload"
         className="hidden"
        />
        <label 
         htmlFor="resume-upload"
         className="flex flex-col items-center justify-center w-full py-12 bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] cursor-pointer hover:bg-white/10 hover:border-lime-400/30 transition-all group/file"
        >
         <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-4 border border-white/10 group-hover/file:scale-110 transition-transform">
          <svg className="w-8 h-8 text-lime-400 opacity-40 group-hover/file:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
         </div>
         <p className="text-sm font-bold text-white tracking-tight">{file ? file.name : 'Deploy Resume'}</p>
         <p className="text-[10px] font-bold text-[var(--color-text-muted)] mt-2 uppercase tracking-widest">Max Load: 5MB</p>
        </label>
       </div>
      </div>
     </div>

     <button
      type="submit"
      disabled={loading}
      className="w-full btn-primary py-5 text-xs font-bold uppercase tracking-[0.3em] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
     >
      {loading ? (
       <div className="flex items-center justify-center gap-3">
        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
        Analyzing...
       </div>
      ) : (
       <span className="flex items-center justify-center gap-3">
        Initiate Analysis
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
       </span>
      )}
     </button>
    </form>
   </div>

   {/* ── SELECTION RESULT SCREEN ─────────────────────────────────────── */}
   {selectionResult && selectionJobMeta && !showScheduler && (
    <SelectionResultScreen
     result={{
      ...selectionResult,
      jobTitle:    selectionJobMeta.jobTitle,
      companyName: selectionJobMeta.companyName,
     }}
     candidateEmail={user?.primaryEmailAddress?.emailAddress || form.email}
     onScheduleClick={() => setShowScheduler(true)}
     onViewJobsClick={() => { setSelectionResult(null); setSelectionJobMeta(null); navigate('/dashboard'); }}
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
     }}
     onClose={() => setShowScheduler(false)}
    />
   )}

  </div>
 );
}

