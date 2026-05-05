const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const Application = require('./src/models/Application');
const Job = require('./src/models/Job');
const User = require('./src/models/User');

async function checkApplications() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');
        const apps = await Application.find()
            .populate('userId', 'firstName lastName email')
            .populate('jobId', 'title company');
        console.log(`Found ${apps.length} applications`);
        apps.forEach(a => {
            console.log(`- ${a.userId?.firstName || 'Unknown'} applied for ${a.jobId?.title || 'Unknown Job'} at ${a.jobId?.company || 'Unknown Company'} (Status: ${a.status})`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkApplications();
