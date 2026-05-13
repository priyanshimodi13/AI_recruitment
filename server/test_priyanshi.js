const mongoose = require('mongoose');
const Resume = require('C:/Users/DELL/Desktop/AI-reqruitment/server/src/models/Resume');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
require('dotenv').config({ path: 'C:/Users/DELL/Desktop/AI-reqruitment/server/config.env' });

async function debug() {
    await mongoose.connect(process.env.DATABASE);
    const resume = await Resume.findOne({ fileName: /Priyanshi/ }).sort({ uploadedAt: -1 });
    if (!resume) {
        console.log('Priyanshi resume not found');
        process.exit(0);
    }
    const filePath = path.join('C:/Users/DELL/Desktop/AI-reqruitment/server', resume.filePath);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    console.log('--- TEXT ---');
    console.log(data.text);
    console.log('--- END ---');
    
    const AIService = require('C:/Users/DELL/Desktop/AI-reqruitment/server/src/services/aiService');
    const skills = await AIService.extractSkillsDeterministic(data.text);
    console.log('Extracted Skills:', skills);
    process.exit(0);
}

debug();
