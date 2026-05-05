const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2';
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

/**
 * Service to handle AI operations using Ollama
 */
class AIService {
    /**
     * Generates a JSON response using Mistral API with a fallback to Ollama.
     * @param {string} prompt - The AI prompt
     * @returns {Promise<any>} Parsed JSON object
     */
    static async _generateJsonWithLLM(prompt) {
        if (MISTRAL_API_KEY) {
            try {
                const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${MISTRAL_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'mistral-small-latest',
                        messages: [{ role: 'user', content: prompt }],
                        response_format: { type: "json_object" }
                    })
                });

                if (mistralResponse.ok) {
                    const data = await mistralResponse.json();
                    let content = data.choices[0].message.content;
                    
                    // Parse JSON safely
                    if (content.includes('```')) {
                        const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                        if (match && match[1]) {
                            content = match[1];
                        }
                    }
                    return JSON.parse(content);
                } else {
                    console.warn(`Mistral API error (${mistralResponse.status}): ${mistralResponse.statusText}. Falling back to Ollama.`);
                }
            } catch (error) {
                console.warn('Mistral API Exception:', error.message, '. Falling back to Ollama.');
            }
        }

        // Fallback to Ollama
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
        let content = data.response;
        if (content.includes('```')) {
            const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (match && match[1]) {
                content = match[1];
            }
        }
        return JSON.parse(content);
    }

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

            const result = await AIService._generateJsonWithLLM(prompt);

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

            const result = await AIService._generateJsonWithLLM(prompt);

            return {
                extractedSkills: result.extracted || result.extractedSkills || result.skills || [],
                matchPercentage: result.percentage || result.matchPercentage || result.score || 0,
                missingSkills: result.missing || result.missingSkills || []
            };
        } catch (error) {
            console.error('Skill Analysis Error:', error);
            // Fallback to deterministic matching if the full analysis fails
            const deterministicSkills = await AIService.extractSkillsDeterministic(resumeText);
            return {
                extractedSkills: deterministicSkills,
                matchPercentage: 0,
                missingSkills: jobRequirements
            };
        }
    }

    // ─── Master Skills Database ────────────────────────────────────────────────
    // Organized by category for comprehensive keyword-based extraction.
    static SKILLS_DATABASE = {
        // Programming Languages
        languages: [
            'Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'C#', 'C',
            'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'PHP', 'Scala',
            'Perl', 'R', 'MATLAB', 'Lua', 'Haskell', 'Elixir', 'Clojure',
            'Objective-C', 'Shell', 'Bash', 'PowerShell', 'Assembly',
            'Groovy', 'Julia', 'F#', 'COBOL', 'Fortran', 'Solidity',
        ],
        // Web Frontend
        webFrontend: [
            'HTML', 'CSS', 'React', 'React.js', 'Angular', 'Vue.js', 'Vue',
            'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'jQuery', 'Bootstrap',
            'Tailwind CSS', 'Material UI', 'Chakra UI', 'SASS', 'SCSS', 'LESS',
            'Webpack', 'Vite', 'Babel', 'Redux', 'MobX', 'Zustand',
            'Styled Components', 'Emotion', 'Three.js', 'D3.js',
        ],
        // Web Backend & Frameworks
        webBackend: [
            'Node.js', 'Express.js', 'Express', 'Django', 'Flask', 'FastAPI',
            'Spring', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'Rails',
            'ASP.NET', '.NET', 'NestJS', 'Koa', 'Hapi', 'Gin', 'Echo',
            'Phoenix', 'Strapi', 'GraphQL', 'REST', 'REST API', 'REST APIs',
            'gRPC', 'WebSocket', 'Socket.io',
        ],
        // Full-Stack Labels
        fullStack: [
            'MERN Stack', 'MERN', 'MEAN Stack', 'MEAN', 'LAMP', 'JAMstack',
            'Full Stack', 'Full-Stack',
        ],
        // Mobile Development
        mobile: [
            'Flutter', 'React Native', 'SwiftUI', 'Jetpack Compose',
            'Xamarin', 'Ionic', 'Cordova', 'Android', 'iOS',
            'Android Studio', 'Xcode',
        ],
        // Databases
        databases: [
            'MySQL', 'PostgreSQL', 'MongoDB', 'SQLite', 'Oracle',
            'SQL Server', 'MariaDB', 'Redis', 'Cassandra', 'DynamoDB',
            'Firebase', 'Firestore', 'Cloud Firestore', 'Supabase',
            'CouchDB', 'Neo4j', 'Elasticsearch', 'SQL', 'NoSQL', 'RDBMS',
            'PL/SQL', 'T-SQL',
        ],
        // Cloud & DevOps
        cloudDevOps: [
            'AWS', 'Azure', 'Google Cloud', 'GCP', 'Heroku', 'Vercel',
            'Netlify', 'DigitalOcean', 'Docker', 'Kubernetes', 'Jenkins',
            'CI/CD', 'Terraform', 'Ansible', 'Nginx', 'Apache',
            'Linux', 'Ubuntu', 'CentOS', 'GitHub Actions', 'GitLab CI',
            'CircleCI', 'Travis CI', 'CloudFormation', 'Serverless',
            'Lambda', 'EC2', 'S3',
        ],
        // AI / ML / Data Science
        aiMl: [
            'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'OpenCV',
            'Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn',
            'Machine Learning', 'Deep Learning', 'NLP',
            'Natural Language Processing', 'Computer Vision',
            'Neural Networks', 'Hugging Face', 'LangChain', 'LLM',
            'Generative AI', 'Data Mining', 'Data Analysis', 'Data Analytics',
            'Big Data', 'Hadoop', 'Spark', 'Apache Spark', 'Jupyter',
            'NLTK', 'SpaCy',
        ],
        // Tools & Platforms
        tools: [
            'Git', 'GitHub', 'GitLab', 'Bitbucket', 'VS Code',
            'Visual Studio', 'IntelliJ', 'Eclipse', 'PyCharm', 'Postman',
            'Jira', 'Confluence', 'Slack', 'Figma', 'Adobe XD', 'Sketch',
            'PowerBI', 'Power BI', 'Tableau', 'Grafana', 'Kibana',
            'Swagger', 'npm', 'Yarn', 'pip', 'Maven', 'Gradle',
            'WordPress', 'Shopify', 'Magento', 'Salesforce',
        ],
        // Testing
        testing: [
            'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Playwright',
            'JUnit', 'TestNG', 'Pytest', 'Enzyme', 'React Testing Library',
            'Puppeteer', 'Appium', 'Postman',
        ],
        // Security & Networking
        security: [
            'Cybersecurity', 'Cyber Security', 'Penetration Testing',
            'OWASP', 'SSL', 'TLS', 'OAuth', 'JWT', 'SAML', 'SSO',
            'Firewall', 'VPN', 'Encryption', 'Blockchain',
            'Web Security', 'Website Security', 'Infrastructure Security',
        ],
        // Methodologies
        methodologies: [
            'Agile', 'Scrum', 'Kanban', 'DevOps', 'TDD', 'BDD',
            'Microservices', 'Monorepo', 'OOP', 'MVC', 'MVVM',
            'Design Patterns', 'System Design', 'API Design',
            'Data Structures', 'Algorithms',
        ],
    };

    // Words/phrases to EXCLUDE (soft skills, spoken languages, non-tech)
    static EXCLUDE_PATTERNS = [
        'communication', 'teamwork', 'leadership', 'management',
        'time management', 'team collaboration', 'negotiation',
        'problem solving', 'critical thinking', 'hindi', 'english',
        'gujarati', 'gujrati', 'french', 'spanish', 'german',
        'business development', 'sales', 'accounting', 'marketing',
        'client relationship',
    ];

    /**
     * Extracts ONLY the technical/programming skills from resume text
     * using a deterministic keyword-matching approach.
     * @param {string} resumeText - The extracted text from the resume
     * @returns {Promise<string[]>} Array of unique skills found
     */
    static async extractSkillsDeterministic(resumeText) {
        try {
            if (!resumeText || typeof resumeText !== 'string') {
                console.warn('extractSkills: No resume text provided.');
                return [];
            }

            const textLower = resumeText.toLowerCase();
            const foundSkills = new Set();

            // Flatten all skill categories into one list
            const allSkills = Object.values(AIService.SKILLS_DATABASE).flat();

            for (const skill of allSkills) {
                const skillLower = skill.toLowerCase();

                // Skip if it matches an exclusion pattern
                if (AIService.EXCLUDE_PATTERNS.some(ex => skillLower.includes(ex))) {
                    continue;
                }

                const escaped = skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                // Stricter word boundary matching
                let regex;
                if (skill.length <= 2) {
                    regex = new RegExp(`(?:^|[,;|/\\s])${escaped}(?=[,;|/\\s.+]|$)`, 'i');
                } else {
                    regex = new RegExp(`(?:^|[^a-zA-Z])${escaped}(?=[^a-zA-Z]|$)`, 'i');
                }

                if (regex.test(textLower)) {
                    foundSkills.add(skill);
                }
            }

            // Also check for common multi-word skills that might be missed by simple splitting
            const multiWordSkills = ['Full Stack', 'Full-Stack', 'Machine Learning', 'Deep Learning', 'Cloud Computing', 'Data Science', 'MERN Stack', 'MEAN Stack'];
            for (const mw of multiWordSkills) {
                if (textLower.includes(mw.toLowerCase())) {
                    foundSkills.add(mw);
                }
            }

            const deduped = AIService._deduplicateSkills([...foundSkills]);
            return deduped;
        } catch (error) {
            console.error('Deterministic Skill Extraction Error:', error);
            return [];
        }
    }

    /**
     * Extracts skills using AI (Mistral/Ollama), falling back to deterministic extraction on failure.
     * @param {string} resumeText 
     * @returns {Promise<string[]>}
     */
    static async extractSkills(resumeText) {
        try {
            if (!resumeText || typeof resumeText !== 'string' || resumeText.length < 50) {
                console.warn('extractSkills: Resume text too short or missing. Falling back to deterministic.');
                return await AIService.extractSkillsDeterministic(resumeText);
            }

            const prompt = `
                ### INSTRUCTION
                You are a world-class technical recruiter. Analyze the following RESUME TEXT and extract EVERY technical skill mentioned.
                Technical skills include: Programming Languages, Frameworks, Libraries, Databases, Cloud Platforms, Tools, and Methodologies (like Agile).

                ### RULES
                1. DO NOT extract soft skills (e.g., "Leadership", "Communication").
                2. DO NOT extract spoken languages (e.g., "English", "Hindi").
                3. DO NOT hallucinate. Only extract what is explicitly mentioned.
                4. Group them into "programming", "web_development", and "tools_and_platforms".

                ### OUTPUT FORMAT (STRICT JSON ONLY)
                {
                   "programming": ["Skill 1", "Skill 2"],
                   "web_development": ["Skill 3", "Skill 4"],
                   "tools_and_platforms": ["Skill 5", "Skill 6"]
                }

                ### RESUME TEXT
                ${resumeText.substring(0, 8000)}
            `;

            try {
                const result = await AIService._generateJsonWithLLM(prompt);
                
                if (result) {
                    let combined = [];
                    
                    // Robust extraction: Check specific keys first
                    const keys = ['programming', 'web_development', 'tools_and_platforms', 'languages', 'frameworks', 'databases', 'tools', 'skills'];
                    keys.forEach(k => {
                        if (Array.isArray(result[k])) combined = [...combined, ...result[k]];
                    });

                    // Deep scan: If still empty, grab any array found in the object
                    if (combined.length === 0) {
                        Object.values(result).forEach(val => {
                            if (Array.isArray(val)) combined = [...combined, ...val];
                        });
                    }

                    if (combined.length > 0) {
                        console.log(`AI extracted ${combined.length} skills.`);
                        return AIService._deduplicateSkills(combined);
                    }
                }
            } catch (e) {
                console.error("AI Skill Extraction Error:", e.message);
            }

            // Fallback
            return await AIService.extractSkillsDeterministic(resumeText);
        } catch (error) {
            console.error('Final fallback error in extractSkills:', error);
            return await AIService.extractSkillsDeterministic(resumeText);
        }
    }

    /**
     * Remove duplicate variations of the same skill.
     * e.g., keep "React.js" over "React", "Node.js" over "Node"
     */
    static _deduplicateSkills(skills) {
        const variations = {
            'react': 'React.js',
            'react.js': 'React.js',
            'angular': 'Angular',
            'vue': 'Vue.js',
            'vue.js': 'Vue.js',
            'node.js': 'Node.js',
            'express': 'Express.js',
            'express.js': 'Express.js',
            'mern': 'MERN Stack',
            'mern stack': 'MERN Stack',
            'mean': 'MEAN Stack',
            'mean stack': 'MEAN Stack',
            'power bi': 'PowerBI',
            'powerbi': 'PowerBI',
        };

        const normalized = new Map();
        for (const skill of skills) {
            const key = variations[skill.toLowerCase()] || skill;
            // Keep the longer / more specific version
            if (!normalized.has(key) || skill.length > normalized.get(key).length) {
                normalized.set(key, skill);
            }
        }
        return [...normalized.values()];
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

            let result;
            try {
                result = await AIService._generateJsonWithLLM(prompt);
                console.log("--- AI Raw Response (Match Jobs) ---");
                console.log(JSON.stringify(result));
                console.log("----------------------------------------");
            } catch (e) {
                console.error("Failed to parse AI JSON:", e);
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
