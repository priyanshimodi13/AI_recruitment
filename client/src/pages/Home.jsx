import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import DigitalSerenity from '../components/UI/digital-serenity-animated-landing-page';
import PlatformPreviewMockup from '../components/UI/PlatformPreviewMockup';

export default function Home() {
 const { isSignedIn, isLoaded } = useAuth();
 const [counts, setCounts] = useState({ resumes: 0, companies: 0, speed: 0, satisfaction: 0 });
 const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
 const [isHovering, setIsHovering] = useState(false);

 useEffect(() => {
  // Custom Cursor event listener
  const moveCursor = (e) => {
   requestAnimationFrame(() => {
    setCursorPos({ x: e.clientX, y: e.clientY });
   });
  };
  window.addEventListener('mousemove', moveCursor);

  // Stats counter logic
  const startCounters = () => {
   const targets = { resumes: 10000, companies: 500, speed: 3, satisfaction: 98 };
   let step = 0;
   const steps = 60;
   const timer = setInterval(() => {
    step++;
    setCounts({
     resumes: Math.floor((targets.resumes / steps) * step),
     companies: Math.floor((targets.companies / steps) * step),
     speed: Math.floor((targets.speed / steps) * step),
     satisfaction: Math.floor((targets.satisfaction / steps) * step)
    });
    if (step >= steps) {
     clearInterval(timer);
     setCounts(targets);
    }
   }, 33);
  };

  // Intersection observers
  const obsOptions = { threshold: 0.15 };
  const obs = new IntersectionObserver((entries, observer) => {
   entries.forEach(e => {
    if(e.isIntersecting) {
     e.target.classList.add('kal-in-view');
     if(e.target.id === 'kal-stats-container') startCounters();
     observer.unobserve(e.target);
    }
   });
  }, obsOptions);

  document.querySelectorAll('.kal-fade-up, .kal-slide-left, .kal-slide-right, #kal-stats-container').forEach(el => obs.observe(el));

  return () => {
   window.removeEventListener('mousemove', moveCursor);
   obs.disconnect();
  };
 }, []);

 if (isLoaded && isSignedIn) {
  return <Navigate to="/dashboard" replace />;
 }

 const hoverProps = {
  onMouseEnter: () => setIsHovering(true),
  onMouseLeave: () => setIsHovering(false)
 };

 return (
  <div className="kal-theme">
   {/* Google Fonts */}
   <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Jost:wght@200;300;400;500&display=swap');
   `}</style>
   
   {/* CUSTOM CURSOR */}
   <div 
    className={`kal-cursor-dot ${isHovering ? 'kal-hover-state' : ''}`} 
    style={{ left: cursorPos.x + 'px', top: cursorPos.y + 'px' }}
   ></div>

   {/* HERO SECTION */}
   <section className="kal-hero-wrapper">
    <video autoPlay loop muted playsInline className="kal-hero-bg-video">
     <source src="/69e714293555b.mp4" type="video/mp4" />
    </video>
    <div className="kal-hero-overlay"></div>
    
    <div className="kal-hero kal-container">
     <div className="kal-hero-top-label">AI RECRUITMENT PLATFORM — EST. 2024</div>
     
     <div className="kal-hero-title-container">
       <h1 className="kal-hero-title">
         <span className="delay-1">HIRE</span> <span className="delay-2">PEOPLE.</span>
         <span className="kal-line-2 delay-3">NOT PAPERWORK.</span>
       </h1>
     </div>

     <p className="kal-hero-body kal-fade-up">
       Hire Vision handles resume screening, interview scheduling, and candidate communication — so your team focuses on people.
     </p>

     <div className="kal-hero-links kal-fade-up delay-2-fade">
       <Link to="/admin" className="kal-hero-link-primary" {...hoverProps}>Start hiring smarter ↗</Link>
       <a href="#kal-features" className="kal-hero-link-secondary" {...hoverProps}>See how it works ↓</a>
     </div>

     <svg className="kal-rotating-badge desktop-only" viewBox="0 0 100 100" width="100" height="100">
       <defs>
        <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"/>
       </defs>
       <text fontSize="11" fontFamily="'Inter', sans-serif" fontWeight="500" letterSpacing="3" fill="#6b6b6b">
        <textPath href="#circlePath">
         SCROLL TO EXPLORE &bull; SCROLL TO EXPLORE &bull;
        </textPath>
       </text>
     </svg>

     <div className="kal-hero-bottom-rule"></div>
    </div>
   </section>

   {/* MARQUEE */}
   <div className="kal-marquee">
     <div className="kal-marquee-inner">
       <div className="kal-marquee-item">
         <span>RESUME SCREENING</span>
         <span>INTERVIEW SCHEDULING</span>
         <span>CANDIDATE NOTIFICATIONS</span>
         <span>ADMIN DASHBOARD</span>
         <span>CALENDAR SYNC</span>
         <span>AI RANKING</span>
         <span>INSTANT ALERTS</span>
       </div>
       <div className="kal-marquee-item">
         <span>RESUME SCREENING</span>
         <span>INTERVIEW SCHEDULING</span>
         <span>CANDIDATE NOTIFICATIONS</span>
         <span>ADMIN DASHBOARD</span>
         <span>CALENDAR SYNC</span>
         <span>AI RANKING</span>
         <span>INSTANT ALERTS</span>
       </div>
     </div>
   </div>

   {/* STATEMENT SECTION ANIMATED */}
   <section className="kal-statement-animated-override" style={{ backgroundColor: '#000000' }}> {/* matches background of component */}
     <DigitalSerenity />
     
     <div className="kal-container" style={{ paddingBottom: '40px' }}>
       <div className="kal-statement-bottom">
         <span className="kal-section-label kal-fade-up no-margin">01 / WHY HIRE VISION</span>
         <p className="kal-statement-p kal-fade-up">
           Hire Vision automates the repetitive work of recruitment — from reading resumes to booking interviews — so your team can spend time on what actually matters: the people.
         </p>
       </div>
     </div>
   </section>

   {/* FEATURES SECTION */}
   <section className="kal-features-section kal-container" id="kal-features">
     <span className="kal-section-label kal-fade-up">02 / WHAT WE DO</span>
     <h2 className="kal-features-headline kal-fade-up">
       EVERYTHING AUTOMATED.<br/>NOTHING MISSED.
     </h2>

     <div className="kal-features-grid">
       <div className="kal-feature-item kal-fade-up delay-1-fade">
         <div className="kal-feat-num">01</div>
         <h3 className="kal-feat-title">AI Resume Screening</h3>
         <p className="kal-feat-desc">Automatically ranks and filters resumes by job fit</p>
       </div>
       <div className="kal-feature-item kal-fade-up delay-2-fade">
         <div className="kal-feat-num">02</div>
         <h3 className="kal-feat-title">Smart Scheduling</h3>
         <p className="kal-feat-desc">Books interviews and syncs to Google Calendar or .ics</p>
       </div>
       <div className="kal-feature-item kal-fade-up delay-3-fade">
         <div className="kal-feat-num">03</div>
         <h3 className="kal-feat-title">Instant Notifications</h3>
         <p className="kal-feat-desc">Emails candidates the moment their status changes</p>
       </div>
       <div className="kal-feature-item kal-fade-up delay-4-fade">
         <div className="kal-feat-num">04</div>
         <h3 className="kal-feat-title">Admin Dashboard</h3>
         <p className="kal-feat-desc">One clean panel to review, accept, or reject applicants</p>
       </div>
       <div className="kal-feature-item kal-fade-up delay-5-fade">
         <div className="kal-feat-num">05</div>
         <h3 className="kal-feat-title">Role-Based Access</h3>
         <p className="kal-feat-desc">Separate secure portals for candidates and admins</p>
       </div>
       <div className="kal-feature-item kal-fade-up delay-6-fade">
         <div className="kal-feat-num">06</div>
         <h3 className="kal-feat-title">Real-Time Analytics</h3>
         <p className="kal-feat-desc">Track applications, pipeline health, and hiring velocity</p>
       </div>
     </div>
   </section>

   {/* PLATFORM PREVIEW MOCKUP */}
   <PlatformPreviewMockup />

   {/* HOW IT WORKS */}
   <section className="kal-process-section kal-container">
     <span className="kal-section-label kal-fade-up">03 / THE PROCESS</span>
     <h2 className="kal-process-headline kal-fade-up">FROM APPLICATION TO HIRED.<br/>FOUR STEPS.</h2>

     <div className="kal-process-steps">
       <div className="kal-step-row kal-slide-left">
         <div className="kal-step-num-col">
           <div className="kal-step-num">01</div>
         </div>
         <div className="kal-step-content-col">
           <h3 className="kal-step-title">Candidate Applies</h3>
           <p className="kal-step-desc">Fills out the form and uploads their resume from the candidate portal.</p>
         </div>
       </div>
       <div className="kal-step-row kal-slide-right">
         <div className="kal-step-num-col">
           <div className="kal-step-num">02</div>
         </div>
         <div className="kal-step-content-col">
           <h3 className="kal-step-title">AI Screens Resume</h3>
           <p className="kal-step-desc">The system scores and ranks the resume against the job requirements.</p>
         </div>
       </div>
       <div className="kal-step-row kal-slide-left">
         <div className="kal-step-num-col">
           <div className="kal-step-num">03</div>
         </div>
         <div className="kal-step-content-col">
           <h3 className="kal-step-title">Admin Reviews</h3>
           <p className="kal-step-desc">The recruiter opens the resume, then accepts or rejects in one click.</p>
         </div>
       </div>
       <div className="kal-step-row kal-slide-right">
         <div className="kal-step-num-col">
           <div className="kal-step-num">04</div>
         </div>
         <div className="kal-step-content-col">
           <h3 className="kal-step-title">Interview Booked</h3>
           <p className="kal-step-desc">Accepted candidates get an email with their interview time and calendar link.</p>
         </div>
       </div>
     </div>
   </section>

   {/* STATS */}
   <section className="kal-stats-section">
     <div className="kal-container" id="kal-stats-container">
       <div className="kal-stats-grid">
         <div className="kal-stat-item kal-fade-up">
           <div className="kal-stat-number-wrapper">
             <span>{counts.resumes.toLocaleString()}</span>+
           </div>
           <span className="kal-stat-label">Resumes Screened</span>
         </div>
         <div className="kal-stat-item kal-fade-up delay-1-fade">
           <div className="kal-stat-number-wrapper">
             <span>{counts.companies.toLocaleString()}</span>+
           </div>
           <span className="kal-stat-label">Companies Using</span>
         </div>
         <div className="kal-stat-item kal-fade-up delay-2-fade">
           <div className="kal-stat-number-wrapper">
             <span>{counts.speed}</span>x
           </div>
           <span className="kal-stat-label">Faster Hiring</span>
         </div>
         <div className="kal-stat-item kal-fade-up delay-3-fade">
           <div className="kal-stat-number-wrapper">
             <span>{counts.satisfaction}</span>%
           </div>
           <span className="kal-stat-label">Satisfaction</span>
         </div>
       </div>

       <h3 className="kal-stats-quote kal-fade-up">
         "The future of hiring isn't faster humans — it's smarter systems."
       </h3>
     </div>
   </section>

   {/* TESTIMONIALS */}
   <section className="kal-testimonials-section kal-container">
     <span className="kal-section-label kal-fade-up">04 / WHAT THEY SAY</span>
     
     <div className="kal-testi-wrapper">
       <div className="kal-testi-row kal-fade-up">
         <div className="kal-quote-mark">"</div>
         <div className="kal-testi-content">
           <p className="kal-testi-quote">Hire Vision cut our hiring time in half. The AI screening alone saved us 20 hours a week.</p>
           <p className="kal-testi-author">— Sarah M., HR Manager &middot; TechCorp</p>
         </div>
       </div>
       <div className="kal-testi-row kal-fade-up">
         <div className="kal-quote-mark">"</div>
         <div className="kal-testi-content">
           <p className="kal-testi-quote">The admin dashboard is the cleanest tool I've used. One click to schedule. Done.</p>
           <p className="kal-testi-author">— Raj P., Talent Lead &middot; HireNow</p>
         </div>
       </div>
       <div className="kal-testi-row kal-fade-up">
         <div className="kal-quote-mark">"</div>
         <div className="kal-testi-content">
           <p className="kal-testi-quote">Our candidates feel respected because they hear back instantly. It is a game-changer.</p>
           <p className="kal-testi-author">— Emily T., Senior Recruiter &middot; StaffPro</p>
         </div>
       </div>
     </div>
   </section>

   {/* CTA */}
   <section className="kal-cta-section kal-container">
     <h2 className="kal-cta-headline kal-fade-up">
       READY TO HIRE<br/><span>SMARTER?</span>
     </h2>
     <p className="kal-cta-desc kal-fade-up delay-1-fade">
       Join 500+ companies transforming their recruitment with AI.
     </p>
     <div className="kal-cta-buttons kal-fade-up delay-2-fade">
       <Link to="/admin" className="kal-btn-fill" {...hoverProps}>Post a Job &rarr;</Link>
       <Link to="/upload-resume" className="kal-btn-outline" {...hoverProps}>Upload Resume &rarr;</Link>
     </div>
     <p className="kal-cta-footer kal-fade-up delay-3-fade">
       No credit card required &middot; Setup in under 10 minutes
     </p>
   </section>

   {/* FOOTER */}
   <footer className="kal-footer kal-container">
     <div className="kal-footer-top">
       <div className="kal-footer-left">
         <span className="kal-footer-logo">Hire Vision</span>
         <span className="kal-footer-tagline">Hire people. Not paperwork.</span>
       </div>
       <div className="kal-footer-right">
         <div className="kal-footer-links">
           <a href="#kal-features" {...hoverProps}>Features</a>
           <a href="#kal-process" {...hoverProps}>How It Works</a>
           <Link to="/admin" {...hoverProps}>Post a Job</Link>
           <Link to="/upload-resume" {...hoverProps}>Upload Resume</Link>
           <Link to="/sign-in" {...hoverProps}>Admin Login</Link>
           <a href="#" {...hoverProps}>Privacy Policy</a>
           <a href="#" {...hoverProps}>Terms of Service</a>
         </div>
       </div>
     </div>
     <div className="kal-footer-bottom">
       &copy; 2024 Hire Vision. All rights reserved.
     </div>
   </footer>

   {/* SCOPED CSS FOR KALEIDA THEME */}
   <style>{`
    /* Core Reset & Variables scoped to .kal-theme */
    .kal-theme {
      --bg: #000000;
      --black: #ffffff;
      --gray-mid: #a3a3a3;
      --gray-light: #333333;
      --rule: #333333;
      --accent: #c8f135;
      --font-display: 'Jost', sans-serif;
      --font-body: 'Inter', system-ui, sans-serif;
      --section-pad: clamp(80px, 12vw, 160px);
      --container: min(1200px, 90vw);
      
      background-color: var(--bg);
      color: var(--black);
      font-family: var(--font-body);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      line-height: 1.5;
      min-height: 100vh;
    }
    
    .kal-theme * {
      cursor: none !important;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    /* Custom Cursor */
    .kal-cursor-dot {
      width: 10px;
      height: 10px;
      background-color: var(--black);
      border-radius: 50%;
      position: fixed;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 99999;
      transition: width 0.3s ease, height 0.3s ease, background-color 0.3s ease;
    }
    .kal-cursor-dot.kal-hover-state {
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    /* Layout */
    .kal-container {
      width: var(--container);
      margin: 0 auto;
    }
    
    .kal-hr {
      width: 100%; height: 1px; background-color: var(--rule);
    }
    .kal-section-label {
      font-family: var(--font-body); font-weight: 300; font-size: 11px;
      text-transform: uppercase; letter-spacing: 0.2em;
      color: var(--gray-mid); margin-bottom: 2rem; display: block;
    }
    .no-margin { margin-bottom: 0; }
    
    /* Animations */
    .kal-fade-up {
      opacity: 0; transform: translateY(30px);
      transition: opacity 1s cubic-bezier(0.19, 1, 0.22, 1), transform 1s cubic-bezier(0.19, 1, 0.22, 1);
      will-change: opacity, transform;
    }
    .kal-slide-left {
      opacity: 0; transform: translateX(-50px);
      transition: opacity 1s ease, transform 1s ease;
    }
    .kal-slide-right {
      opacity: 0; transform: translateX(50px);
      transition: opacity 1s ease, transform 1s ease;
    }
    
    .kal-in-view {
      opacity: 1; transform: translateY(0); transform: translateX(0);
    }
    
    .delay-1 { animation-delay: 0.1s !important; }
    .delay-2 { animation-delay: 0.2s !important; }
    .delay-3 { animation-delay: 0.3s !important; }
    
    .delay-1-fade { transition-delay: 0.1s; }
    .delay-2-fade { transition-delay: 0.2s; }
    .delay-3-fade { transition-delay: 0.3s; }
    .delay-4-fade { transition-delay: 0.4s; }
    .delay-5-fade { transition-delay: 0.5s; }
    .delay-6-fade { transition-delay: 0.6s; }
    
    /* Hero */
    .kal-hero-wrapper {
      position: relative;
      width: 100vw;
      margin-left: calc(-50vw + 50%);
      margin-right: calc(-50vw + 50%);
      height: 100vh;
      overflow: hidden;
      background-color: var(--bg);
    }
    .kal-hero-bg-video {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      object-fit: cover; z-index: 1; opacity: 0.3;
    }
    .kal-hero-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(to bottom, transparent, var(--bg));
      z-index: 2;
    }
    .kal-hero {
      height: 100%; display: flex; flex-direction: column;
      justify-content: center; position: relative;
      z-index: 3;
    }
    .kal-hero-top-label {
      font-family: var(--font-body); font-weight: 300; font-size: 12px;
      color: var(--gray-mid); letter-spacing: 0.2em; position: absolute;
      top: 120px; left: max(5vw, calc((100vw - 1200px) / 2));
    }
    .kal-hero-title-container { margin-top: 40px; }
    .kal-hero-title {
      font-family: var(--font-display); 
      font-size: clamp(48px, 9vw, 130px);
      font-weight: 300;
      text-transform: uppercase;
      letter-spacing: -0.01em;
      line-height: 0.95; color: var(--black);
    }
    .kal-hero-title span {
      display: inline-block; opacity: 0; transform: translateY(20px);
      animation: kalWordFadeUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    }
    @keyframes kalWordFadeUp {
      to { opacity: 1; transform: translateY(0); }
    }
    .kal-line-2 {
      font-weight: 200; font-style: normal; color: #ffffff; display: block;
      text-transform: uppercase;
    }
    .kal-hero-body {
      font-family: var(--font-body); font-weight: 300; font-size: 18px;
      color: var(--gray-mid); max-width: 480px; margin-top: 40px; margin-bottom: 48px;
    }
    .kal-hero-links {
      display: flex; gap: 40px; align-items: center;
    }
    .kal-hero-link-primary {
      font-family: var(--font-body); font-weight: 500; font-size: 16px;
      color: var(--bg); text-decoration: none; position: relative;
    }
    .kal-hero-link-primary::after {
      content: ''; position: absolute; bottom: -4px; left: 0;
      width: 100%; height: 1px; background-color: var(--bg); transition: 0.3s;
    }
    .kal-hero-link-primary:hover::after {
      background-color: var(--accent); height: 2px;
    }
    .kal-hero-link-secondary {
      font-family: var(--font-body); font-weight: 400; font-size: 16px;
      color: var(--gray-mid); text-decoration: none; transition: 0.3s ease;
    }
    .kal-hero-link-secondary:hover { color: var(--bg); }
    
    .kal-rotating-badge {
      position: absolute; right: max(5vw, calc((100vw - 1200px) / 2));
      bottom: 60px; width: 120px; height: 120px;
      animation: kalRotateText 20s linear infinite;
    }
    @keyframes kalRotateText {
      from { transform: rotate(0deg); } to { transform: rotate(360deg); }
    }
    .kal-hero-bottom-rule {
      position: absolute; bottom: 0; left: 0; width: 100%;
      height: 1px; background-color: var(--rule);
    }
    
    /* Marquee */
    .kal-marquee {
      width: 100vw; margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%);
      background-color: #0d0d0d; height: 48px; display: flex;
      align-items: center; overflow: hidden; white-space: nowrap; border-bottom: 1px solid var(--rule);
    }
    .kal-marquee-inner {
      display: flex; animation: kalMarqueeScroll 30s linear infinite;
    }
    .kal-marquee-item {
      font-family: var(--font-body); font-weight: 500; font-size: 13px;
      text-transform: uppercase; letter-spacing: 0.15em; color: var(--gray-mid);
      padding-right: 48px; display: flex; align-items: center; gap: 48px;
    }
    .kal-marquee-item::after {
      content: '•'; color: var(--accent); font-size: 20px;
    }
    @keyframes kalMarqueeScroll {
      0% { transform: translateX(0); } 100% { transform: translateX(-50%); }
    }
    
    /* Statement Section */
    .kal-statement-section {
      padding: var(--section-pad) 0; min-height: 80vh;
      display: flex; flex-direction: column; justify-content: center;
    }
    .kal-statement-quote {
      font-family: var(--font-display); font-weight: 300;
      font-size: clamp(32px, 5vw, 64px); line-height: 1.1; color: var(--black);
      max-width: 900px; text-align: center; margin: 0 auto 120px auto;
    }
    .kal-statement-bottom {
      display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px;
    }
    .kal-statement-p {
      font-family: var(--font-body); font-weight: 300; font-size: 16px;
      color: var(--gray-mid); max-width: 480px;
    }
    
    /* Features */
    .kal-features-section { padding: var(--section-pad) 0; }
    .kal-features-headline {
      font-family: var(--font-display); font-weight: 300;
      font-size: clamp(40px, 6vw, 72px); line-height: 1; color: var(--black);
      margin-bottom: 120px; text-transform: uppercase; letter-spacing: -0.01em;
    }
    .kal-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 120px 60px; }
    .kal-feature-item { display: flex; flex-direction: column; }
    .kal-feat-num {
      font-family: var(--font-display); font-weight: 200; font-size: 80px;
      color: var(--gray-light); line-height: 1; margin-bottom: 24px;
    }
    .kal-feat-title {
      font-family: var(--font-body); font-weight: 500; font-size: 18px; color: var(--black); margin-bottom: 8px;
    }
    .kal-feat-desc {
      font-family: var(--font-body); font-weight: 300; font-size: 14px; color: var(--gray-mid); line-height: 1.6;
    }
    
    /* Process */
    .kal-process-section { padding: var(--section-pad) 0; padding-bottom: 0; }
    .kal-process-headline {
      font-family: var(--font-display); font-weight: 300;
      font-size: clamp(40px, 6vw, 72px); line-height: 1.1; color: var(--black); margin-bottom: 80px;
      text-transform: uppercase;
    }
    .kal-step-row {
      display: flex; align-items: center; padding: 60px 0; border-bottom: 1px solid var(--rule);
    }
    .kal-step-row:first-child { border-top: 1px solid var(--rule); }
    .kal-step-num-col { flex: 0 0 40%; }
    .kal-step-num {
      font-family: var(--font-display); font-weight: 200;
      font-size: 120px; color: var(--gray-light); line-height: 1;
    }
    .kal-step-content-col { flex: 0 0 60%; }
    .kal-step-title {
      font-family: var(--font-body); font-weight: 500; font-size: 24px; color: var(--black); margin-bottom: 16px;
    }
    .kal-step-desc {
      font-family: var(--font-body); font-weight: 300; font-size: 15px; color: var(--gray-mid); max-width: 480px; line-height: 1.6;
    }
    
    /* Stats */
    .kal-stats-section {
      width: 100vw; margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%);
      padding: var(--section-pad) 0; border-top: 1px solid var(--rule); color: var(--black); margin-top: var(--section-pad);
    }
    .kal-stats-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--rule); padding-bottom: 80px;
    }
    .kal-stat-item {
      border-right: 1px solid var(--rule); padding: 0 40px; display: flex; flex-direction: column; justify-content: flex-end;
    }
    .kal-stat-item:first-child { padding-left: 0; }
    .kal-stat-item:last-child { border-right: none; padding-right: 0;}
    .kal-stat-number-wrapper {
      font-family: var(--font-display); font-weight: 200; font-size: clamp(48px, 8vw, 96px); line-height: 1; margin-bottom: 16px; display: flex; align-items: baseline;
    }
    .kal-stat-label {
      font-family: var(--font-body); font-weight: 300; font-size: 13px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gray-mid);
    }
    .kal-stats-quote {
      text-align: center; font-family: var(--font-display); font-weight: 300; font-size: clamp(24px, 4vw, 40px); margin-top: 80px; max-width: 900px; margin-inline: auto; color: var(--black);
    }
    
    /* Testimonials */
    .kal-testimonials-section { padding: var(--section-pad) 0; }
    .kal-testi-row {
      padding: 80px 0; border-bottom: 1px solid var(--rule); display: flex; align-items: flex-start; gap: 40px;
    }
    .kal-testi-row:first-child { border-top: 1px solid var(--rule); }
    .kal-quote-mark {
      font-family: var(--font-display); font-weight: 200; font-size: 120px; color: var(--accent); line-height: 0.6; margin-top: 20px;
    }
    .kal-testi-content { flex-grow: 1; }
    .kal-testi-quote {
      font-family: var(--font-display); font-weight: 300; font-size: clamp(20px, 3vw, 32px); color: var(--black); line-height: 1.4; max-width: 900px; margin-bottom: 32px;
    }
    .kal-testi-author {
      font-family: var(--font-body); font-weight: 300; font-size: 13px; text-transform: uppercase; color: var(--gray-mid);
    }
    
    /* CTA */
    .kal-cta-section {
      height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;
    }
    .kal-cta-headline {
      font-family: var(--font-display); font-weight: 300; text-transform: uppercase; font-size: clamp(48px, 10vw, 120px); line-height: 1; color: var(--black); margin-bottom: 32px; letter-spacing: -0.01em;
    }
    .kal-cta-headline span { font-weight: 200; display: block; }
    .kal-cta-desc {
      font-family: var(--font-body); font-weight: 300; font-size: 16px; color: var(--gray-mid); margin-bottom: 48px;
    }
    .kal-cta-buttons { display: flex; gap: 24px; justify-content: center; margin-bottom: 32px; }
    .kal-btn-fill {
      font-family: var(--font-body); font-weight: 400; font-size: 15px; color: #000000; background-color: var(--black); padding: 16px 36px; border-radius: 999px; text-decoration: none; border: 1px solid var(--black); transition: all 0.3s ease; display: inline-block;
    }
    .kal-btn-fill:hover { background-color: var(--accent); border-color: var(--accent); color: #000000; }
    .kal-btn-outline {
      font-family: var(--font-body); font-weight: 400; font-size: 15px; color: var(--black); background-color: transparent; padding: 16px 36px; border-radius: 999px; text-decoration: none; border: 1px solid var(--black); transition: all 0.3s ease; display: inline-block;
    }
    .kal-btn-outline:hover { background-color: var(--black); color: #000000; }
    .kal-cta-footer { font-family: var(--font-body); font-weight: 300; font-size: 13px; color: var(--gray-mid); }
    
    /* Footer */
    .kal-footer { padding: 80px 0 40px 0; border-top: 1px solid var(--rule); }
    .kal-footer-top { display: flex; justify-content: space-between; margin-bottom: 120px; }
    .kal-footer-logo { font-family: var(--font-body); font-weight: 500; font-size: 24px; color: var(--black); margin-bottom: 16px; display: block; }
    .kal-footer-tagline { font-family: var(--font-display); font-weight: 300; font-size: 24px; color: var(--black); }
    .kal-footer-links { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 60px; }
    .kal-footer-links a { font-family: var(--font-body); font-weight: 300; font-size: 14px; color: var(--gray-mid); text-decoration: none; transition: color 0.3s ease; }
    .kal-footer-links a:hover { color: var(--black); }
    .kal-footer-bottom { text-align: center; font-family: var(--font-body); font-weight: 300; font-size: 12px; color: var(--gray-mid); }
    
    @media (max-width: 768px) {
      .kal-hero-title { padding-top: 60px; }
      .desktop-only { display: none; }
      .kal-hero-links { flex-direction: column; align-items: flex-start; gap: 24px; }
      .kal-statement-bottom { flex-direction: column; align-items: flex-start; gap: 40px; }
      .kal-statement-quote { margin-bottom: 60px; text-align: left;}
      .kal-features-grid { grid-template-columns: 1fr; gap: 80px; }
      .kal-step-row { flex-direction: column; align-items: flex-start; padding: 40px 0; }
      .kal-step-num-col { margin-bottom: 24px; }
      .kal-step-num { font-size: 80px; }
      .kal-stats-grid { grid-template-columns: 1fr; gap: 40px 0; }
      .kal-stat-item { border-right: none; padding: 0; }
      .kal-testi-row { flex-direction: column; gap: 20px; padding: 60px 0;}
      .kal-quote-mark { font-size: 80px; }
      .kal-cta-buttons { flex-direction: column; width: 100%; padding: 0 24px; }
      .kal-btn-fill, .kal-btn-outline { width: 100%; }
      .kal-footer-top { flex-direction: column; gap: 60px; }
    }
   `}</style>
  </div>
 );
}
