const express = require('express');
const { requireAuth, requireAdmin, requireEmployerOrAdmin } = require('../middlewares/auth');
const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');
const AIService = require('../services/aiService');
const { matchSkills } = require('../utils/skillMatcher');
const { sendSelectionEmail, sendRejectionEmail } = require('../services/emailService');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { createNotification } = require('../utils/notificationHelper');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// @route   POST /api/applications/extract-skills
// @desc    Extract skills from provided resume text via AI
router.post('/extract-skills', requireAuth, async (req, res) => {
    try {
        const { resumeText } = req.body;
        
        if (!resumeText) {
            return res.status(400).json({ error: 'resumeText is required' });
        }

        const skills = await AIService.extractSkills(resumeText);
        
        res.json({
            message: 'Skills extracted successfully',
            skills
        });
    } catch (error) {
        console.error('Error extracting skills:', error);
        res.status(500).json({ error: 'Failed to extract skills via AI.' });
    }
});

// @route   POST /api/applications/match-jobs
// @desc    Match a resume against a given job matrix and return the best matches
router.post('/match-jobs', requireAuth, upload.single('resume'), async (req, res) => {
    try {
        let { jobMatrix } = req.body;
        
        let resumeText = "";
        
        // Use real PDF parsing if a file is provided!
        if (req.file) {
            try {
                if (req.file.originalname.toLowerCase().endsWith('.pdf') || req.file.mimetype.includes('pdf')) {
                    console.log("PDF File detected:", req.file.originalname, "Saved to:", req.file.path);
                    const pdfData = await pdfParse(require('fs').readFileSync(req.file.path));
                    resumeText = pdfData.text;
                    console.log("Successfully extracted text from PDF of length:", resumeText.length);
                    console.log("--- START EXTRACTED TEXT ---");
                    console.log(resumeText.substring(0, 200) + "...");
                    console.log("--- END EXTRACTED TEXT ---");
                } else {
                    console.log("Not a PDF file (mimetype: " + req.file.mimetype + ", name: " + req.file.originalname + "). Cannot parse.");
                }
            } catch (pdfErr) {
                console.error("PDF Parsing error:", pdfErr);
            }
        } else if (req.body.resumeText) {
            resumeText = req.body.resumeText;
        }

        // Deep Fallback: If OCR completely fails, or it was a DOCX/Image, or empty text was found,
        // we use the dynamic filename mock so the frontend never crashes.
        if (!resumeText || resumeText.trim().length < 10) {
            console.log("Resume text empty or invalid. PDF parsing likely failed.");
            resumeText = "NO_CONTENT_EXTRACTED";
        }

        if (!jobMatrix) {
            return res.status(400).json({ error: 'jobMatrix is required' });
        }

        // Parse jobMatrix if it comes as a string from FormData
        try {
            if (typeof jobMatrix === 'string') {
                jobMatrix = JSON.parse(jobMatrix);
            }
        } catch(e) {
            console.error("Failed to parse jobMatrix JSON from FormData");
        }

        const result = await AIService.findMatchingJobs(resumeText, jobMatrix);
        console.log("--- AI Matching Result ---");
        console.log("Extracted Skills count:", result.extracted_skills?.length);
        console.log("Matched Jobs count:", result.matched_jobs?.length);
        console.log("--------------------------");

        res.json({
            message: 'Jobs matched successfully',
            data: result,
            fileUrl: req.file ? `http://localhost:5957/uploads/${req.file.filename}` : null
        });
    } catch (error) {
        console.error('Error matching jobs:', error);
        res.status(500).json({ error: 'Failed to match jobs via AI.' });
    }
});

// @route   GET /api/applications/my-applications
// @desc    Get all applications for the logged-in candidate
router.get('/my-applications', requireAuth, async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.auth.userId });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const applications = await Application.find({ userId: user._id })
            .populate('jobId', 'title company description requirements')
            .sort({ createdAt: -1 });
        
        res.json(applications);
    } catch (error) {
        console.error('Error fetching my applications:', error);
        res.status(500).json({ error: 'Server error while fetching applications' });
    }
});

