const express = require('express');
const { requireAuth, requireAdmin } = require('../middlewares/auth');
const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');

const router = express.Router();

// @route   POST /api/applications
// @desc    Submit a job application (authenticated users)
router.post('/', requireAuth, async (req, res) => {
    try {
        const { jobId, resumeUrl, coverLetter } = req.body;

        const user = await User.findOne({ clerkId: req.auth.userId });
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check if already applied
        const existingApp = await Application.findOne({ jobId, userId: user._id });
        if (existingApp) {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        const newApplication = new Application({
            jobId,
            userId: user._id,
            resumeUrl,
            coverLetter
        });

        await newApplication.save();
        res.status(201).json(newApplication);

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

module.exports = router;
