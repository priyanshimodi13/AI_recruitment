const mongoose = require('mongoose');
const Resume = require('C:/Users/DELL/Desktop/AI-reqruitment/server/src/models/Resume');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
require('dotenv').config({ path: 'C:/Users/DELL/Desktop/AI-reqruitment/server/config.env' });

async function debug() {
    try {
        await mongoose.connect(process.env.DATABASE);
        const resume = await Resume.findOne().sort({ uploadedAt: -1 });
        if (!resume) {
            console.log('No resume found');
            process.exit(0);
        }
        console.log('Reading Resume:', resume.fileName);
        const filePath = path.join('C:/Users/DELL/Desktop/AI-reqruitment/server', resume.filePath);
        console.log('Full Path:', filePath);
        
        if (fs.existsSync(filePath)) {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            console.log('--- RESUME TEXT START ---');
            console.log(data.text);
            console.log('--- RESUME TEXT END ---');
            
            const AIService = require('C:/Users/DELL/Desktop/AI-reqruitment/server/src/services/aiService');
            const skills = await AIService.extractSkillsDeterministic(data.text);
            console.log('Extracted Skills:', skills);
        } else {
            console.log('File does not exist at:', filePath);
        }
    } catch (err) {
        console.error('Debug Error:', err);
    }
    process.exit(0);
}

debug();
