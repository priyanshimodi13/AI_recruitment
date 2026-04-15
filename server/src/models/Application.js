const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], default: 'Pending' },
    coverLetter: { type: String },
    aiScore: { type: Number, default: 0 },
    aiFeedback: { type: String, default: 'Analysis pending...' },
    extractedSkills: [{ type: String }],
    matchPercentage: { type: Number, default: 0 },
    missingSkills: [{ type: String }]
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