// @route   POST /api/applications/:id/analyze
// @desc    Trigger AI analysis for a specific application (admin only)
router.post('/:id/analyze', requireAdmin, async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('jobId');
        if (!application) return res.status(404).json({ error: 'Application not found' });

        const jobDescription = `${application.jobId.title} at ${application.jobId.company}. \nRequirements: ${application.jobId.requirements.join(', ')}. \nDescription: ${application.jobId.description}`;
        
        // For now, we analyze using the cover letter or a placeholder for resume text
        // In a real scenario, we'd parse the PDF/Docx from application.resumeUrl
        const analysisText = application.coverLetter || "Candidate applied via platform. Resume available at: " + application.resumeUrl;

        // Perform match scoring and skill extraction
        const { score, feedback } = await AIService.analyzeResumeMatch(analysisText, jobDescription);
        const { extractedSkills, matchPercentage, missingSkills } = await AIService.analyzeSkillsMatch(analysisText, application.jobId.requirements);

        application.aiScore = score;
        application.aiFeedback = feedback;
        application.extractedSkills = extractedSkills;
        application.matchPercentage = matchPercentage;
        application.missingSkills = missingSkills;
        application.status = 'Reviewed'; 
        
        await application.save();

        res.json({
            message: 'Deep AI Analysis complete',
            score,
            matchPercentage,
            extractedSkills,
            missingSkills,
            feedback
        });

    } catch (error) {
        console.error('Error during AI analysis:', error);
        res.status(500).json({ error: 'AI analysis failed. Ensure Ollama is running.' });
    }
});

