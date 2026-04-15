require('dotenv').config({ path: './config.env' });
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Webhook Handler
const clerkWebhook = require('./webhooks/user.webhooks');

// Routes
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AI Recruitment API is running'
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/resumes', resumeRoutes);

// Clerk Webhooks require raw body for verification
app.post('/api/webhooks/clerk', express.raw({ type: 'application/json' }), clerkWebhook);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.DEVELOPMENT_PORT || 5957;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
