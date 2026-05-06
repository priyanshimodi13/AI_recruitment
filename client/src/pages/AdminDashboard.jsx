import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import Sidenavbar from '@/components/UI/sidenavbar';
import PostJobSection from '@/components/UI/PostJobSection';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5957';

// ─── Status Badge ──────────────────────────────────────────────────────────────
const statusBadge = (status) => {
 const styles = {
  pending: 'bg-orange-400/10 text-orange-400 border border-orange-400/20',
  accepted: 'bg-lime-400/10 text-[#c4eec6] border border-lime-400/20',
  rejected: 'bg-red-400/10 text-red-400 border border-red-400/20',
 };
 return (
  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest ${styles[status]}`}>
   {status}
  </span>
 );
};

// ─── Interview Scheduling Modal ────────────────────────────────────────────────
function InterviewModal({ resume, onClose, onConfirm }) {
 const [form, setForm] = useState({
  interviewDate: '',
  interviewTime: '',
  interviewMode: 'Online',
  meetingLink: '',
 });
 const [loading, setLoading] = useState(false);

 const handleChange = (e) =>
  setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

 const handleConfirm = async () => {
  if (!form.interviewDate || !form.interviewTime) {
   alert('Please fill in interview date and time.');
   return;
  }
  setLoading(true);
  await onConfirm(resume._id, form);
  setLoading(false);
 };

 return (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-in fade-in duration-300">
    <div className="w-full max-w-xl card-premium !p-8 space-y-8 relative overflow-hidden group">
     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-30"></div>
     
     <div className="space-y-3">
      <h2 className="text-2xl font-sf-display font-bold text-white tracking-tight uppercase">Interview Scheduling</h2>
      <p className="text-xs font-medium text-[var(--color-text-muted)] opacity-70 leading-relaxed font-sf-text">
       Coordinating interview for <span className="text-[#c4eec6] font-bold uppercase tracking-widest">{resume.name}</span>
      </p>
     </div>
 
     <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
       <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 ml-1 font-sf-text">Interview Date</label>
       <input type="date" name="interviewDate" value={form.interviewDate}
        onChange={handleChange} min={new Date().toISOString().split('T')[0]}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm font-semibold focus:border-lime-400/40 focus:outline-none transition-all font-sf-text" />
      </div>
      <div className="space-y-2">
       <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 ml-1 font-sf-text">Interview Time</label>
       <input type="time" name="interviewTime" value={form.interviewTime}
        onChange={handleChange}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white text-sm font-semibold focus:border-lime-400/40 focus:outline-none transition-all font-sf-text" />
      </div>
      <div className="space-y-2">
       <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 ml-1 font-sf-text">Interview Mode</label>
       <select name="interviewMode" value={form.interviewMode} onChange={handleChange}
        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-5 py-3 text-white text-sm font-semibold focus:border-lime-400/40 focus:outline-none transition-all font-sf-text">
        <option value="Online">Online Meeting</option>
        <option value="In-Person">Office Visit</option>
       </select>
      </div>
      <div className="space-y-2">
       <label className="text-[9px] font-bold uppercase tracking-widest text-white/40 ml-1 font-sf-text">Meeting Link</label>
       <input type="url" name="meetingLink" value={form.meetingLink} onChange={handleChange}
        placeholder="https://meet.google.com/..."
        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/20 text-sm font-semibold focus:border-lime-400/40 focus:outline-none transition-all font-sf-text" />
      </div>
     </div>
 
     <div className="flex gap-4 pt-4">
      <button onClick={onClose}
       className="flex-1 py-4 rounded-xl border border-white/10 text-white/40 hover:bg-white/5 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all font-sf-text">
       Cancel
      </button>
      <button onClick={handleConfirm} disabled={loading}
       className="flex-1 btn-primary py-4 text-[10px] font-bold uppercase tracking-widest shadow-xl font-sf-text">
       {loading ? 'Saving...' : 'Confirm Interview'}
      </button>
     </div>
    </div>
  </div>
 );
}



// ─── Resumes Section ───────────────────────────────────────────────────────────
function ResumesSection() {
 const [resumes, setResumes] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [selectedResume, setSelectedResume] = useState(null);

 useEffect(() => { fetchResumes(); }, []);

 const fetchResumes = async () => {
  try {
   setLoading(true);
   const { data } = await axios.get(`${API_URL}/api/resumes`);
   setResumes(data.data);
  } catch (err) {
   setError(err.response?.data?.message || 'Failed to load resumes.');
  } finally {
   setLoading(false);
  }
 };

 const updateStatus = async (id, status) => {
  try {
   await axios.patch(`${API_URL}/api/resumes/${id}/status`, { status });
   setResumes((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
  } catch (err) {
   alert(err.response?.data?.message || 'Failed to update status.');
  }
 };

 const handleAcceptConfirm = async (id, interviewDetails) => {
  try {
   await axios.patch(`${API_URL}/api/resumes/${id}/status`, {
    status: 'accepted',
    ...interviewDetails,
   });
   setResumes((prev) =>
    prev.map((r) => (r._id === id ? { ...r, status: 'accepted', ...interviewDetails } : r))
   );
   setSelectedResume(null);
  } catch (err) {
   alert(err.response?.data?.message || 'Failed to accept resume.');
  }
 };

 return (
  <div className="space-y-12 animate-fade-in">
   {selectedResume && (
    <InterviewModal
     resume={selectedResume}
     onClose={() => setSelectedResume(null)}
     onConfirm={handleAcceptConfirm}
    />
   )}

   {loading && <div className="text-center py-40 text-white/20 font-bold uppercase tracking-widest text-xs animate-pulse">Decrypting Submissions...</div>}
   {error && (
    <div className="p-6 rounded-[2.5rem] bg-red-400/10 border border-red-400/20 text-red-400 text-[11px] font-bold uppercase tracking-widest ">{error}</div>
   )}
   {!loading && !error && resumes.length === 0 && (
    <div className="text-center py-40 card-premium border-dashed border-white/5 bg-transparent text-white/30 font-bold uppercase tracking-widest text-xs ">No neural profiles submitted yet.</div>
   )}
   {!loading && resumes.length > 0 && (
    <div className="card-premium !p-0 overflow-hidden relative">
     <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-lime-400/20 to-transparent"></div>
     <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
       <thead>
         <tr className="bg-white/[0.02] text-white/30 uppercase text-[8px] font-bold tracking-[0.2em] ">
          <th className="px-6 py-4">Subject Identity</th>
          <th className="px-6 py-4">Neural Protocol</th>
          <th className="px-6 py-4">Target Node</th>
          <th className="px-6 py-4">Neural Patterns</th>
          <th className="px-6 py-4">Epoch (Date)</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 text-right">Synchronization</th>
         </tr>
       </thead>
       <tbody className="divide-y divide-white/5">
        {resumes.map((resume) => (
         <tr key={resume._id} className="bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 group">
          <td className="px-6 py-5">
           <div className="flex flex-col">
            <span className="text-white font-bold tracking-tight text-xs group-hover:text-[#c4eec6] transition-colors">{resume.name}</span>
            <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">{resume.phone}</span>
           </div>
          </td>
          <td className="px-6 py-5">
           <span className="text-[11px] font-medium text-[var(--color-text-muted)] opacity-70 group-hover:opacity-100 transition-opacity">{resume.email}</span>
          </td>
          <td className="px-6 py-5">
           <span className="text-[11px] font-bold text-white tracking-tight">{resume.position}</span>
          </td>
          <td className="px-6 py-5">
           <div className="flex flex-wrap gap-1.5 max-w-xs">
            {resume.skills && resume.skills.length > 0 ? (
             <>
              {resume.skills.slice(0, 3).map((skill, i) => (
               <span key={i}
                className="px-2 py-0.5 bg-lime-400/5 border border-lime-400/10 text-[#c4eec6] text-[8px] font-bold uppercase tracking-widest rounded-md">
                {skill}
               </span>
              ))}
              {resume.skills.length > 3 && (
               <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/30 text-[8px] font-bold uppercase tracking-widest rounded-md">
                +{resume.skills.length - 3}
               </span>
              )}
             </>
            ) : (
             <span className="text-white/10 text-[9px] font-bold uppercase tracking-widest ">No Patterns detected</span>
            )}
           </div>
          </td>
          <td className="px-6 py-5">
           <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest ">
            {new Date(resume.uploadedAt).toLocaleDateString('en-US', {
             day: '2-digit', month: 'short', year: 'numeric',
            })}
           </span>
          </td>
          <td className="px-6 py-5">{statusBadge(resume.status)}</td>
          <td className="px-6 py-5">
           <div className="flex items-center justify-end gap-2">
            <a href={`${API_URL}${resume.filePath}`} target="_blank" rel="noopener noreferrer"
             className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/30 text-[8px] font-bold uppercase tracking-widest transition-all">
             Review
            </a>
            <button onClick={() => setSelectedResume(resume)} disabled={resume.status !== 'pending'}
             className="px-4 py-2 rounded-lg bg-lime-400/10 border border-lime-400/20 text-[#c4eec6]/60 hover:text-[#c4eec6] hover:bg-lime-400/20 text-[8px] font-bold uppercase tracking-widest transition-all disabled:opacity-20 disabled:cursor-not-allowed">
             Accept
            </button>
            <button onClick={() => updateStatus(resume._id, 'rejected')} disabled={resume.status !== 'pending'}
             className="px-4 py-2 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400/60 hover:text-red-400 hover:bg-red-400/20 text-[8px] font-bold uppercase tracking-widest transition-all disabled:opacity-20 disabled:cursor-not-allowed">
             Reject
            </button>
           </div>
          </td>
         </tr>
        ))}
       </tbody>
      </table>
     </div>
    </div>
   )}
  </div>
 );
}

// ─── Admin Overview Section ───────────────────────────────────────────────────
function AdminOverview() {
 return (
  <div className="space-y-6 animate-fade-in">
   {/* Platform Metrics */}
   <div className="grid grid-cols-12 gap-5">
    {[
     { label: "Total Hires", value: "1,284", trend: "+14.2%", color: "text-[#c4eec6]", chart: "M0 25 L10 20 L20 28 L30 15 L40 22 L50 10 L60 18 L70 5 L80 12 L90 2 L100 8" },
     { label: "Active Jobs", value: "32", trend: "-2.1%", color: "text-purple-400", chart: "M0 20 L10 25 L20 15 L30 22 L40 10 L50 18 L60 5 L70 12 L80 8 L90 15 L100 5" },
     { label: "Total Users", value: "420", trend: "+5", color: "text-blue-400", chart: "M0 28 L10 22 L20 25 L30 18 L40 20 L50 12 L60 15 L70 8 L80 10 L90 5 L100 2" },
    ].map((m, i) => (
     <div key={i} className="col-span-12 md:col-span-4 card-premium !p-4 group relative overflow-hidden flex flex-col justify-between h-28 hover:border-white/20 transition-all duration-700">
       <div className="flex justify-between items-start relative z-10">
        <div className="space-y-0.5">
          <p className="text-[7px] font-bold text-white/40 uppercase tracking-widest font-sf-text">{m.label}</p>
          <h3 className={`text-lg font-sf-display font-bold tracking-tight ${m.color}`}>{m.value}</h3>
        </div>
        <div className={`px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[6px] font-bold ${m.color} uppercase tracking-widest font-sf-text`}>
         {m.trend}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-20 opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none">
       <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
        <path d={`${m.chart} L100 30 L0 30 Z`} fill="currentColor" className={`${m.color} opacity-10`} />
        <path d={m.chart} fill="none" stroke="currentColor" strokeWidth="1" className={m.color} />
       </svg>
      </div>
     </div>
    ))}

    {/* SYSTEM HUB */}
    <div className="col-span-12 xl:col-span-8 card-premium !p-0 overflow-hidden group relative h-[14rem]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#c4eec6]/10 via-[#09090b] to-[#c4eec6]/5 opacity-50 group-hover:opacity-80 transition-opacity duration-1000"></div>
      <div className="absolute inset-0 flex flex-col justify-between p-6 relative z-10">
       <div className="space-y-4">
         <div className="w-12 h-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center shadow-2xl backdrop-blur-3xl group-hover:scale-105 transition-all duration-700">
          <TrendingUp className="w-6 h-6 text-[#c4eec6]" />
         </div>
         <div className="space-y-1">
          <h2 className="text-xl font-sf-display font-bold text-white tracking-tight leading-none">Platform Management</h2>
          <p className="text-[10px] text-white/60 font-medium max-w-xl font-sf-text">Overseeing recruitment infrastructure and system processes.</p>
       </div>
       </div>
       
       <div className="flex flex-wrap gap-4 items-end justify-between">
         <div className="flex gap-6">
           <div className="space-y-1">
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest font-sf-text">Active Processes</p>
            <p className="text-base font-bold text-white font-sf-display">142</p>
           </div>
           <div className="space-y-1">
            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest font-sf-text">Uptime</p>
            <p className="text-base font-bold text-[#c4eec6] font-sf-display">99.99%</p>
           </div>
         </div>
         <button className="btn-primary !py-3 !px-8 text-[9px] font-bold uppercase tracking-wider shadow-xl font-sf-text">
          Refresh Stats <TrendingUp className="ml-1.5 w-3 h-3" />
         </button>
       </div>
      </div>
      
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full opacity-20 group-hover:scale-125 transition-transform duration-1000"></div>
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-1000"></div>
    </div>

    {/* SYSTEM HEALTH */}
    <div className="col-span-12 xl:col-span-4 card-premium !p-4 space-y-4 relative overflow-hidden group h-[14rem]">
      <div className="space-y-1">
       <h3 className="text-sm font-sf-display font-bold text-white tracking-tight uppercase">System Health</h3>
       <p className="text-[9px] text-white/40 font-medium font-sf-text">Platform operational status.</p>
      </div>
      
      <div className="space-y-4">
       {[
        { label: "Data Integrity", val: "100%", color: "bg-lime-400" },
        { label: "Sync Latency", val: "0.4ms", color: "bg-purple-400" },
        { label: "Node Coverage", val: "Global", color: "bg-blue-400" },
       ].map((s, i) => (
        <div key={i} className="space-y-1 group/item">
          <div className="flex justify-between items-end">
           <p className="text-[7px] font-bold text-white uppercase tracking-widest group-hover/item:text-[#c4eec6] transition-colors font-sf-text">{s.label}</p>
           <span className="text-[7px] font-bold text-white/40 uppercase tracking-tighter font-sf-text">{s.val}</span>
          </div>
          <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
           <div className={`h-full ${s.color} w-4/5 transition-all duration-1000`}></div>
          </div>
        </div>
       ))}
      </div>
      <div className="pt-2">
       <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 group-hover:bg-white/10 transition-all">
         <div className="w-8 h-8 rounded-lg bg-lime-400/20 flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#c4eec6]" />
         </div>
         <div>
          <p className="text-[8px] font-bold text-white uppercase tracking-widest font-sf-text">System Stable</p>
          <p className="text-[7px] font-medium text-white/40 font-sf-text">Global processes performing at peak.</p>
         </div>
       </div>
      </div>
    </div>
   </div>
  </div>
 );
}

// ─── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
 const [activeTab, setActiveTab] = useState('Overview');

 const handlePostJobClick = () => {
  setActiveTab('Jobs');
 };

 return (
  <Sidenavbar 
   userRole="admin" 
   activeView={activeTab}
   setActiveView={setActiveTab}
   onPostJob={handlePostJobClick}
  >
   <div className="animate-fade-in pb-10">
    {/* Header */}
    <div className="mb-6">
     <div className="flex items-center gap-2 mb-1">
      <div className="w-0.5 h-5 bg-[#c4eec6] rounded-full"></div>
      <h1 className="text-lg font-sf-display font-bold text-white tracking-tight uppercase leading-none">System Control</h1>
     </div>
     <p className="text-[9px] font-medium text-[var(--color-text-muted)] opacity-60 ml-3 font-sf-text">Managing recruitment infrastructure and system processes.</p>
    </div>

    {/* Tab Content */}
    {activeTab === 'Overview' && <AdminOverview />}
    {activeTab === 'Resumes' && <ResumesSection />}
    {activeTab === 'Jobs' && <PostJobSection userRole="admin" />}
   </div>
  </Sidenavbar>
 );
}
