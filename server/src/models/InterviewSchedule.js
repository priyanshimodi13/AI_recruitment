const mongoose = require('mongoose');

const interviewScheduleSchema = new mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    index: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  scheduledDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
  interviewMode: {
    type: String,
    enum: ['Video', 'Phone', 'InPerson'],
    required: true,
    default: 'Video',
  },
  interviewLink: {
    type: String, // Google Meet or similar for Video mode
    default: null,
  },
  interviewerName: {
    type: String,
    default: 'HireVision Recruiter',
  },
  roundNumber: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  feedback: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const InterviewSchedule = mongoose.model('InterviewSchedule', interviewScheduleSchema);
module.exports = InterviewSchedule;
