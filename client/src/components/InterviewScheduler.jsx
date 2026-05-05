/**
 * InterviewScheduler.jsx
 * Allows a selected candidate to pick an interview slot.
 * Props:
 *  - submissionId: string  (Application _id)
 *  - jobId:        string
 *  - jobTitle:     string
 *  - companyName:  string
 *  - onSuccess:    (interviewData) => void
 *  - onClose:      () => void
 */

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Video, Phone, Building2, CheckCircle2, X, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5957';

const INTERVIEW_MODES = [
  { value: 'Video',    label: 'Video Call',  icon: Video,     desc: 'Google Meet link sent automatically' },
  { value: 'Phone',    label: 'Phone Call',  icon: Phone,     desc: 'We will call you at your registered number' },
  { value: 'InPerson', label: 'In Person',   icon: Building2, desc: 'Visit our office at the scheduled time' },
];

export default function InterviewScheduler({ submissionId, jobId, jobTitle, companyName, onSuccess, onClose }) {
  const { getToken } = useAuth();

  const [slots,       setSlots]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedMode, setSelectedMode] = useState('Video');
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState('');
  const [confirmed,   setConfirmed]   = useState(null); // holds confirmation data
  const [groupedSlots, setGroupedSlots] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [visible, setVisible] = useState(false);

  // ─── Fetch slots on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!jobId) return;
    (async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(`${API_URL}/api/interviews/slots/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load slots');
        const data = await res.json();

        // Group slots by displayDate for the date picker UI
        const grouped = {};
        for (const slot of data.availableSlots) {
          if (!grouped[slot.displayDate]) grouped[slot.displayDate] = [];
          grouped[slot.displayDate].push(slot);
        }
        setGroupedSlots(grouped);
        setSlots(data.availableSlots);

        // Auto-select first day
        const firstDay = Object.keys(grouped)[0];
        if (firstDay) setSelectedDay(firstDay);
      } catch (err) {
        setError(err.message || 'Failed to load available slots.');
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId, getToken]);

  // ─── Submit scheduling ────────────────────────────────────────────────────
  const handleSchedule = async () => {
    if (!selectedSlot) return setError('Please select a time slot.');
    setSubmitting(true);
    setError('');
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/interviews/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          submissionId,
          slotId:        selectedSlot.slotId,
          interviewMode: selectedMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule interview.');
      setConfirmed(data);
      onSuccess?.(data);
    } catch (err) {
      setError(err.message || 'Failed to schedule. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Confirmation view ────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <ModalWrapper visible={visible} onClose={onClose}>
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="w-24 h-24 bg-lime-400/20 border border-lime-400/30 rounded-[2rem] flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-lime-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold text-white tracking-tighter">Interview Confirmed!</h2>
            <p className="text-sm text-white/50">Check your email for a detailed confirmation.</p>
          </div>
          <div className="w-full p-6 bg-white/5 border border-white/5 rounded-[2rem] space-y-4 text-left">
            <InfoRow icon={Calendar} label="Date & Time" value={new Date(confirmed.scheduledDateTime).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} />
            <InfoRow icon={selectedMode === 'Video' ? Video : selectedMode === 'Phone' ? Phone : Building2} label="Mode" value={selectedMode} />
            {confirmed.interviewLink && (
              <InfoRow icon={Video} label="Meeting Link" value={confirmed.interviewLink} link={confirmed.interviewLink} />
            )}
          </div>
          <button onClick={onClose} className="w-full py-5 rounded-[1.5rem] bg-lime-400 text-black text-[10px] font-black uppercase tracking-widest hover:bg-lime-300 transition-all shadow-2xl shadow-lime-400/20">
            Done
          </button>
        </div>
      </ModalWrapper>
    );
  }

  // ─── Main scheduler view ──────────────────────────────────────────────────
  return (
    <ModalWrapper visible={visible} onClose={onClose}>
      {/* Header */}
      <div className="space-y-2 mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-[9px] font-bold text-lime-400 uppercase tracking-widest">
          Round 1 Interview
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tighter">Schedule Interview</h2>
        <p className="text-sm text-white/40 font-medium">
          {jobTitle} {companyName ? `· ${companyName}` : ''}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-bold uppercase tracking-widest">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Loading available slots...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Step 1: Pick a Day */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Step 1 — Select a Day</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {Object.keys(groupedSlots).map((day) => (
                <button
                  key={day}
                  onClick={() => { setSelectedDay(day); setSelectedSlot(null); }}
                  className={`p-3 rounded-[1.25rem] border text-center transition-all ${
                    selectedDay === day
                      ? 'bg-lime-400 border-lime-400 text-black'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-lime-400/40 hover:text-white'
                  }`}
                >
                  <p className="text-[9px] font-black uppercase tracking-widest leading-tight">{day}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Pick a Time */}
          {selectedDay && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Step 2 — Select a Time</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {(groupedSlots[selectedDay] || []).map((slot) => (
                  <button
                    key={slot.slotId}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-[1.25rem] border text-center transition-all ${
                      selectedSlot?.slotId === slot.slotId
                        ? 'bg-lime-400 border-lime-400 text-black'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-lime-400/40 hover:text-white'
                    }`}
                  >
                    <Clock className="w-3 h-3 mx-auto mb-1 opacity-60" />
                    <p className="text-[9px] font-black uppercase tracking-widest">{slot.displayTime}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Interview Mode */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Step 3 — Interview Mode</p>
            <div className="grid gap-3">
              {INTERVIEW_MODES.map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  onClick={() => setSelectedMode(value)}
                  className={`flex items-center gap-4 p-4 rounded-[1.5rem] border text-left transition-all ${
                    selectedMode === value
                      ? 'bg-lime-400/10 border-lime-400/30 text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedMode === value ? 'bg-lime-400/20' : 'bg-white/5'
                  }`}>
                    <Icon className={`w-5 h-5 ${selectedMode === value ? 'text-lime-400' : 'text-white/30'}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest ${selectedMode === value ? 'text-white' : 'text-white/50'}`}>{label}</p>
                    <p className="text-[10px] text-white/30 font-medium mt-0.5">{desc}</p>
                  </div>
                  {selectedMode === value && <CheckCircle2 className="w-4 h-4 text-lime-400 ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSchedule}
            disabled={!selectedSlot || submitting}
            className="w-full flex items-center justify-center gap-3 py-5 rounded-[1.5rem] bg-lime-400 hover:bg-lime-300 text-black text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-lime-400/20 transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Scheduling...</>
            ) : (
              <> Confirm Interview <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      )}
    </ModalWrapper>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ModalWrapper({ visible, onClose, children }) {
  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center p-4 transition-all duration-500
        ${visible ? 'bg-black/90 backdrop-blur-3xl' : 'bg-transparent'}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar
        bg-[#0c0c0e] border border-white/10 rounded-[2.5rem] shadow-2xl p-10
        transition-all duration-700
        ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
      >
        <div className="absolute top-0 left-0 w-full h-1 rounded-t-[2.5rem] bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-50" />
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, link }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-white/5 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-white/30" />
      </div>
      <div>
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{label}</p>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-lime-400 hover:underline break-all">{value}</a>
        ) : (
          <p className="text-xs font-bold text-white">{value}</p>
        )}
      </div>
    </div>
  );
}
