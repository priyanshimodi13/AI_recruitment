import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, UserCircle } from 'lucide-react';
import gsap from 'gsap';
import ThreeBackground from '../components/ThreeBackground';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action') || 'signin';
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    // GSAP animations
    const tl = gsap.timeline();

    // Animate title
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      0
    );

    // Animate cards with stagger
    gsap.fromTo(
      cardsRef.current?.querySelectorAll('.role-card'),
      { opacity: 0, y: 40, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.2)',
        delay: 0.3
      }
    );

    // Add hover animations
    const cards = cardsRef.current?.querySelectorAll('.role-card');
    cards?.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }, []);

  const handleRoleSelection = (role) => {
    localStorage.setItem('intendedRole', role);
    if (action === 'signup') {
      navigate('/sign-up');
    } else {
      navigate('/sign-in');
    }
  };

  return (
    <div 
      className="h-screen w-full flex items-center justify-center bg-black relative overflow-hidden"
      style={{ fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      <ThreeBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 to-transparent pointer-events-none"></div>
      
      <div className="w-full max-w-4xl relative z-20 px-6">
        <div className="text-center mb-12" ref={titleRef}>
          <h1 className="text-white font-display font-black italic tracking-tighter text-4xl md:text-6xl mb-4">
            CHOOSE YOUR PATH
          </h1>
          <p className="text-slate-300 font-medium text-lg max-w-xl mx-auto opacity-90">
            Select how you want to use Hire Vision. Are you looking for your next great opportunity, or are you hiring top talent?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" ref={cardsRef}>
          {/* Candidate Card */}
          <button 
            onClick={() => handleRoleSelection('candidate')}
            className="role-card group relative backdrop-blur-3xl border border-lime-400/20 rounded-[3.5rem] p-12 text-left hover:border-lime-400/60 transition-all duration-500 overflow-hidden bg-[#0a0a0a]/80 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-[1.25rem] bg-[#111] border border-lime-400/30 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:border-lime-400 transition-all duration-500">
                <UserCircle className="w-8 h-8 text-lime-400" />
              </div>
              
              <h2 className="text-4xl font-display font-black text-white mb-6 tracking-tight uppercase">FIND A JOB</h2>
              <p className="text-slate-400 font-medium leading-relaxed mb-10 flex-grow text-[15px]">
                Create your profile, practice with our AI interviewer, get your resume parsed instantly, and discover jobs that match your skills perfectly.
              </p>
              
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-lime-400 flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                CONTINUE AS CANDIDATE
                <span className="text-lg">→</span>
              </div>
            </div>
          </button>

          {/* Employer Card */}
          <button 
            onClick={() => handleRoleSelection('employer')}
            className="role-card group relative backdrop-blur-3xl border border-lime-400/20 rounded-[3.5rem] p-12 text-left hover:border-lime-400/60 transition-all duration-500 overflow-hidden bg-[#0a0a0a]/80 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 rounded-[1.25rem] bg-[#111] border border-lime-400/30 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:border-lime-400 transition-all duration-500">
                <Briefcase className="w-8 h-8 text-lime-400" />
              </div>
              
              <h2 className="text-4xl font-display font-black text-white mb-6 tracking-tight uppercase">POST A JOB</h2>
              <p className="text-slate-400 font-medium leading-relaxed mb-10 flex-grow text-[15px]">
                Post your open roles, reach a pool of pre-vetted top talent, and let our AI match the best candidates directly to your requirements.
              </p>
              
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-lime-400 flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                CONTINUE AS EMPLOYER
                <span className="text-lg">→</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
