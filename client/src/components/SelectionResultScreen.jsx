/**
 * SelectionResultScreen.jsx
 * Displayed immediately after a candidate applies, showing SELECTED or REJECTED result.
 * Props:
 *  - result: { status, matchPercentage, matchedSkills, missingSkills, advantageSkills, aiFeedback, jobTitle, companyName }
 *  - candidateEmail: string
 *  - onScheduleClick: () => void   – fires when "Schedule Interview" is clicked
 *  - onViewJobsClick: () => void   – fires when "View Other Jobs" is clicked
 *  - onDismiss: () => void         – fires on backdrop click / Dismiss
 */

import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Star, AlertTriangle, ArrowRight, X } from 'lucide-react';

export default function SelectionResultScreen({
  result,
  candidateEmail,
  onScheduleClick,
  onViewJobsClick,
  onDismiss,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation on mount
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!result) return null;

  const isSelected = result.status === 'Round 1 Selected' || result.status === 'SELECTED';
  const score      = result.matchPercentage ?? 0;

  const matchedSkills   = result.matchedSkills   || [];
  const missingSkills   = result.missingSkills    || [];
  const advantageSkills = result.advantageSkills  || [];

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-500
        ${visible ? 'bg-black/90 backdrop-blur-3xl' : 'bg-transparent'}`}
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss?.(); }}
    >
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar
        bg-[#0c0c0e] border rounded-[2.5rem] shadow-2xl p-10 transition-all duration-700
        ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}
        ${isSelected ? 'border-lime-400/30 shadow-lime-400/10' : 'border-white/10'}`}
      >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 w-full h-1 rounded-t-[2.5rem] ${
          isSelected
            ? 'bg-gradient-to-r from-transparent via-lime-400 to-transparent'
            : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
        }`} />

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="absolute top-6 right-6 w-9 h-9 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ──── SELECTED STATE ──────────────────────────────────────────── */}
        {isSelected ? (
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Pulsing icon */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-lime-400/20 rounded-[2rem] animate-ping opacity-30" />
              <div className="relative w-24 h-24 bg-lime-400/20 border border-lime-400/40 rounded-[2rem] flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-lime-400" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="inline-block px-4 py-1 rounded-full bg-lime-400/10 border border-lime-400/20 text-[10px] font-bold text-lime-400 uppercase tracking-widest">
                Round 1 Selected
              </div>
              <h1 className="text-4xl font-display font-bold text-white tracking-tighter">
                Congratulations! 🎉
              </h1>
              <p className="text-base text-white/60 font-medium">
                You've been selected for <span className="text-white font-bold">{result.jobTitle}</span>
                {result.companyName ? <> at <span className="text-lime-400 font-bold">{result.companyName}</span></> : ''}.
              </p>
            </div>

            {/* Score ring */}
            <ScoreRing score={score} isSelected={true} />

            {/* Matched Skills */}
            {matchedSkills.length > 0 && (
              <SkillSection
                title="✅ Matched Skills"
                skills={matchedSkills}
                badgeClass="bg-lime-400/10 text-lime-400 border-lime-400/20"
              />
            )}

            {/* Missing Skills to prepare */}
            {missingSkills.length > 0 && (
              <SkillSection
                title="📚 Skills to Prepare"
                skills={missingSkills}
                badgeClass="bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
              />
            )}

            {/* Advantage Skills */}
            {advantageSkills.length > 0 && (
              <SkillSection
                title="⭐ Your Advantage Skills"
                skills={advantageSkills}
                badgeClass="bg-purple-400/10 text-purple-400 border-purple-400/20"
              />
            )}

            {candidateEmail && (
              <p className="text-xs text-white/30 font-medium">
                A confirmation email has been sent to <span className="text-white/60">{candidateEmail}</span>.
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full pt-2">
              <button
                onClick={onScheduleClick}
                className="flex-1 flex items-center justify-center gap-2 py-5 rounded-[1.5rem] bg-lime-400 hover:bg-lime-300 text-black text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-lime-400/20 transition-all hover:scale-[1.02]"
              >
                Schedule Your Interview <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onDismiss}
                className="flex-1 py-5 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>

        ) : (
          /* ──── REJECTED STATE ──────────────────────────────────────────── */
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center">
              <XCircle className="w-12 h-12 text-white/30" />
            </div>

            <div className="space-y-3">
              <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Application Reviewed
              </div>
              <h1 className="text-4xl font-display font-bold text-white tracking-tighter">
                Thank You for Applying
              </h1>
              <p className="text-base text-white/50 font-medium">
                We appreciate your interest in <span className="text-white font-bold">{result.jobTitle}</span>.
              </p>
            </div>

            {/* Score ring */}
            <ScoreRing score={score} isSelected={false} />

            <p className="text-sm text-white/40 font-medium">
              A minimum of <strong className="text-white/60">50%</strong> skill match is required to advance. You matched <strong className="text-white/60">{score}%</strong>.
            </p>

            {/* Matched Skills (strengths) */}
            {matchedSkills.length > 0 && (
              <SkillSection
                title="💪 Your Strengths"
                skills={matchedSkills}
                badgeClass="bg-lime-400/10 text-lime-400 border-lime-400/20"
              />
            )}

            {/* Missing Skills */}
            {missingSkills.length > 0 && (
              <SkillSection
                title="📈 Skills to Build"
                skills={missingSkills}
                badgeClass="bg-red-400/10 text-red-400 border-red-400/20"
              />
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full pt-2">
              <button
                onClick={onViewJobsClick}
                className="flex-1 flex items-center justify-center gap-2 py-5 rounded-[1.5rem] bg-white/10 hover:bg-white/15 text-white text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
              >
                View Other Opportunities <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onDismiss}
                className="flex-1 py-5 rounded-[1.5rem] bg-white/5 border border-white/5 hover:bg-white/10 text-white/40 text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ScoreRing({ score, isSelected }) {
  const radius = 44;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke={isSelected ? '#a3e635' : '#f87171'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-black ${isSelected ? 'text-lime-400' : 'text-red-400'}`}>{score}%</span>
          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Skill Match</span>
        </div>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-lime-400' : 'text-red-400'}`}>
        {isSelected ? '✅ Above Threshold' : '❌ Below Threshold (50% required)'}
      </span>
    </div>
  );
}

function SkillSection({ title, skills, badgeClass }) {
  return (
    <div className="w-full text-left space-y-3">
      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{title}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${badgeClass}`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
