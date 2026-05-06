require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

async function clearDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE);
    console.log('Connected successfully.');

    // List of collections to clear
    const User = require('./src/models/User');
    const Job = require('./src/models/Job');
    const Application = require('./src/models/Application');
    const Interview = require('./src/models/InterviewSchedule');

    console.log('Wiping collections...');
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Interview.deleteMany({});

    console.log('Successfully cleared all data. You have a fresh start!');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing database:', err);
    process.exit(1);
  }
}

clearDatabase();
