async function testMatchJobs() {
    const aiService = require('./src/services/aiService');
    const resumeText = "Frontend Developer. I know JavaScript, React, HTML, CSS.";
    const jobMatrix = [
        { job_title: "UI/UX", requirements: ["Canva", "Figma"] },
        { job_title: "Frontend Developer", requirements: ["JavaScript", "React"] }
    ];
    
    console.log("Calling findMatchingJobs...");
    const result = await aiService.findMatchingJobs(resumeText, jobMatrix);
    console.log("Result:", JSON.stringify(result, null, 2));
}

testMatchJobs();
