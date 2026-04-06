import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Briefcase, FileText, Plus, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applications'
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [newJob, setNewJob] = useState({
    title: '', company: '', location: '', type: 'Full-time', experienceLevel: 'Mid Level', description: '', requirements: '', salaryRange: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5957/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setJobs(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5957/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setApplications(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5957/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newJob,
          requirements: newJob.requirements.split(',').map(r => r.trim())
        })
      });
      if (res.ok) {
        alert('Job created successfully!');
        setNewJob({ title: '', company: '', location: '', type: 'Full-time', experienceLevel: 'Mid Level', description: '', requirements: '', salaryRange: '' });
        fetchJobs();
      } else {
        alert('Failed to create job');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating job');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading admin dashboard...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-[var(--color-heading)]">Admin Dashboard</h1>
            <p className="text-[var(--color-text-muted)]">Manage job postings and candidate resumes.</p>
          </div>
          <div className="flex gap-4">
             <button 
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors border ${activeTab === 'jobs' ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-heading)]'}`}>
                Jobs
             </button>
             <button 
                onClick={() => setActiveTab('applications')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors border ${activeTab === 'applications' ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)]' : 'bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-heading)]'}`}>
                Applications
             </button>
          </div>
        </header>

        {activeTab === 'jobs' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="card-premium glass">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-[var(--color-accent)]" /> Add New Job</h2>
                <form onSubmit={handleCreateJob} className="space-y-4">
                  <input required placeholder="Job Title" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
                  <input required placeholder="Company" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} />
                  <input required placeholder="Location" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
                  <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2 text-white text-sm" value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})}>
                    <option>Full-time</option><option>Part-time</option><option>Contract</option>
                  </select>
                  <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2 text-white text-sm" value={newJob.experienceLevel} onChange={e => setNewJob({...newJob, experienceLevel: e.target.value})}>
                    <option>Entry Level</option><option>Mid Level</option><option>Senior</option>
                  </select>
                  <input placeholder="Salary Range (e.g. $100k-$150k)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" value={newJob.salaryRange} onChange={e => setNewJob({...newJob, salaryRange: e.target.value})} />
                  <textarea required placeholder="Job Description" rows="3" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})}></textarea>
                  <input placeholder="Requirements (comma separated)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" value={newJob.requirements} onChange={e => setNewJob({...newJob, requirements: e.target.value})} />
                  <button type="submit" className="w-full btn-primary py-2 mt-2">Create Job</button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
               <h2 className="text-xl font-bold text-white mb-4">Active Jobs</h2>
               {jobs.length === 0 ? <p className="text-gray-500">No jobs posted yet.</p> : jobs.map((job) => (
                 <div key={job._id} className="card-premium glass flex justify-between items-start group">
                   <div>
                     <h3 className="text-white font-bold text-lg leading-tight group-hover:text-[var(--color-accent)] transition-colors">{job.title}</h3>
                     <p className="text-xs text-[var(--color-accent)] mb-2 font-bold">{job.company}</p>
                     <div className="flex gap-2 flex-wrap text-xs text-gray-400">
                       <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{job.location}</span>
                       <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{job.type}</span>
                       <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">{job.experienceLevel}</span>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-4">
             <h2 className="text-xl font-bold text-white mb-4">Candidate Applications</h2>
             {applications.length === 0 ? <p className="text-gray-500">No applications received yet.</p> : applications.map((app) => (
                <div key={app._id} className="card-premium glass flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h3 className="text-white font-bold">{app.userId?.firstName} {app.userId?.lastName} ({app.userId?.email})</h3>
                    <p className="text-sm text-gray-400 mt-1">Applied for: <span className="text-[var(--color-accent)] font-bold">{app.jobId?.title}</span> at {app.jobId?.company}</p>
                    <p className="text-xs text-gray-500 mt-2">Status: <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded border border-yellow-500/20">{app.status}</span></p>
                  </div>
                  <div>
                    <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn-secondary py-2 px-4 flex items-center gap-2">
                       <FileText className="w-4 h-4" /> View Resume
                    </a>
                  </div>
                </div>
             ))}
          </div>
        )}

      </div>
    </div>
  );
}
