/**
 * interviewRoutes.js
 * Handles auto-generated interview slot listing and scheduling.
 */

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/auth');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const InterviewSchedule = require('../models/InterviewSchedule');
const { sendInterviewConfirmation } = require('../services/emailService');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generates available interview slots for the next N working days.
 * Slots are Monday–Friday, 9am–4pm, in 1-hour blocks (IST by default).
 * @param {number} daysAhead  - How many working days to generate
 * @param {number} slotLengthMinutes
 */
function generateAvailableSlots(daysAhead = 7, slotLengthMinutes = 60) {
  const slots = [];
  const now = new Date();
  let dayCount = 0;

  while (slots.length === 0 || dayCount < daysAhead) {
    const candidate = new Date(now);
    candidate.setDate(now.getDate() + dayCount + 1); // start from tomorrow
    dayCount++;

    const dow = candidate.getDay(); // 0 = Sun, 6 = Sat
    if (dow === 0 || dow === 6) continue; // skip weekends

    // Generate hourly slots 9am–4pm
    for (let hour = 9; hour <= 16; hour++) {
      const start = new Date(candidate);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + slotLengthMinutes);

      const slotId = `${start.toISOString()}_${end.toISOString()}`;
      slots.push({
        slotId,
        startDateTime: start.toISOString(),
        endDateTime:   end.toISOString(),
        displayDate: start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        displayTime: start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      });
    }
  }

  return slots;
}

/**
 * Generates a fake Google Meet–style link for video interviews.
 */
function generateMeetLink() {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const segment = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `https://meet.hirevision.ai/${segment(3)}-${segment(4)}-${segment(3)}`;
}

// ─── GET /api/interviews/slots/:jobId ─────────────────────────────────────────
/**
 * Returns auto-generated available interview slots for a given job.
 * Does NOT yet filter out already-booked slots (simple for now).
 */
router.get('/slots/:jobId', requireAuth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const slots = generateAvailableSlots(7); // 7 working days

    res.status(200).json({ success: true, jobId, availableSlots: slots });
  } catch (err) {
    console.error('Error generating slots:', err);
    res.status(500).json({ error: 'Failed to generate slots' });
  }
});

// ─── POST /api/interviews/schedule ────────────────────────────────────────────
/**
 * Schedules an interview for a selected candidate.
 * Body: { submissionId, slotId, interviewMode }
 */
router.post('/schedule', requireAuth, async (req, res) => {
  try {
    const { submissionId, slotId, interviewMode = 'Video' } = req.body;

    if (!submissionId || !slotId) {
      return res.status(400).json({ error: 'submissionId and slotId are required.' });
    }

    // Parse slot datetimes from slotId (format: startISO_endISO)
    const [startISO, endISO] = slotId.split('_');
    if (!startISO || !endISO) {
      return res.status(400).json({ error: 'Invalid slotId format.' });
    }

    const scheduledDateTime = new Date(startISO);
    const endDateTime       = new Date(endISO);

    if (isNaN(scheduledDateTime.getTime())) {
      return res.status(400).json({ error: 'Invalid slot datetime.' });
    }

    // Fetch application
    const application = await Application.findById(submissionId).populate('jobId').populate('userId');
    if (!application) return res.status(404).json({ error: 'Application not found.' });

    const job = application.jobId;
    const candidateUser = application.userId;

    // Get Clerk user info for candidate email/name
    const dbUser = await User.findById(candidateUser._id || candidateUser);
    if (!dbUser) return res.status(404).json({ error: 'Candidate not found.' });

    // Generate meet link for video
    const interviewLink = (interviewMode === 'Video') ? generateMeetLink() : null;

    // Create InterviewSchedule document
    const interview = await InterviewSchedule.create({
      submissionId: application._id,
      jobId:        job._id,
      candidateId:  dbUser._id,
      scheduledDateTime,
      endDateTime,
      interviewMode,
      interviewLink,
      interviewerName: 'HireVision Recruiter',
      roundNumber: 1,
      status: 'Scheduled',
    });

    // Update application status
    application.status                = 'SCHEDULED';
    application.scheduledInterviewDate = scheduledDateTime;
    application.interviewLink          = interviewLink;
    application.interviewMode          = interviewMode;
    await application.save();

    // Send confirmation email (non-blocking)
    const interviewData = {
      jobTitle:          job.title,
      company:           job.company,
      scheduledDateTime,
      endDateTime,
      interviewMode,
      interviewLink,
      interviewerName:   'HireVision Recruiter',
    };

    sendInterviewConfirmation(
      dbUser.email,
      dbUser.name || 'Candidate',
      interviewData
    ).catch(err => console.error('[EMAIL] Confirmation email failed:', err));

    res.status(201).json({
      success: true,
      interviewId:     interview._id,
      scheduledDateTime: scheduledDateTime.toISOString(),
      endDateTime:     endDateTime.toISOString(),
      interviewMode,
      interviewLink,
      confirmationMessage: `Your interview for ${job.title} at ${job.company} has been scheduled. A confirmation has been sent to ${dbUser.email}.`,
    });

  } catch (err) {
    console.error('Error scheduling interview:', err);
    res.status(500).json({ error: err.message || 'Failed to schedule interview.' });
  }
});

// ─── GET /api/interviews/my-interviews ───────────────────────────────────────
/**
 * Returns all scheduled interviews for the authenticated user.
 */
router.get('/my-interviews', requireAuth, async (req, res) => {
  try {
    const dbUser = await User.findOne({ clerkId: req.auth.userId });
    if (!dbUser) return res.status(404).json({ error: 'User not found' });

    const interviews = await InterviewSchedule.find({ candidateId: dbUser._id })
      .populate('jobId', 'title company location')
      .sort({ scheduledDateTime: 1 });

    res.status(200).json({ success: true, interviews });
  } catch (err) {
    console.error('Error fetching interviews:', err);
    res.status(500).json({ error: 'Failed to fetch interviews.' });
  }
});

module.exports = router;
