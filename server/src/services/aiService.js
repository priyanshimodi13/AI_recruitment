const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';

/**
 * Service to handle AI operations using Ollama
 */
class AIService {
    /**
     * Generates a match score and feedback for a resume against a job description.
     * @param {string} resumeText - The extracted text from the resume
     * @param {string} jobDescription - The job description text
     * @returns {Promise<{score: number, feedback: string}>}
     */
    static async analyzeResumeMatch(resumeText, jobDescription) {
        try {
            const prompt = `
                ### INSTRUCTION
                You are an expert HR recruitment AI. Your task is to analyze the following RESUME against the JOB DESCRIPTION.
                Provide a MATCH SCORE (0 to 100) and a brief FEEDBACK (max 3 sentences) on the candidate's suitability.
                
                ### OUTPUT FORMAT (STRICT)
                Always respond in the following JSON format:
                {
                  "score": number,
                  "feedback": "string"
                }

                ### JOB DESCRIPTION
                ${jobDescription}

                ### RESUME CONTENT
                ${resumeText}
            `;

            const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: OLLAMA_MODEL,
                    prompt: prompt,
                    stream: false,
                    format: 'json'
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data = await response.json();
            const result = JSON.parse(data.response);

            return {
                score: result.score || 0,
                feedback: result.feedback || 'No feedback provided by AI.'
            };
        } catch (error) {
            console.error('AI Service Error:', error);
            return {
                score: 0,
                feedback: 'Error occurred during AI analysis. Please try again later.'
            };
        }
    }

