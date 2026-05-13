const mongoose = require('mongoose');
const Application = require('C:/Users/DELL/Desktop/AI-reqruitment/server/src/models/Application');
const Job = require('C:/Users/DELL/Desktop/AI-reqruitment/server/src/models/Job');

require('dotenv').config({ path: './config.env' });
async function debug() {
    await mongoose.connect(process.env.DATABASE);
    
    const apps = await Application.find().sort({ createdAt: -1 }).limit(3).populate('jobId');
    
    console.log('--- LATEST APPLICATIONS ---');
    apps.forEach(app => {
        console.log(`Job: ${app.jobId?.title}`);
        console.log(`Resume URL: ${app.resumeUrl}`);
        console.log(`Status: ${app.status}`);
        console.log(`Match %: ${app.matchPercentage}`);
        console.log(`Extracted Skills: ${JSON.stringify(app.extractedSkills)}`);
        console.log(`Matched Skills: ${JSON.stringify(app.matchedSkills)}`);
        console.log(`Missing Skills: ${JSON.stringify(app.missingSkills)}`);
        console.log('---------------------------');
    });
    
    process.exit(0);
}

debug();
