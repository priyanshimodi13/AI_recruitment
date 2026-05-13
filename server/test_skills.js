const AIService = require('C:/Users/DELL/Desktop/AI-reqruitment/server/src/services/aiService');

const sampleText = "I am a Full Stack Developer with experience in Java, C++, C Language, PHP, and Laravel.";

async function test() {
    console.log('Testing skill extraction...');
    const skills = await AIService.extractSkillsDeterministic(sampleText);
    console.log('Extracted Skills:', skills);
    process.exit(0);
}

test();
