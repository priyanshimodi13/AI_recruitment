const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const Resume = require('../models/Resume');
const sendEmail = require('../utils/sendEmail');
const buildAcceptanceEmail = require('../utils/emailTemplates');

// POST /api/resumes — Upload resume & save metadata
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    const { name, email, phone, position } = req.body;

    if (!name || !email || !phone || !position) {
      return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    const resume = await Resume.create({
      name,
      email,
      phone,
      position,
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      status: 'success',
      message: 'Resume uploaded successfully',
      data: resume,
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
