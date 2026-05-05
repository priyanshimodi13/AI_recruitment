import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5957';
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const EXP_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager'];

const emptyJob = {
  title: '', company: '', companyWebsite: '', location: '', type: 'Full-time',
  experienceLevel: 'Entry Level', description: '', requirements: '', salaryRange: '',
};

export default function PostJobSection({ userRole = 'employer' }) {
  const { getToken } = useAuth();
  const [form, setForm] = useState(emptyJob);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [jobSuccess, setJobSuccess] = useState('');
  const [jobError, setJobError] = useState('');
  const [editingJobId, setEditingJobId] = useState(null);

  useEffect(() => { fetchJobs(); }, [userRole]);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const token = await getToken();
      const endpoint = userRole === 'admin' ? '/api/jobs' : '/api/jobs/employer';
      const { data } = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setJobSuccess('');
    setJobError('');
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        requirements: typeof form.requirements === 'string'
          ? form.requirements.split('\n').map((r) => r.trim()).filter(Boolean)
          : form.requirements,
      };

      const freshToken = await getToken();
      
      if (editingJobId) {
        await axios.put(`${API_URL}/api/jobs/${editingJobId}`, payload, {
          headers: { Authorization: `Bearer ${freshToken}` },
        });
        setJobSuccess('✅ Job updated successfully!');
      } else {
        await axios.post(`${API_URL}/api/jobs`, payload, {
          headers: { Authorization: `Bearer ${freshToken}` },
        });
        setJobSuccess('✅ Job posted successfully!');
      }
      
      setForm(emptyJob);
      setEditingJobId(null);
      fetchJobs();
    } catch (err) {
      setJobError(err.response?.data?.error || err.response?.data?.message || 'Failed to process job.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (job) => {
    setEditingJobId(job._id);
    setForm({
      title: job.title,
      company: job.company,
      companyWebsite: job.companyWebsite || '',
      location: job.location,
      type: job.type,
      experienceLevel: job.experienceLevel,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      salaryRange: job.salaryRange || '',
    });
    setJobSuccess('');
    setJobError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingJobId(null);
    setForm(emptyJob);
    setJobSuccess('');
    setJobError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      const freshToken = await getToken();
      await axios.delete(`${API_URL}/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${freshToken}` },
      });
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch {
      alert('Failed to delete job.');
    }
  };

  return (
    <div className="space-y-16 animate-fade-in">
      {/* ── Add/Edit Job Form ── */}
      <div className="card-premium !p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-display font-bold text-white tracking-tighter uppercase">{editingJobId ? 'Recalibrate Listing' : 'Deploy New Role'}</h2>
          <p className="text-xs font-medium text-[var(--color-text-muted)] opacity-60">Synchronizing market opportunities with the platform's neural feed.</p>
        </div>

        {jobSuccess && (
          <div className="mb-8 p-4 rounded-2xl bg-lime-400/10 border border-lime-400/20 text-[#c4eec6] text-[11px] font-bold uppercase tracking-widest ">{jobSuccess}</div>
        )}
        {jobError && (
          <div className="mb-8 p-4 rounded-2xl bg-red-400/10 border border-red-400/20 text-red-400 text-[11px] font-bold uppercase tracking-widest ">{jobError}</div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-2">Job Designation</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required
              placeholder="e.g. Principal Architect"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 text-sm font-semibold focus:border-lime-400/40 focus:outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-2">Operating Company</label>
            <input type="text" name="company" value={form.company} onChange={handleChange} required
              placeholder="e.g. Neural Dynamics"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 text-sm font-semibold focus:border-lime-400/40 focus:outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-2">Company Node (Website)</label>
            <input type="url" name="companyWebsite" value={form.companyWebsite} onChange={handleChange}
              placeholder="https://nexus.ai"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 text-sm font-semibold focus:border-lime-400/40 focus:outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-2">Deployment Node (Location)</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} required
              placeholder="e.g. Global / Remote"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 text-sm font-semibold focus:border-lime-400/40 focus:outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-2">Compensation Matrix</label>
            <input type="text" name="salaryRange" value={form.salaryRange} onChange={handleChange}
              placeholder="e.g. $180K – $250K / YR"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 text-sm font-semibold focus:border-lime-400/40 focus:outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-2">Engagement Protocol (Type)</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-semibold focus:border-lime-400/40 focus:outline-none transition-all premium-select">
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-2">Operational Briefing (Description)</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={6}
              placeholder="Define the scope of influence and technical trajectory..."
              className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-8 py-6 text-white placeholder-white/20 text-sm font-semibold focus:border-lime-400/40 focus:outline-none transition-all resize-none" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-2">Required Neural Patterns (One per line)</label>
            <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={4}
              placeholder="React&#10;Node.js&#10;AWS..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 text-sm font-semibold focus:border-lime-400/40 focus:outline-none transition-all resize-none" />
          </div>
          <div className="md:col-span-2 flex gap-6 pt-6">
            <button type="submit" disabled={submitting}
              className="flex-1 btn-primary py-5 text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl">
              {submitting ? 'Transmitting...' : (editingJobId ? 'Recalibrate Node' : 'Deploy Deployment')}
            </button>
            {editingJobId && (
              <button type="button" onClick={handleCancelEdit} disabled={submitting}
                className="flex-1 py-5 rounded-2xl border border-white/10 text-white/40 hover:bg-white/5 hover:text-white text-[10px] font-bold uppercase tracking-[0.3em] transition-all">
                Abort
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Active Jobs List ── */}
      <div className="space-y-8">
        <div className="flex items-center gap-6 px-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-[0.4em] shrink-0">
            Active Deployments ({jobs.length})
          </h3>
          <div className="h-px flex-grow bg-white/10"></div>
        </div>

        {loadingJobs && (
          <div className="text-center py-20 text-white/20 font-bold uppercase tracking-widest text-xs animate-pulse">Scanning Grid...</div>
        )}
        {!loadingJobs && jobs.length === 0 && (
          <div className="text-center py-20 card-premium border-dashed border-white/5 bg-transparent text-white/30 font-bold uppercase tracking-widest text-xs ">No active deployments detected.</div>
        )}
        {!loadingJobs && jobs.length > 0 && (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job._id}
                className="card-premium !p-8 flex items-center justify-between gap-10 group hover:border-lime-400/30 transition-all duration-700">
                <div className="flex-1 min-w-0 flex items-center gap-10">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                    <span className="text-2xl font-bold text-[#c4eec6] opacity-30">{job.company?.[0] || 'D'}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-white tracking-tighter group-hover:text-[#c4eec6] transition-colors">{job.title}</p>
                    <p className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest mt-1 opacity-70 ">
                      {job.company} &bull; {job.location}
                    </p>
                    <div className="flex flex-wrap gap-4 mt-6">
                      <span className="px-3 py-1 rounded-lg bg-lime-400/5 border border-lime-400/10 text-[#c4eec6] text-[9px] font-bold uppercase tracking-widest">{job.type}</span>
                      <span className="px-3 py-1 rounded-lg bg-purple-400/5 border border-purple-400/10 text-purple-400 text-[9px] font-bold uppercase tracking-widest">{job.experienceLevel}</span>
                      {job.salaryRange && (
                        <span className="px-3 py-1 rounded-lg bg-blue-400/5 border border-blue-400/10 text-blue-400 text-[9px] font-bold uppercase tracking-widest">{job.salaryRange}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-4">
                  <button onClick={() => handleEditClick(job)}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-[#c4eec6] hover:border-lime-400/30 text-[9px] font-bold uppercase tracking-widest transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(job._id)}
                    className="px-6 py-3 rounded-xl bg-red-400/5 border border-red-400/10 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 text-[9px] font-bold uppercase tracking-widest transition-all">
                    Purge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
