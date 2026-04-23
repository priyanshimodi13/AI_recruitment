const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const AIService = require('./src/services/aiService');

async function testSkillExtraction() {
    const resumePath = path.join(__dirname, 'uploads', '1776756469609-Priyanshi_Modi_CV.pdf');
    
    if (!fs.existsSync(resumePath)) {
        console.error('Resume file not found');
        return;
    }

    console.log('Parsing PDF...');
    const dataBuffer = fs.readFileSync(resumePath);
    const pdfData = await pdfParse(dataBuffer);
    
    console.log(`PDF text length: ${pdfData.text.length} chars\n`);
    console.log('Extracting skills...');
    
    const skills = await AIService.extractSkills(pdfData.text);
    
    console.log(`\n✅ Total skills found: ${skills.length}`);
    console.log('Skills:', skills.join(', '));
}

testSkillExtraction().catch(console.error);
