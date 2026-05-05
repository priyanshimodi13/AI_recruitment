/**
 * emailService.js
 * Handles all transactional emails using Nodemailer + Gmail SMTP.
 * Uses credentials from config.env (EMAIL_USER, EMAIL_PASS).
 */

const nodemailer = require('nodemailer');

const FRONTEND_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ─── Transporter ──────────────────────────────────────────────────────────────
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

// ─── Shared HTML Wrapper ──────────────────────────────────────────────────────
function wrapHTML(bodyContent) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>HireVision</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #09090b; color: #e4e4e7; font-family: 'Segoe UI', Arial, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
      .header { text-align: center; padding-bottom: 32px; border-bottom: 1px solid #27272a; margin-bottom: 32px; }
      .logo { font-size: 22px; font-weight: 800; letter-spacing: 0.1em; color: #a3e635; text-transform: uppercase; }
      .card { background: #18181b; border: 1px solid #27272a; border-radius: 24px; padding: 36px; margin-bottom: 24px; }
      .icon-circle { width: 72px; height: 72px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px; }
      .icon-green  { background: rgba(163,230,53,0.15); border: 1px solid rgba(163,230,53,0.3); }
      .icon-red    { background: rgba(239,68,68,0.15);  border: 1px solid rgba(239,68,68,0.3);  }
      .icon-blue   { background: rgba(96,165,250,0.15); border: 1px solid rgba(96,165,250,0.3); }
      h1 { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -0.03em; margin-bottom: 12px; line-height: 1.2; }
      h2 { font-size: 16px; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
      p  { font-size: 14px; color: #a1a1aa; line-height: 1.7; margin-bottom: 16px; }
      .score-box { background: #09090b; border-radius: 16px; padding: 20px; text-align: center; margin: 20px 0; border: 1px solid #27272a; }
      .score-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #52525b; margin-bottom: 8px; }
      .score-value { font-size: 48px; font-weight: 900; color: #a3e635; letter-spacing: -0.05em; }
      .score-bar { height: 6px; background: #27272a; border-radius: 999px; overflow: hidden; margin: 12px 0 0; }
      .score-fill { height: 6px; background: linear-gradient(90deg, #a3e635, #4ade80); border-radius: 999px; }
      .skill-list { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0; }
      .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
      .badge-green  { background: rgba(74,222,128,0.15); color: #4ade80; border: 1px solid rgba(74,222,128,0.3); }
      .badge-yellow { background: rgba(250,204,21,0.15); color: #facc15; border: 1px solid rgba(250,204,21,0.3); }
      .badge-red    { background: rgba(239,68,68,0.15);  color: #f87171; border: 1px solid rgba(239,68,68,0.3);  }
      .cta-btn { display: block; width: fit-content; margin: 24px auto 0; padding: 14px 36px; background: #a3e635; color: #09090b; border-radius: 14px; font-size: 13px; font-weight: 800; text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; }
      .footer { text-align: center; padding-top: 24px; border-top: 1px solid #27272a; margin-top: 24px; }
      .footer p { font-size: 12px; color: #3f3f46; }
      table { width: 100%; }
      td { padding: 6px 0; vertical-align: top; }
      .label-cell { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #52525b; width: 40%; }
      .value-cell { font-size: 13px; font-weight: 600; color: #e4e4e7; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">⚡ HireVision</div>
      </div>
      ${bodyContent}
      <div class="footer">
        <p>© ${new Date().getFullYear()} HireVision · AI-Powered Recruitment · All rights reserved.</p>
        <p style="margin-top:6px;">This is an automated message. Please do not reply directly to this email.</p>
      </div>
    </div>
  </body>
  </html>`;
}

// ─── 1. Selection Email ────────────────────────────────────────────────────────
/**
 * Sends a congratulatory "Round 1 Selected" email to the candidate.
 * @param {string}   candidateEmail
 * @param {string}   candidateName
 * @param {object}   jobData          - { title, company }
 * @param {number}   matchScore       - 0–100
 * @param {string[]} matchedSkills
 * @param {string[]} unmatchedSkills  - Skills to still prepare
 * @param {string}   submissionId     - Application _id for scheduling link
 */
async function sendSelectionEmail(candidateEmail, candidateName, jobData, matchScore, matchedSkills, unmatchedSkills, submissionId) {
  const scheduleLink = `${FRONTEND_URL}/dashboard`;

  const matchedBadges   = matchedSkills.map(s => `<span class="badge badge-green">${s}</span>`).join('');
  const unmatchedBadges = unmatchedSkills.map(s => `<span class="badge badge-yellow">${s}</span>`).join('');

  const body = `
    <div class="card">
      <div class="icon-circle icon-green" style="display:block;text-align:center;width:72px;height:72px;line-height:72px;margin:0 auto 20px;">🎉</div>
      <h1 style="text-align:center;">Congratulations, ${candidateName.split(' ')[0]}!</h1>
      <p style="text-align:center;">You've been selected for <strong style="color:#fff;">${jobData.title}</strong> at <strong style="color:#a3e635;">${jobData.company}</strong>.</p>

      <div class="score-box">
        <div class="score-label">AI Skill Match Score</div>
        <div class="score-value">${matchScore}%</div>
        <div class="score-bar"><div class="score-fill" style="width:${matchScore}%"></div></div>
      </div>

      ${matchedSkills.length > 0 ? `
        <h2>✅ Matched Skills</h2>
        <div class="skill-list">${matchedBadges}</div>
      ` : ''}

      ${unmatchedSkills.length > 0 ? `
        <h2 style="margin-top:20px;">📚 Skills to Prepare</h2>
        <div class="skill-list">${unmatchedBadges}</div>
      ` : ''}

      <p style="margin-top:24px;text-align:center;font-size:13px;">
        Our team will be in touch shortly to schedule your interview. In the meantime, you can view your application status on your dashboard.
      </p>
      <a href="${scheduleLink}" class="cta-btn">View My Dashboard →</a>
    </div>`;

  await getTransporter().sendMail({
    from: `"HireVision" <${process.env.EMAIL_USER}>`,
    to: candidateEmail,
    subject: `🎉 You've been Selected for Round 1 — ${jobData.title} at ${jobData.company}`,
    html: wrapHTML(body),
  });

  console.log(`[EMAIL] Selection email sent to ${candidateEmail}`);
}

// ─── 2. Rejection Email ───────────────────────────────────────────────────────
/**
 * Sends an appreciation email to candidates who did not meet the threshold.
 * @param {string}   candidateEmail
 * @param {string}   candidateName
 * @param {object}   jobData         - { title, company }
 * @param {number}   matchScore
 * @param {string[]} unmatchedSkills - Skills that were missing
 */
async function sendRejectionEmail(candidateEmail, candidateName, jobData, matchScore, unmatchedSkills) {
  const jobsLink = `${FRONTEND_URL}/dashboard`;

  const missingBadges = unmatchedSkills.map(s => `<span class="badge badge-red">${s}</span>`).join('');

  const body = `
    <div class="card">
      <div class="icon-circle icon-blue" style="display:block;text-align:center;width:72px;height:72px;line-height:72px;margin:0 auto 20px;">💼</div>
      <h1 style="text-align:center;">Thank You, ${candidateName.split(' ')[0]}</h1>
      <p style="text-align:center;">Thank you for applying to <strong style="color:#fff;">${jobData.title}</strong> at <strong style="color:#a3e635;">${jobData.company}</strong>.</p>

      <div class="score-box">
        <div class="score-label">AI Skill Match Score</div>
        <div class="score-value" style="color:#f87171;">${matchScore}%</div>
        <p style="font-size:12px;color:#52525b;margin-top:8px;">A minimum of 50% is required to advance.</p>
        <div class="score-bar"><div class="score-fill" style="width:${matchScore}%;background:linear-gradient(90deg,#f87171,#fb923c);"></div></div>
      </div>

      ${unmatchedSkills.length > 0 ? `
        <h2>Skills to Strengthen</h2>
        <div class="skill-list">${missingBadges}</div>
        <p style="margin-top:12px;font-size:13px;">Building these skills will significantly improve your match rate for similar roles.</p>
      ` : ''}

      <p style="margin-top:20px;text-align:center;font-size:13px;">
        We encourage you to keep upskilling and apply again when you're ready. You may also explore other open positions that better match your current skill set.
      </p>
      <a href="${jobsLink}" class="cta-btn">View Other Opportunities →</a>
    </div>`;

  await getTransporter().sendMail({
    from: `"HireVision" <${process.env.EMAIL_USER}>`,
    to: candidateEmail,
    subject: `Your Application Update — ${jobData.title} at ${jobData.company}`,
    html: wrapHTML(body),
  });

  console.log(`[EMAIL] Rejection email sent to ${candidateEmail}`);
}

// ─── 3. Interview Confirmation Email ─────────────────────────────────────────
/**
 * Sends an interview confirmation email to the candidate.
 * @param {string} candidateEmail
 * @param {string} candidateName
 * @param {object} interviewData - { jobTitle, company, scheduledDateTime, endDateTime, interviewMode, interviewLink, interviewerName }
 */
async function sendInterviewConfirmation(candidateEmail, candidateName, interviewData) {
  const {
    jobTitle, company,
    scheduledDateTime, endDateTime,
    interviewMode, interviewLink, interviewerName,
  } = interviewData;

  const startStr = new Date(scheduledDateTime).toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
  const endStr = new Date(endDateTime).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });

  const modeIcon = interviewMode === 'Video' ? '🎥' : interviewMode === 'Phone' ? '📞' : '🏢';

  const body = `
    <div class="card">
      <div class="icon-circle icon-blue" style="display:block;text-align:center;width:72px;height:72px;line-height:72px;margin:0 auto 20px;">📅</div>
      <h1 style="text-align:center;">Interview Confirmed!</h1>
      <p style="text-align:center;">Your interview for <strong style="color:#fff;">${jobTitle}</strong> at <strong style="color:#a3e635;">${company}</strong> has been scheduled.</p>

      <div class="score-box">
        <table>
          <tr><td class="label-cell">Date & Time</td><td class="value-cell">${startStr} – ${endStr}</td></tr>
          <tr><td class="label-cell">Mode</td><td class="value-cell">${modeIcon} ${interviewMode}</td></tr>
          ${interviewerName ? `<tr><td class="label-cell">Interviewer</td><td class="value-cell">${interviewerName}</td></tr>` : ''}
          ${interviewMode === 'Video' && interviewLink ? `<tr><td class="label-cell">Meeting Link</td><td class="value-cell"><a href="${interviewLink}" style="color:#a3e635;">${interviewLink}</a></td></tr>` : ''}
        </table>
      </div>

      <h2 style="margin-top:20px;">Next Steps</h2>
      <p>1. Add this interview to your calendar.</p>
      <p>2. Test your camera and microphone beforehand (if video).</p>
      <p>3. Research ${company} and the role requirements.</p>
      <p>4. Prepare questions for your interviewer.</p>

      ${interviewMode === 'Video' && interviewLink ? `<a href="${interviewLink}" class="cta-btn">Join Meeting →</a>` : ''}
    </div>`;

  await getTransporter().sendMail({
    from: `"HireVision" <${process.env.EMAIL_USER}>`,
    to: candidateEmail,
    subject: `📅 Interview Confirmed — ${jobTitle} at ${company} on ${new Date(scheduledDateTime).toLocaleDateString()}`,
    html: wrapHTML(body),
  });

  console.log(`[EMAIL] Interview confirmation sent to ${candidateEmail}`);
}

module.exports = { sendSelectionEmail, sendRejectionEmail, sendInterviewConfirmation };