    /**
     * Extracts skills from a resume and matches them against job requirements.
     * @param {string} resumeText - The extracted text from the resume
     * @param {Array} jobRequirements - Array of requirement strings from the Job model
     * @returns {Promise<{extractedSkills: string[], matchPercentage: number, missingSkills: string[]}>}
     */
    static async analyzeSkillsMatch(resumeText, jobRequirements) {
        try {
            const prompt = `
                Analyze the RESUME against the REQUIRED SKILLS.
                1. Extract ONLY programming skills from the resume.
                2. Identify which required skills are matched.
                3. Identify which are missing.
                4. Match percentage = (Matched / Required) * 100.

                ### RULES
                - IGNORE soft skills/general skills.
                - NORMALIZE technical skills.

                ### INPUT
                Required: ${jobRequirements.join(', ')}
                Resume: ${resumeText}

                ### OUTPUT (JSON)
                {
                  "extracted": ["skill1", "skill2"],
                  "matched": ["skill1"],
                  "missing": ["skill2"],
                  "percentage": number
                }
            `;

            const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: OLLAMA_MODEL,
                    prompt: prompt,
                    stream: false,
                    format: 'json'
                })
            });

            if (!response.ok) throw new Error('Ollama connection failed');

            const data = await response.json();
            const result = JSON.parse(data.response);

            return {
                extractedSkills: result.extracted || [],
                matchPercentage: result.percentage || 0,
                missingSkills: result.missing || []
            };
        } catch (error) {
            console.error('Skill Analysis Error:', error);
            return {
                extractedSkills: [],
                matchPercentage: 0,
                missingSkills: jobRequirements
            };
        }
    }

    /**
     * Extracts ONLY the programming skills from a resume text.
     * @param {string} resumeText - The extracted text from the resume
     * @returns {Promise<string[]>} Array of skills
     */
    static async extractSkills(resumeText) {
        try {
            const prompt = `
                You are a precise technical skill extractor AI.
                ### TASK
                Extract ONLY technical programming skills from the resume text. 
                
                ### CATEGORIES TO EXTRACT:
                1. Programming Languages (Python, JavaScript, C++, etc.)
                2. Frameworks & Libraries (React, Node.js, TensorFlow, etc.)
                3. Databases (MongoDB, PostgreSQL, MySQL, etc.)
                4. Developer Tools & Infrastructure (Git, Docker, AWS, Kubernetes, Jenkins, etc.)

                ### CATEGORIES TO ABSOLUTELY IGNORE:
                - Soft Skills (Communication, Teamwork, Leadership, Management)
                - General Software (MS Office, Excel, PowerPoint)
                - Non-technical skills (Marketing, Sales, Accounting)

                ### EXAMPLES:
                Input: "I am a leader with 5 years in Python and React. Expert in communication and team management. Also used Git and MongoDB."
                Output: {"programming_skills": ["Python", "React", "Git", "MongoDB"]}
                
                Input: "Marketing specialist with some HTML/CSS knowledge. Expert in SEO and Excel."
                Output: {"programming_skills": ["HTML", "CSS"]}

                ### RESUME TEXT:
                ${resumeText}

                ### OUTPUT FORMAT (STRICT JSON):
                {
                  "programming_skills": ["Skill1", "Skill2"]
                }
            `;

            const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: OLLAMA_MODEL,
                    prompt: prompt,
                    stream: false,
                    format: 'json'
                })
            });

            if (!response.ok) throw new Error('Ollama connection failed');

            const data = await response.json();
            console.log("--- Ollama Raw Response (Extract Skills) ---");
            console.log(data.response);
            console.log("--------------------------------------------");
            
            let result;
            try {
                result = JSON.parse(data.response);
            } catch (e) {
                console.error("Failed to parse Ollama JSON:", e);
                return [];
            }

            if (Array.isArray(result)) {
                return result;
            } else if (result && result.programming_skills && Array.isArray(result.programming_skills)) {
                return result.programming_skills;
            } else if (result && result.skills && Array.isArray(result.skills)) {
                return result.skills;
            } else if (typeof result === 'object') {
                const lists = Object.values(result).find(val => Array.isArray(val));
                return lists || [];
            }
            
            return [];
        } catch (error) {
            console.error('Skill Extraction Error:', error);
            return [];
        }
    }
    /**
     * Extracts skills from a resume and matches them against a job requirement matrix, returning matching jobs.
     * @param {string} resumeText - The extracted text from the resume
     * @param {string|Array} jobMatrix - The job requirement matrices (could be JSON string or array of objects)
     * @returns {Promise<Object>} JSON containing extracted_skills and matched_jobs
     */
    static async findMatchingJobs(resumeText, jobMatrix) {
        try {
            // Convert to string if it's passed as an object/array
            const jobMatrixString = typeof jobMatrix === 'string' ? jobMatrix : JSON.stringify(jobMatrix, null, 2);
            
            const prompt = `
                You are a highly precise AI job matching engine specialized in technical recruitment.

                ### TASK
                1. Extract ONLY technical programming skills (Languages, Frameworks, Databases, Tools) from the resume.
                2. Match these skills against the Job Matrix provided.
                3. Return ONLY jobs with at least ONE skill match.

                ### RULES
                - IGNORE: Soft skills (Communication, Leadership), General Software (Excel), and non-tech skills.
                - NORMALIZE: (e.g., "JS" -> "JavaScript", "postgres" -> "PostgreSQL").
                - MATCH: Calculate match_percentage based on (Matched Skills / Required Skills) * 100.
                - Job = Ignore if 0% match. Be realistic.

                ### EXAMPLE
                Resume: "Expert in Python/React. Strong leadership skills."
                Matrix: [{"job_title": "Frontend", "requirements": ["React"]}, {"job_title": "Java Dev", "requirements": ["Java"]}]
                Output: {"extracted_skills": ["Python", "React"], "matched_jobs": [{"job_title": "Frontend", "match_percentage": 100, "matched_skills": ["React"]}]}

                ### INPUT
                Resume Text: ${resumeText}
                Job Matrix: ${jobMatrixString}

                ### OUTPUT FORMAT (STRICT JSON ONLY)
                {
                  "extracted_skills": ["Skill1", "Skill2"],
                  "matched_jobs": [
                    {
                      "job_title": "EXACT_TITLE_FROM_MATRIX",
                      "match_percentage": 100,
                      "matched_skills": ["Skill1"]
                    }
                  ]
                }

                Job Requirement Matrix:
                ${jobMatrixString}
            `;

            const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: OLLAMA_MODEL,
                    prompt: prompt,
                    stream: false,
                    format: 'json'
                })
            });

            if (!response.ok) throw new Error('Ollama connection failed');

            const data = await response.json();
            console.log("--- Ollama Raw Response (Match Jobs) ---");
            console.log(data.response);
            console.log("----------------------------------------");
            
            let result;
            try {
                // Remove markdown code blocks if the AI added them
                let cleanResponse = data.response;
                if (cleanResponse.includes('```')) {
                    const match = cleanResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                    if (match && match[1]) {
                        cleanResponse = match[1];
                    }
                }
                result = JSON.parse(cleanResponse);
            } catch (e) {
                console.error("Failed to parse Ollama JSON:", e);
                // Last ditch effort: if it's not JSON, return whatever words look like skills
                return { extracted_skills: [], matched_jobs: [] };
            }

            console.log("Parsed AI Result:", JSON.stringify(result, null, 2));

            // AI (Local LLMs especially) often hallucinate set intersections and fake example jobs.
            const finalExtracted = result.extracted_skills || [];
            const finalExtractedLower = finalExtracted.map(s => s.toLowerCase());
            
            // Map the valid titles from the job matrix for safety checks
            const validJobTitles = Array.isArray(jobMatrix) 
                  ? jobMatrix.map(j => (j.job_title || '').toLowerCase())
                  : [];

            let finalMatchedJobs = (result.matched_jobs || [])
                .filter(job => {
                     // Check 1: The job title MUST exist in the provided matrix!
                     if (!job.job_title) return false;
                     if (validJobTitles.length > 0 && !validJobTitles.includes(job.job_title.toLowerCase())) return false;
                     return true;
                })
                .map(job => {
                    if (!job.matched_skills) return job;
                    // Filter out hallucinatory matched skills that weren't actually in the resume
                    const realMatchedSkills = job.matched_skills.filter(jobSkill => 
                         finalExtractedLower.some(ext => 
                             ext.includes(jobSkill.toLowerCase()) || jobSkill.toLowerCase().includes(ext)
                         )
                    );
                    return { ...job, matched_skills: realMatchedSkills };
                })
                .filter(job => job.matched_skills && job.matched_skills.length > 0);

            return {
                extracted_skills: finalExtracted,
                matched_jobs: finalMatchedJobs
            };
            
        } catch (error) {
            console.error('Job Matching Error:', error);
            return { extracted_skills: [], matched_jobs: [] };
        }
    }
}

module.exports = AIService;