// @route   POST /api/applications
// @desc    Submit a job application (authenticated users)
router.post('/', requireAuth, async (req, res) => {
    try {
        const { jobId, resumeUrl, coverLetter, extractedSkills } = req.body;

        const user = await User.findOne({ clerkId: req.auth.userId });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check if already applied
        let application = await Application.findOne({ jobId, userId: user._id });

        if (!application) {
            application = new Application({
                jobId,
                userId: user._id,
                resumeUrl,
                coverLetter,
                aiFeedback: 'Analysis pending...',
                extractedSkills: (Array.isArray(extractedSkills) && extractedSkills.length > 0) ? extractedSkills : [],
            });
        } else {
            application.resumeUrl = resumeUrl;
            application.coverLetter = coverLetter || application.coverLetter;
            // ONLY overwrite if we actually have NEW skills, otherwise KEEP the old ones
            if (Array.isArray(extractedSkills) && extractedSkills.length > 0) {
                application.extractedSkills = extractedSkills;
            }
        }

        // ── AUTOMATED AI ANALYSIS ────────────────────────────────────────────────
        const job = await Job.findById(jobId).populate('postedBy');
        if (job && job.requirements && job.requirements.length > 0) {
            // ── SKILL SOURCE RESOLUTION ──────────────────────────────────────────────
            // We try to get skills from 3 sources in order of reliability:
            // 1. Incoming extractedSkills from frontend
            // 2. Already stored skills in this application (if re-applying)
            // 3. Latest resume record for this user
            let candidateSkills = [];
            const Resume = require('../models/Resume');
            
            if (Array.isArray(extractedSkills) && extractedSkills.length > 0) {
                candidateSkills = extractedSkills;
            } else if (application.extractedSkills && application.extractedSkills.length > 0) {
                candidateSkills = application.extractedSkills;
            } else {
                try {
                    const latestResume = await Resume.findOne({ userId: user._id }).sort({ uploadedAt: -1 });
                    if (latestResume && Array.isArray(latestResume.skills) && latestResume.skills.length > 0) {
                        candidateSkills = latestResume.skills;
                        console.log('--- Using Skills from Latest Resume Record ---');
                    }
                } catch (resumeErr) {
                    console.warn('Error fetching latest resume skills:', resumeErr.message);
                }
            }

            // 3. Deep Analysis Recovery: If skills are missing, find the LATEST resume file and parse it directly
            if (candidateSkills.length === 0) {
                try {
                    const path = require('path');
                    const fs = require('fs');
                    const pdfParse = require('pdf-parse');
                    
                    // Find the latest resume record to get the REAL file path
                    const latestResume = await Resume.findOne({ userId: user._id }).sort({ uploadedAt: -1 });
                    
                    if (latestResume && latestResume.filePath) {
                        const fileName = latestResume.filePath.split('/').pop();
                        const filePath = path.join(__dirname, '../../uploads', fileName);
                        
                        if (fs.existsSync(filePath)) {
                            console.log('--- RECOVERY: Parsing File Directly:', fileName, '---');
                            const dataBuffer = fs.readFileSync(filePath);
                            const pdfData = await pdfParse(dataBuffer);
                            const resumeText = pdfData.text;
                            
                            if (resumeText && resumeText.length > 50) {
                                candidateSkills = await AIService.extractSkills(resumeText);
                                console.log('--- RECOVERY SUCCESS: Extracted', candidateSkills.length, 'skills ---');
                            }
                        }
                    }
                } catch (recoveryErr) {
                    console.warn('Aggressive recovery failed:', recoveryErr.message);
                }
            }

            // 4. Final fallback: AI extraction from cover letter (if still no skills)
            if (candidateSkills.length === 0) {
                try {
                    const analysisText = coverLetter || 'Resume uploaded.';
                    const { extractedSkills: aiExtracted } = await AIService.analyzeSkillsMatch(analysisText, job.requirements);
                    candidateSkills = aiExtracted || [];
                } catch (aiErr) {
                    console.warn('AI extraction fallback failed:', aiErr.message);
                }
            }

            // 3. Synonym-aware skill matching via skillMatcher utility
            console.log('--- Matching Logic Input ---');
            console.log('Candidate Skills:', candidateSkills);
            console.log('Job Requirements:', job.requirements);
            
            let { matchedSkills, unmatchedSkills, advantageSkills, matchScore, status } =
                matchSkills(candidateSkills, job.requirements);
            
            // 5. CRITICAL RECOVERY: If match is 0, but requirements exist, try direct substring matching on resume text
            if (matchScore === 0 && job.requirements.length > 0) {
                console.log('--- RECOVERY: 0% match detected, attempting exact keyword scan ---');
                const recoveredMatched = [];
                // Re-run matching on candidateSkills with simpler logic if normalized matching failed
                job.requirements.forEach(req => {
                    const reqLower = req.toLowerCase().replace(/\s+language$/i, '').trim();
                    const hasMatch = candidateSkills.some(skill => {
                        const skillLower = skill.toLowerCase().replace(/\s+language$/i, '').trim();
                        return skillLower === reqLower || skillLower.includes(reqLower) || reqLower.includes(skillLower);
                    });
                    if (hasMatch) recoveredMatched.push(req);
                });

                if (recoveredMatched.length > 0) {
                    matchedSkills = [...new Set(recoveredMatched)];
                    unmatchedSkills = job.requirements.filter(r => !matchedSkills.includes(r));
                    matchScore = Math.round((matchedSkills.length / job.requirements.length) * 100);
                    if (matchScore >= 50) status = 'SELECTED';
                    console.log('--- RECOVERY SUCCESS: New Score:', matchScore, '% ---');
                }
            }

            console.log('Match Score:', matchScore, '%');
            console.log('Matched:', matchedSkills);
            console.log('Missing:', unmatchedSkills);
            console.log('---------------------------');

            // 4. Get AI text feedback
            let aiFeedbackText = '';
            try {
                const analysisText = candidateSkills.length > 0
                    ? `Candidate Skills: ${candidateSkills.join(', ')}`
                    : coverLetter || 'Resume uploaded.';
                const jobDescription = `${job.title} at ${job.company}. Requirements: ${job.requirements.join(', ')}`;
                const { score, feedback } = await AIService.analyzeResumeMatch(analysisText, jobDescription);
                application.aiScore = score;
                aiFeedbackText = feedback;
            } catch (aiErr) {
                console.warn('AI feedback failed (silent):', aiErr.message);
            }

            // 5. Persist results
            application.extractedSkills = candidateSkills;
            application.matchedSkills   = matchedSkills;
            application.missingSkills   = unmatchedSkills;
            application.advantageSkills = advantageSkills;
            application.matchPercentage = matchScore;

            if (status === 'SELECTED') {
                application.status     = 'Round 1 Selected';
                application.aiFeedback = `✨ CONGRATULATIONS! Your skills match ${matchScore}% of our requirements. You have been automatically selected for Round 1!\n\n${aiFeedbackText}`;
            } else {
                application.status     = 'Reviewed';
                application.aiFeedback = aiFeedbackText || `Your skills match ${matchScore}% of the requirements. Keep building your skills!`;
            }

            await application.save();

            // 6. Send email non-blocking
            const candidateEmail = user.email;
            const candidateName  = user.name || user.firstName || 'Candidate';
            const jobData = { title: job.title, company: job.company };

            if (status === 'SELECTED') {
                sendSelectionEmail(candidateEmail, candidateName, jobData, matchScore, matchedSkills, unmatchedSkills, application._id.toString())
                    .then(() => { application.emailSentAt = new Date(); application.save(); })
                    .catch(err => console.error('[EMAIL] Selection email failed:', err.message));
            } else {
                sendRejectionEmail(candidateEmail, candidateName, jobData, matchScore, unmatchedSkills)
                    .catch(err => console.error('[EMAIL] Rejection email failed:', err.message));
            }

            // 7. Notify Employer
            if (job.postedBy) {
                createNotification({
                    recipient: job.postedBy._id,
                    sender: user._id,
                    type: 'application_received',
                    title: 'New Application Received',
                    message: `${user.firstName || 'A candidate'} has applied for your position: ${job.title}`,
                    relatedId: application._id,
                    relatedModel: 'Application'
                });
            }

        } else {
            // No job or no requirements – just save
            await application.save();
        }

        // Return the full result object so the frontend can show selection screen
        res.status(201).json({
            ...application.toObject(),
            status:          application.status,
            matchPercentage: application.matchPercentage,
            matchedSkills:   application.matchedSkills,
            missingSkills:   application.missingSkills,
            advantageSkills: application.advantageSkills,
            aiFeedback:      application.aiFeedback,
        });

    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ error: 'Server error while submitting application' });
    }
});

