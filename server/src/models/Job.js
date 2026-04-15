const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    companyWebsite: { type: String },
    location: { type: String, required: true },
    type: { type: String, required: true }, // e.g., Full-time, Part-time, Contract
    experienceLevel: { type: String, required: true }, // e.g., Entry Level, Mid Level, Senior
    description: { type: String, required: true },
    requirements: [{ type: String }],
    salaryRange: { type: String },
    isActive: { type: Boolean, default: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
