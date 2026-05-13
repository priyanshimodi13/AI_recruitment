const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const Resume = require('../models/Resume');
const sendEmail = require('../utils/sendEmail');
const buildAcceptanceEmail = require('../utils/emailTemplates');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const AIService = require('../services/aiService');
const Job = require('../models/Job');
const User = require('../models/User');
const { requireAuth } = require('../middlewares/auth');
const { createNotification } = require('../utils/notificationHelper');

// POST /api/resumes — Upload resume & save metadata
router.post('/', requireAuth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const { name, email, phone, position } = req.body;

    if (!name || !email || !phone || !position) {
      return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    let resumeText = '';
    let debugInfo = {};
    let extractedSkills = [];
    try {
      const isPDF = req.file.originalname.toLowerCase().endsWith('.pdf') || req.file.mimetype.includes('pdf');
      const isDocx = req.file.originalname.toLowerCase().endsWith('.docx') || req.file.mimetype.includes('officedocument');

      if (isPDF) {
        const pdfData = await pdfParse(fs.readFileSync(req.file.path));
        resumeText = pdfData.text;
        debugInfo.fileType = 'PDF';
      } else if (isDocx) {
        const result = await mammoth.extractRawText({ path: req.file.path });
        resumeText = result.value;
        debugInfo.fileType = 'DOCX';
      } else {
        debugInfo.error = 'Unsupported file format for text extraction';
      }

      if (resumeText) {
        debugInfo.textLength = resumeText.length;
        debugInfo.textPreview = resumeText.substring(0, 100);
        extractedSkills = await AIService.extractSkills(resumeText);
        debugInfo.skillsFound = extractedSkills.length;
      }
    } catch (parseError) {
      console.error('Extraction Error:', parseError);
      debugInfo.error = parseError.message;
    }

    // Link to our DB user
    let dbUser = null;
    if (req.auth && req.auth.userId) {
      dbUser = await User.findOne({ clerkId: req.auth.userId });
    }

    const resume = await Resume.create({
      userId: dbUser ? dbUser._id : null,
      name,
      email,
      phone,
      position,
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      skills: extractedSkills,
    });

    let suggestedJobs = [];
    if (extractedSkills.length > 0) {
      try {
        const allJobs = await Job.find({ isActive: true });
        const candidateSkillsLower = extractedSkills.map(s => s.toLowerCase());

        for (const job of allJobs) {
          if (!job.requirements || job.requirements.length === 0) continue;
          
          let matchCount = 0;
          let matchedSkills = [];
          
          const jobReqsLower = job.requirements.map(r => r.toLowerCase());
          
          for (const req of jobReqsLower) {
            // Check if candidate has a skill matching this requirement
            const isMatch = candidateSkillsLower.some(cs => cs.includes(req) || req.includes(cs));
            if (isMatch) {
              matchCount++;
              matchedSkills.push(req);
            }
          }

          // Suggest the job if it matches at least some skills (adjust threshold as needed, e.g., >= 3)
          if (matchCount >= 2) {
            suggestedJobs.push({
              _id: job._id,
              title: job.title,
              company: job.company,
              location: job.location,
              matchCount,
              totalRequirements: job.requirements.length,
              matchedSkills
            });
          }
        }
        
        // Sort suggestions by highest match count
        suggestedJobs.sort((a, b) => b.matchCount - a.matchCount);
      } catch (jobErr) {
        console.error('Error finding matching jobs:', jobErr);
      }
    }

    // ── NOTIFY ADMINS ────────────────────────────────────────────────────────
    try {
      const admins = await User.find({ isAdmin: true });
      for (const admin of admins) {
        createNotification({
          recipient: admin._id,
          sender: dbUser ? dbUser._id : null,
          type: 'application_received', // Using a generic type or we could add 'resume_uploaded'
          title: 'New Resume Processed',
          message: `${name} has submitted a new resume for the position: ${position}`,
          relatedId: resume._id,
          relatedModel: 'Resume'
        });
      }
    } catch (notifErr) {
      console.warn('Admin notification failed:', notifErr.message);
    }

    res.status(201).json({
      status: 'success',
      message: 'Resume uploaded successfully',
      data: resume,
      suggestedJobs,
      debug: debugInfo
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/resumes — Get all resumes (admin)
router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ uploadedAt: -1 });
    res.status(200).json({
      status: 'success',
      results: resumes.length,
      data: resumes,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PATCH /api/resumes/:id/apply — Apply to a suggested job
router.patch('/:id/apply', async (req, res) => {
  try {
    const { positionTitle } = req.body;
    
    if (!positionTitle) {
      return res.status(400).json({ status: 'error', message: 'Position title is required' });
    }

    // AI automatically schedules the 1st round exam 2 days from now at 10:00 AM
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 2); // 2 days from now
    const interviewDate = nextWeek.toISOString().split('T')[0];
    const interviewTime = "10:00 AM";
    const interviewMode = "Online";
    const meetingLink = "https://meet.google.com/ai-exam-room";

    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { 
        position: positionTitle,
        status: 'accepted',
        interviewDate: interviewDate,
        interviewTime: interviewTime,
        interviewMode: interviewMode,
        meetingLink: meetingLink
      },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ status: 'error', message: 'Resume not found' });
    }

    // AI automatically sends calendar invite and email
    try {
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5957';
      const icsLink = `${clientUrl}/api/resumes/${resume._id}/ics`;

      // Build Google Calendar pre-filled link
      const startDt = new Date(`${interviewDate}T${to24h(interviewTime)}:00`);
      const endDt = new Date(startDt.getTime() + 60 * 60 * 1000); // +1 hour
      const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      const calendarLink =
        `https://calendar.google.com/calendar/render?action=TEMPLATE` +
        `&text=${encodeURIComponent('1st Round AI Exam - ' + resume.position)}` +
        `&dates=${fmt(startDt)}/${fmt(endDt)}` +
        `&details=${encodeURIComponent(
          `Congratulations! You have been selected for the 1st Round Technical Exam for ${resume.position}` +
            (meetingLink ? `\n\nExam Link: ${meetingLink}` : '')
        )}` +
        `&location=${encodeURIComponent('Online')}`;

      const html = buildAcceptanceEmail({
        candidateName: resume.name,
        position: resume.position,
        interviewDate,
        interviewTime,
        interviewMode,
        meetingLink,
        icsLink,
        calendarLink,
      });

      await sendEmail(
        resume.email,
        `Congratulations! You're Selected for the 1st Round Exam - ${resume.position}`,
        html
      );
    } catch (emailErr) {
      console.error('Automated AI Email send failed:', emailErr.message);
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully applied to the job and exam scheduled',
      data: resume
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PATCH /api/resumes/:id/status — Update status + send email if accepted
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, interviewDate, interviewTime, interviewMode, meetingLink } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid status value' });
    }

    // Build update object
    const updateData = { status };
    if (status === 'accepted') {
      updateData.interviewDate = interviewDate;
      updateData.interviewTime = interviewTime;
      updateData.interviewMode = interviewMode;
      updateData.meetingLink = meetingLink || '';
    }

    const resume = await Resume.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!resume) {
      return res.status(404).json({ status: 'error', message: 'Resume not found' });
    }

    // Send acceptance email with interview details
    if (status === 'accepted') {
      try {
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5957';
        const icsLink = `${clientUrl}/api/resumes/${resume._id}/ics`;

        // Build Google Calendar pre-filled link
        const startDt = new Date(`${interviewDate}T${to24h(interviewTime)}:00`);
        const endDt = new Date(startDt.getTime() + 60 * 60 * 1000); // +1 hour
        const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

        const calendarLink =
          `https://calendar.google.com/calendar/render?action=TEMPLATE` +
          `&text=${encodeURIComponent('Interview - ' + resume.position)}` +
          `&dates=${fmt(startDt)}/${fmt(endDt)}` +
          `&details=${encodeURIComponent(
            `Interview for ${resume.position}` +
              (meetingLink ? `\nMeeting Link: ${meetingLink}` : '')
          )}` +
          `&location=${encodeURIComponent(interviewMode === 'Online' ? meetingLink || 'Online' : 'In-Person')}`;

        const html = buildAcceptanceEmail({
          candidateName: resume.name,
          position: resume.position,
          interviewDate,
          interviewTime,
          interviewMode,
          meetingLink,
          icsLink,
          calendarLink,
        });

        await sendEmail(
          resume.email,
          `Congratulations! Your application has been accepted – Interview Scheduled`,
          html
        );
      } catch (emailErr) {
        // Don't fail the whole request if email sending fails
        console.error('Email send failed:', emailErr.message);
      }
    }

    res.status(200).json({
      status: 'success',
      message: `Resume ${status} successfully`,
      data: resume,
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/resumes/:id/ics — Download .ics calendar file
router.get('/:id/ics', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume || resume.status !== 'accepted') {
      return res.status(404).json({ status: 'error', message: 'Interview not found' });
    }

    const startDt = new Date(
      `${resume.interviewDate.toISOString().split('T')[0]}T${to24h(resume.interviewTime)}:00`
    );
    const endDt = new Date(startDt.getTime() + 60 * 60 * 1000);

    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const now = fmt(new Date());

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//AI Recruitment//Interview//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${resume._id}@ai-recruitment`,
      `DTSTAMP:${now}`,
      `DTSTART:${fmt(startDt)}`,
      `DTEND:${fmt(endDt)}`,
      `SUMMARY:Interview - ${resume.position}`,
      `DESCRIPTION:Interview for ${resume.position}${resume.meetingLink ? '\\nMeeting: ' + resume.meetingLink : ''}`,
      `LOCATION:${resume.interviewMode === 'Online' ? resume.meetingLink || 'Online' : 'In-Person'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="interview.ics"');
    res.send(icsContent);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/resumes/my-latest — Get the current user's most recent resume
router.get('/my-latest', requireAuth, async (req, res) => {
  try {
    const dbUser = await User.findOne({ clerkId: req.auth.userId });
    if (!dbUser) {
      return res.status(404).json({ status: 'error', message: 'User not found in DB' });
    }

    const latestResume = await Resume.findOne({ userId: dbUser._id }).sort({ uploadedAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: latestResume
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Helper: convert "10:30 AM" → "10:30"
function to24h(timeStr) {
  if (!timeStr) return '10:00';
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours) + 12);
  if (modifier === 'AM' && hours === '12') hours = '00';
  return `${hours.padStart(2, '0')}:${minutes}`;
}

module.exports = router;
