import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = await getToken();
        const res = await fetch('http://localhost:5957/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.isAdmin) {
            navigate('/admin');
          }
        }
      } catch (err) {
        console.error('Error checking user role:', err);
      }
    };
    checkRole();
  }, [getToken, navigate]);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] pt-20">
      {/* SIDE NAV */}
      <aside className="w-64 border-r border-[var(--color-border)] hidden lg:flex flex-col bg-black/40 backdrop-blur-xl">
        <div className="p-6 space-y-8 flex-grow">
          <div className="space-y-2">
            {[
              { icon: LayoutDashboard, label: "Dashboard", active: true },
              { icon: Briefcase, label: "Job Matches", active: false },
              { icon: Calendar, label: "Preparation", active: false },
              { icon: CheckCircle2, label: "Applications", active: false },
            ].map((item, i) => (
              <button 
                key={i} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                  ${item.active 
                    ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-l-2 border-[var(--color-accent)]' 
                    : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 space-y-2">
            <p className="px-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Account</p>
            {[
              { icon: User, label: "Profile" },
              { icon: Settings, label: "Settings" },
            ].map((item, i) => (
              <button 
                key={i} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-white/5 hover:text-white transition-all duration-200"
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-white/5 group hover:border-[var(--color-accent)]/30 transition-all cursor-pointer">
            <p className="text-xs font-bold text-white mb-1">Elite Plan</p>
            <p className="text-[10px] text-gray-400 mb-3">Unlimited AI Coaching sessions unlocked.</p>
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] text-white font-bold tracking-widest uppercase transition-colors">Upgrade Plan</button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-8 max-w-7xl mx-auto space-y-10">
        {/* PAGE HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold text-white">Welcome back, {user?.firstName || 'Hero'}</h1>
            <p className="text-sm text-[var(--color-text-muted)] italic">Your AI recommendations are ready for today.</p>
          </div>
          <div className="flex gap-4">
            <button className="btn-secondary py-2 flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button className="btn-primary py-2 flex items-center gap-2 text-sm pr-6">
              <Plus className="w-4 h-4" /> Upload New Resume
            </button>
          </div>
        </header>

        {/* METRIC STRIP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Top Matches", value: "12", trend: "+3 this week", color: "text-[var(--color-accent)]" },
            { label: "Applications", value: "45", trend: "+8.2%", color: "text-blue-400" },
            { label: "Interview Prep", value: "85%", trend: "Strong Progress", color: "text-purple-400" },
            { label: "Job Offers", value: "3", trend: "Active Discussions", color: "text-green-400" },
          ].map((m, i) => (
            <div key={i} className="card-premium space-y-3 group glass">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{m.label}</p>
              <div className="flex items-baseline justify-between">
                <span className={`text-4xl font-display font-bold ${m.color}`}>{m.value}</span>
                <TrendingUp className={`w-4 h-4 ${m.color} opacity-30`} />
              </div>
              <p className="text-[10px] text-gray-400 italic">{m.trend}</p>
            </div>
          ))}
        </div>

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* PRIMARY: JOB MATCHES */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold font-display text-white">Curated AI Matches</h2>
              <button className="text-[var(--color-accent)] text-xs font-bold hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {[
                { title: "Senior AI Engineer", company: "Anthropic", salary: "$180k - $240k", match: "98%", tags: ["Remote", "Full-time"] },
                { title: "Product Designer", company: "Linear", salary: "$150k - $210k", match: "94%", tags: ["San Francisco", "Hybrid"] },
                { title: "Backend Systems Tech Lead", company: "Vercel", salary: "$190k - $260k", match: "91%", tags: ["Remote", "Contract"] },
              ].map((job, i) => (
                <div key={i} className="card-premium flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center shrink-0 group-hover:border-[var(--color-accent)]/20 transition-colors uppercase font-bold text-gray-500 italic">
                      {job.company[0]}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-white font-bold group-hover:text-[var(--color-accent)] transition-colors">{job.title}</h3>
                        <span className="px-2 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[10px] font-bold border border-[var(--color-accent)]/20">{job.match} Match</span>
                      </div>
                      <p className="text-xs text-gray-400">{job.company} &bull; {job.salary}</p>
                      <div className="flex gap-2 pt-2">
                         {job.tags.map((t, j) => (
                           <span key={j} className="text-[9px] px-2 py-0.5 bg-white/5 rounded border border-white/5 text-gray-500">{t}</span>
                         ))}
                      </div>
                    </div>
                  </div>
                  <button className="btn-primary py-2 px-6 text-xs w-full md:w-auto">Quick Apply</button>
                </div>
              ))}
            </div>
          </div>

          {/* SECONDARY: UPCOMING & RECENT */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-white px-2">Upcoming Sessions</h2>
              <div className="card-premium space-y-4 bg-gradient-to-br from-[#1A1A1A] to-[#252525]">
                {[
                  { title: "System Design Prep", time: "Today, 4:00 PM", type: "AI Coaching" },
                  { title: "Anthropic Technical", time: "Tomorrow, 10:00 AM", type: "Virtual Interview" },
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between group hover:border-[var(--color-accent)]/20 cursor-pointer transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-[var(--color-accent)]" />
                        <span className="text-[10px] text-gray-400 font-medium">{s.time}</span>
                      </div>
                      <p className="text-xs font-bold text-white uppercase tracking-tight">{s.title}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[var(--color-accent)]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-white px-2">Recent Activity</h2>
              <div className="space-y-4 px-2">
                {[
                  { text: "Application viewed by Stripe", time: "2h ago", status: "viewed" },
                  { text: "AI Resume optimization complete", time: "5h ago", status: "done" },
                  { text: "Interview invitation from Meta", time: "Yesterday", status: "urgent" },
                ].map((a, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i !== 2 && <div className="absolute left-[7px] top-4 bottom-[-20px] w-[2px] bg-white/5"></div>}
                    <div className={`w-4 h-4 rounded-full border-4 border-[var(--color-bg)] bg-[var(--color-surface)] shadow-sm shrink-0 z-10
                      ${a.status === 'urgent' ? 'bg-orange-500' : 'bg-[var(--color-accent)]'}`}></div>
                    <div className="space-y-1">
                      <p className="text-[11px] text-gray-300 leading-tight">{a.text}</p>
                      <p className="text-[10px] text-gray-500 italic">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}