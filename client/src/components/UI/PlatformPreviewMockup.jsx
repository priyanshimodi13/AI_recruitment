import React, { useEffect, useRef, useState } from 'react';

export default function PlatformPreviewMockup() {
  const tiltWrapperRef = useRef(null);
  const floatWrapperRef = useRef(null);
  const revealWrapperRef = useRef(null);
  const mockupSectionRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const section = mockupSectionRef.current;
    const tiltWrapper = tiltWrapperRef.current;
    const floatWrapper = floatWrapperRef.current;

    const handleMouseMove = (e) => {
      if (!isHovering) {
        setIsHovering(true);
        if (floatWrapper) floatWrapper.style.animationPlayState = 'paused';
        if (tiltWrapper) tiltWrapper.style.transition = 'transform 0.1s ease';
      }
      if (section && tiltWrapper) {
        const rect = section.getBoundingClientRect();
        const xNorm = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const yNorm = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        tiltWrapper.style.transform = `perspective(1000px) rotateX(${yNorm * -6}deg) rotateY(${xNorm * 8}deg)`;
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      if (floatWrapper) floatWrapper.style.animationPlayState = 'running';
      if (tiltWrapper) {
        tiltWrapper.style.transition = 'transform 0.5s ease-out';
        tiltWrapper.style.transform = `perspective(1000px) rotateX(4deg) rotateY(-6deg)`;
      }
    };

    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      section.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove);
        section.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isHovering]);

  useEffect(() => {
    const revealWrapper = revealWrapperRef.current;
    if (revealWrapper && typeof IntersectionObserver !== 'undefined') {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      obs.observe(revealWrapper);
      return () => obs.disconnect();
    }
  }, []);

  return (
    <>
      <style>{`
        /* --- NEW SCROLLING MOCKUP SECTION --- */
        .mockup-showcase-section {
          background-color: var(--bg); /* Integrates with parent theme if available */
          width: 100%;
          padding: 100px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-sizing: border-box;
          perspective: 1500px;
          position: relative;
          z-index: 10;
        }
        .mockup-label {
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #a3a3a3;
          margin-bottom: 40px;
          text-align: center;
        }
        .mockup-reveal-wrapper {
          width: 100%;
          max-width: 1000px;
          display: flex;
          justify-content: center;
          opacity: 0;
          transform: perspective(1000px) rotateX(10deg) translateY(60px);
          transition: opacity 0.9s ease-out, transform 0.9s ease-out;
        }
        .mockup-reveal-wrapper.is-visible {
          opacity: 1;
          transform: perspective(1000px) rotateX(0deg) translateY(0);
        }
        @keyframes deviceFloat {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-14px); }
        }
        .mockup-float-wrapper {
          width: 100%;
          animation: deviceFloat 5s ease-in-out infinite;
          transform-style: preserve-3d;
        }
        .mockup-tilt-wrapper {
          transform: perspective(1000px) rotateX(4deg) rotateY(-6deg);
          transition: transform 0.1s ease;
          transform-style: preserve-3d;
          width: 100%;
          background: #fff;
          border-radius: 18px;
          border: 1.5px solid #d0d0d0;
          box-shadow: 0 40px 100px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          aspect-ratio: 16 / 10;
        }
        .scrolling-mockup-chrome {
          height: 44px;
          background-color: #f8f8f8;
          border-bottom: 1.5px solid #eaeaea;
          display: flex;
          align-items: center;
          padding: 0 16px;
          position: relative;
          flex-shrink: 0;
        }
        .scrolling-mockup-dots {
          display: flex;
          gap: 8px;
        }
        .scrolling-mockup-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .scrolling-mockup-dot.red { background-color: #ff5f56; }
        .scrolling-mockup-dot.yellow { background-color: #ffbd2e; }
        .scrolling-mockup-dot.green { background-color: #27c93f; }
        .scrolling-mockup-url-bar {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 35%;
          height: 24px;
          background-color: #eaeaea;
          border-radius: 12px;
        }
        .scrolling-mockup-screen-content {
          flex: 1;
          background-color: #000;
          position: relative;
          overflow: hidden;
        }
        .ui-scroll-container {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #fafafa;
          position: relative;
        }
        .ui-scroller {
          width: 100%;
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: scrollMockup 20s linear infinite;
        }
        @keyframes scrollMockup {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); } 
        }
        .ui-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 16px; border-bottom: 1px solid #eaeaea; }
        .ui-logo { font-weight: 800; font-size: 16px; color: #111; letter-spacing: -0.5px; }
        .ui-logo span { color: #c8f135; background: #111; padding: 2px 6px; border-radius: 4px; margin-left: 2px; }
        .ui-nav { display: flex; gap: 16px; font-size: 12px; font-weight: 600; color: #888; }
        .ui-nav span.active { color: #111; }
        .ui-stats-row { display: flex; gap: 16px; margin-bottom: 8px; }
        .ui-stat-box { flex: 1; background: #fff; border: 1px solid #eaeaea; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .ui-stat-num { font-size: 20px; font-weight: 800; color: #111; line-height: 1; margin-bottom: 4px;}
        .ui-stat-label { font-size: 10px; color: #888; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .inner-ui-card { background: #fff; border: 1px solid #eaeaea; border-radius: 10px; padding: 16px; display: flex; gap: 16px; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border-left: 4px solid transparent; }
        .inner-ui-card.top-match { border-left-color: #c8f135; }
        .ui-avatar { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: #333; flex-shrink: 0; }
        .ui-avatar.a1 { background: #fee2e2; color: #991b1b; }
        .ui-avatar.a2 { background: #dcfce7; color: #166534; }
        .ui-avatar.a3 { background: #e0e7ff; color: #3730a3; }
        .ui-avatar.a4 { background: #fef9c3; color: #854d0e; }
        .ui-card-content { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .ui-name-row { display: flex; justify-content: space-between; align-items: center; }
        .ui-name { font-size: 14px; font-weight: 700; color: #111; }
        .ui-badge { font-size: 10px; font-weight: 700; background: #111; color: #c8f135; padding: 3px 8px; border-radius: 6px; letter-spacing: 0.5px;}
        .ui-badge.sec { background: #f4f4f4; color: #666; font-weight: 600;}
        .ui-role { font-size: 12px; color: #555; }
        .ui-skills { display: flex; gap: 6px; margin-top: 6px; }
        .ui-skill { font-size: 10px; background: #f8f8f8; border: 1px solid #eaeaea; padding: 3px 8px; border-radius: 4px; color: #666; font-weight: 500;}
      `}</style>

      <section className="mockup-showcase-section" id="mockup-section" ref={mockupSectionRef}>
        <div className="mockup-label">Platform Demo</div>
        <div className="mockup-reveal-wrapper" id="mockup-reveal" ref={revealWrapperRef}>
          <div className="mockup-float-wrapper" id="mockup-float" ref={floatWrapperRef}>
            <div className="mockup-tilt-wrapper" id="mockup-tilt" ref={tiltWrapperRef}>
              <div className="scrolling-mockup-chrome">
                <div className="scrolling-mockup-dots">
                  <span className="scrolling-mockup-dot red"></span>
                  <span className="scrolling-mockup-dot yellow"></span>
                  <span className="scrolling-mockup-dot green"></span>
                </div>
                <div className="scrolling-mockup-url-bar"></div>
              </div>
              <div className="scrolling-mockup-screen-content">
                <div className="ui-scroll-container">
                  <div className="ui-scroller">
                    {/* First Set */}
                    <div className="ui-header">
                      <div className="ui-logo">Recruit<span>AI</span></div>
                      <div className="ui-nav"><span className="active">Candidates</span><span>Jobs</span><span>Interviews</span></div>
                    </div>
                    <div className="ui-stats-row">
                      <div className="ui-stat-box"><div className="ui-stat-num">4,285</div><div className="ui-stat-label">Resumes Scanned</div></div>
                      <div className="ui-stat-box"><div className="ui-stat-num">34</div><div className="ui-stat-label">Interviews Booked</div></div>
                      <div className="ui-stat-box"><div className="ui-stat-num">98%</div><div className="ui-stat-label">AI Accuracy</div></div>
                    </div>
                    <div className="inner-ui-card top-match"><div className="ui-avatar a2">AK</div><div className="ui-card-content"><div className="ui-name-row"><div className="ui-name">Arjun Kumar</div><div className="ui-badge">98% Match</div></div><div className="ui-role">Senior React Developer</div><div className="ui-skills"><span className="ui-skill">React</span><span className="ui-skill">Node.js</span><span className="ui-skill">AI Ranked #1</span></div></div></div>
                    <div className="inner-ui-card"><div className="ui-avatar a3">ER</div><div className="ui-card-content"><div className="ui-name-row"><div className="ui-name">Elena Rodriguez</div><div className="ui-badge sec">In Review</div></div><div className="ui-role">Full-Stack Engineer</div><div className="ui-skills"><span className="ui-skill">TypeScript</span><span className="ui-skill">AWS</span></div></div></div>
                    <div className="inner-ui-card"><div className="ui-avatar a1">MC</div><div className="ui-card-content"><div className="ui-name-row"><div className="ui-name">Marcus Chen</div><div className="ui-badge sec">Interviewing</div></div><div className="ui-role">Backend Developer</div><div className="ui-skills"><span className="ui-skill">Python</span><span className="ui-skill">MongoDB</span></div></div></div>
                    <div className="inner-ui-card top-match"><div className="ui-avatar a4">SJ</div><div className="ui-card-content"><div className="ui-name-row"><div className="ui-name">Sarah Jenkins</div><div className="ui-badge">95% Match</div></div><div className="ui-role">UI/UX Designer</div><div className="ui-skills"><span className="ui-skill">Figma</span><span className="ui-skill">Prototyping</span></div></div></div>
                    
                    {/* Duplicated Set */}
                    <div className="ui-header" style={{ marginTop: '16px' }}>
                      <div className="ui-logo">Recruit<span>AI</span></div>
                      <div className="ui-nav"><span className="active">Candidates</span><span>Jobs</span><span>Interviews</span></div>
                    </div>
                    <div className="ui-stats-row"><div className="ui-stat-box"><div className="ui-stat-num">4,285</div><div className="ui-stat-label">Resumes Scanned</div></div><div className="ui-stat-box"><div className="ui-stat-num">34</div><div className="ui-stat-label">Interviews Booked</div></div><div className="ui-stat-box"><div className="ui-stat-num">98%</div><div className="ui-stat-label">AI Accuracy</div></div></div>
                    <div className="inner-ui-card top-match"><div className="ui-avatar a2">AK</div><div className="ui-card-content"><div className="ui-name-row"><div className="ui-name">Arjun Kumar</div><div className="ui-badge">98% Match</div></div><div className="ui-role">Senior React Developer</div><div className="ui-skills"><span className="ui-skill">React</span><span className="ui-skill">Node.js</span><span className="ui-skill">AI Ranked #1</span></div></div></div>
                    <div className="inner-ui-card"><div className="ui-avatar a3">ER</div><div className="ui-card-content"><div className="ui-name-row"><div className="ui-name">Elena Rodriguez</div><div className="ui-badge sec">In Review</div></div><div className="ui-role">Full-Stack Engineer</div><div className="ui-skills"><span className="ui-skill">TypeScript</span><span className="ui-skill">AWS</span></div></div></div>
                    <div className="inner-ui-card"><div className="ui-avatar a1">MC</div><div className="ui-card-content"><div className="ui-name-row"><div className="ui-name">Marcus Chen</div><div className="ui-badge sec">Interviewing</div></div><div className="ui-role">Backend Developer</div><div className="ui-skills"><span className="ui-skill">Python</span><span className="ui-skill">MongoDB</span></div></div></div>
                    <div className="inner-ui-card top-match"><div className="ui-avatar a4">SJ</div><div className="ui-card-content"><div className="ui-name-row"><div className="ui-name">Sarah Jenkins</div><div className="ui-badge">95% Match</div></div><div className="ui-role">UI/UX Designer</div><div className="ui-skills"><span className="ui-skill">Figma</span><span className="ui-skill">Prototyping</span></div></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
