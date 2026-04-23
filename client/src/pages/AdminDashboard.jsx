import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5957';

// ─── Status Badge ──────────────────────────────────────────────────────────────
const statusBadge = (status) => {
  const styles = {
    pending: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    accepted: 'bg-green-500/15 text-green-400 border border-green-500/30',
    rejected: 'bg-red-500/15 text-red-400 border border-red-500/30',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[status]}`}>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl p-7">
        <h2 className="text-lg font-bold text-white mb-1">Schedule Interview</h2>
        <p className="text-xs text-gray-400 mb-5">
          For <span className="text-blue-400 font-medium">{resume.name}</span> — {resume.position}
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Interview Date</label>
            <input type="date" name="interviewDate" value={form.interviewDate}
              onChange={handleChange} min={new Date().toISOString().split('T')[0]}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Interview Time</label>
            <input type="time" name="interviewTime" value={form.interviewTime}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Interview Mode</label>
            <select name="interviewMode" value={form.interviewMode} onChange={handleChange}
              className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="Online">Online</option>
              <option value="In-Person">In-Person</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Meeting Link <span className="text-gray-600">(optional)</span>
            </label>
            <input type="url" name="meetingLink" value={form.meetingLink} onChange={handleChange}
              placeholder="https://meet.google.com/..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 text-sm font-medium transition-colors">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors">
            {loading ? 'Sending...' : 'Confirm & Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Job Form ──────────────────────────────────────────────────────────────
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
const EXP_LEVELS = ['Entry Level', 'Mid Level', 'Senior', 'Lead', 'Manager'];

const emptyJob = {
  title: '', company: '', companyWebsite: '', location: '', type: 'Full-time',
  experienceLevel: 'Entry Level', description: '', requirements: '', salaryRange: '',
};

function AddJobSection() {
  const { getToken } = useAuth();
  const [form, setForm] = useState(emptyJob);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [jobSuccess, setJobSuccess] = useState('');
  const [jobError, setJobError] = useState('');
  const [editingJobId, setEditingJobId] = useState(null);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const { data } = await axios.get(`${API_URL}/api/jobs`);
      setJobs(data);
    } catch {
      // fail silently — jobs list is supplementary
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
          ? form.requirements.split(',').map((r) => r.trim()).filter(Boolean)
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
      requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : '',
      salaryRange: job.salaryRange || '',
    });
    setJobSuccess('');
    setJobError('');
    // Scroll to form
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
    <div className="space-y-8">
      {/* ── Add/Edit Job Form ── */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-1">{editingJobId ? 'Edit Job Listing' : 'Post a New Job'}</h2>
        <p className="text-xs text-gray-500 mb-5">Fill in the details to {editingJobId ? 'update the' : 'publish a new'} job listing.</p>

        {jobSuccess && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">{jobSuccess}</div>
        )}
        {jobError && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{jobError}</div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Job Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required
              placeholder="e.g. Frontend Developer"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {/* Company */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Company *</label>
            <input type="text" name="company" value={form.company} onChange={handleChange} required
              placeholder="e.g. TechCorp Inc."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {/* About Company / Website */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">About Company (Website Link)</label>
            <input type="url" name="companyWebsite" value={form.companyWebsite} onChange={handleChange}
              placeholder="https://company.com"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Location *</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} required
              placeholder="e.g. Remote / Bangalore"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {/* Salary Range */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Salary Range</label>
            <input type="text" name="salaryRange" value={form.salaryRange} onChange={handleChange}
              placeholder="e.g. ₹8L – ₹15L / year"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {/* Job Type */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Job Type *</label>
            <select name="type" value={form.type} onChange={handleChange}
              className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          {/* Experience Level */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Experience Level *</label>
            <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange}
              className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {EXP_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          {/* Description — full width */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-400 mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
              placeholder="Describe the role, responsibilities, and what success looks like..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          {/* Requirements — full width */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Requirements <span className="text-gray-600">(comma-separated)</span>
            </label>
            <input type="text" name="requirements" value={form.requirements} onChange={handleChange}
              placeholder="e.g. React, Node.js, MongoDB, REST APIs"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {/* Submit */}
          <div className="md:col-span-2 flex gap-3 mt-2">
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
              {submitting ? (editingJobId ? 'Updating...' : 'Posting...') : (editingJobId ? 'Update Job' : 'Post Job')}
            </button>
            {editingJobId && (
              <button type="button" onClick={handleCancelEdit} disabled={submitting}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 text-sm font-medium transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Active Jobs List ── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Active Job Listings ({jobs.length})
        </h3>
        {loadingJobs && (
          <div className="text-center py-10 text-gray-500 text-sm">Loading jobs...</div>
        )}
        {!loadingJobs && jobs.length === 0 && (
          <div className="text-center py-10 text-gray-600 text-sm">No job listings yet.</div>
        )}
        {!loadingJobs && jobs.length > 0 && (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job._id}
                className="flex items-start justify-between gap-4 bg-white/[0.025] border border-white/10 rounded-xl px-5 py-4 hover:bg-white/5 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{job.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {job.company} · {job.location}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">{job.type}</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs">{job.experienceLevel}</span>
                    {job.salaryRange && (
                      <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs">{job.salaryRange}</span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button onClick={() => handleEditClick(job)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/15 border border-blue-500/20 text-blue-400 hover:bg-blue-600/30 text-xs font-medium transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(job._id)}
                    className="px-3 py-1.5 rounded-lg bg-red-600/15 border border-red-500/20 text-red-400 hover:bg-red-600/30 text-xs font-medium transition-colors">
                    Delete
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
    <div>
      {selectedResume && (
        <InterviewModal
          resume={selectedResume}
          onClose={() => setSelectedResume(null)}
          onConfirm={handleAcceptConfirm}
        />
      )}

      {loading && <div className="text-center py-20 text-gray-400">Loading resumes...</div>}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}
      {!loading && !error && resumes.length === 0 && (
        <div className="text-center py-20 text-gray-500 text-sm">No resumes submitted yet.</div>
      )}
      {!loading && resumes.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 uppercase text-xs tracking-wider">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Position</th>
                <th className="px-5 py-3">Skills</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {resumes.map((resume) => (
                <tr key={resume._id} className="bg-white/[0.02] hover:bg-white/5 transition-colors align-top">
                  <td className="px-5 py-4 text-white font-medium">{resume.name}</td>
                  <td className="px-5 py-4 text-gray-300">{resume.email}</td>
                  <td className="px-5 py-4 text-gray-300">{resume.phone}</td>
                  <td className="px-5 py-4 text-gray-300">{resume.position}</td>
                  <td className="px-5 py-4 max-w-xs">
                    {resume.skills && resume.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {resume.skills.slice(0, 6).map((skill, i) => (
                          <span key={i}
                            className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] rounded-full whitespace-nowrap">
                            {skill}
                          </span>
                        ))}
                        {resume.skills.length > 6 && (
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-[11px] rounded-full"
                            title={resume.skills.slice(6).join(', ')}>
                            +{resume.skills.length - 6} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-600 text-xs italic">No skills detected</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-400">
                    {new Date(resume.uploadedAt).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4">{statusBadge(resume.status)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <a href={`${API_URL}${resume.filePath}`} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600/30 text-xs font-medium transition-colors">
                        View Resume
                      </a>
                      <button onClick={() => setSelectedResume(resume)} disabled={resume.status !== 'pending'}
                        className="px-3 py-1.5 rounded-lg bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        Accept
                      </button>
                      <button onClick={() => updateStatus(resume._id, 'rejected')} disabled={resume.status !== 'pending'}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('resumes');

  const tabs = [
    { id: 'resumes', label: '📄 Resume Applications' },
    { id: 'jobs', label: '💼 Manage Jobs' },
  ];

  return (
    <div className="min-h-screen px-4 py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Manage applications and job listings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-white/10 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'resumes' && <ResumesSection />}
      {activeTab === 'jobs' && <AddJobSection />}
    </div>
  );
}
