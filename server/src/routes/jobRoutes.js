const express = require('express');
const { requireAuth, requireAdmin } = require('../middlewares/auth');
const Job = require('../models/Job');

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get all jobs (public/users)
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Server error while fetching jobs' });
    }
});

// @route   POST /api/jobs
// @desc    Create a new job (admin only)
router.post('/', requireAdmin, async (req, res) => {
    try {
        const { title, company, location, type, experienceLevel, description, requirements, salaryRange } = req.body;
        
        const newJob = new Job({
            title, company, location, type, experienceLevel, description, requirements, salaryRange,
            postedBy: req.dbUser._id
        });
        
        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Server error while creating job' });
    }
});

module.exports = router;
