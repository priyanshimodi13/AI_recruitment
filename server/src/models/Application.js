const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Job',  required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeUrl:  { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected', 'Round 1 Selected', 'SELECTED', 'REJECTED', 'SCHEDULED', 'INTERVIEWED'],
        default: 'Pending',
        index: true,
    },
    coverLetter:     { type: String },
    aiScore:         { type: Number, default: 0 },
    aiFeedback:      { type: String, default: 'Analysis pending...' },
    extractedSkills: [{ type: String }],
    matchPercentage: { type: Number, default: 0 },
    missingSkills:   [{ type: String }],
    matchedSkills:   [{ type: String }],
    advantageSkills: [{ type: String }],
    // Interview scheduling
    scheduledInterviewDate: { type: Date, default: null },
    interviewLink:          { type: String, default: null },
    interviewMode:          { type: String, enum: ['Video', 'Phone', 'InPerson', null], default: null },
    // Email tracking
    emailSentAt: { type: Date, default: null },
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;

