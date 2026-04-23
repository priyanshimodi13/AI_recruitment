require('dotenv').config({ path: 'config.env' });
const AIService = require('./src/services/aiService');

async function testExtractSkills() {
    const resumeText = "Experienced software engineer with strong knowledge in Python, JavaScript, React.js, and Node.js. Used MongoDB and PostgreSQL databases extensively. Docker and AWS for deployment.";
    
    console.log("Calling extractSkills...");
    try {
        const result = await AIService.extractSkills(resumeText);
        console.log("Extracted Skills:", result);
    } catch (e) {
        console.error("Error extracting skills:", e);
    }
}

testExtractSkills();
