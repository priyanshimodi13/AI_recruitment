const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const Job = require('./src/models/Job');

async function checkJobs() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');
        const jobs = await Job.find();
        console.log(`Found ${jobs.length} jobs`);
        jobs.forEach(j => console.log(`- ${j.title} at ${j.company} (Active: ${j.isActive}, PostedBy: ${j.postedBy})`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkJobs();