// @route   GET /api/applications
// @desc    Get all applications across all jobs (admin only)
router.get('/', requireAdmin, async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('jobId', 'title company')
            .populate('userId', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'Server error while fetching applications' });
    }
});

// @route   GET /api/applications/employer
// @desc    Get all applications for jobs posted by the logged-in employer
router.get('/employer', requireEmployerOrAdmin, async (req, res) => {
    try {
        const user = req.dbUser;
        // Find jobs posted by this employer or admin
        const jobs = await Job.find({ postedBy: user._id }).select('_id title company');
        const jobIds = jobs.map(j => j._id);
        
        console.log(`[Employer Fetch] User: ${user.firstName || user.email} (${user._id}), Jobs found: ${jobIds.length}`);

        // Find applications for these jobs
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('userId', 'firstName lastName email profileImageUrl')
            .populate('jobId', 'title company')
            .sort({ createdAt: -1 });
        
        console.log(`[Employer Fetch] Applications found: ${applications.length} for Job IDs: ${jobIds}`);

        res.json(applications);
    } catch (error) {
        console.error('Error fetching employer applications:', error);
        res.status(500).json({ error: 'Server error while fetching applications' });
    }
});

// @route   GET /api/applications/:jobId
// @desc    Get applications for a specific job (admin only)
router.get('/:jobId', requireAdmin, async (req, res) => {
    try {
        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('userId', 'firstName lastName email profileImageUrl')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications for job:', error);
        res.status(500).json({ error: 'Server error while fetching applications' });
    }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (admin only)
router.put('/:id/status', requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Accepted', 'Rejected', 'Reviewed', 'Pending', 'Round 1 Selected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!application) return res.status(404).json({ error: 'Application not found' });

        // Notify Candidate of status update
        const job = await Job.findById(application.jobId);
        createNotification({
            recipient: application.userId,
            type: 'application_status_update',
            title: 'Application Status Updated',
            message: `Your application for ${job?.title || 'a position'} has been updated to: ${status}`,
            relatedId: application._id,
            relatedModel: 'Application'
        });

        res.json({
            message: `Application status updated to ${status}`,
            application
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ error: 'Failed to update application status' });
    }
});

module.exports = router;
