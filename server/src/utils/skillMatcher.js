/**
 * skillMatcher.js
 * Utility for synonym-aware, fuzzy skill matching.
 * Compares candidate extracted skills vs job required skills.
 */

// ─── Synonym Map ─────────────────────────────────────────────────────────────
/**
 * Maps canonical skill names to arrays of known aliases/synonyms.
 * All values are lowercase for case-insensitive comparison.
 */
const SKILL_SYNONYMS = {
  'javascript': ['js', 'es6', 'es2015', 'ecmascript', 'vanilla js', 'vanilla javascript'],
  'typescript': ['ts'],
  'python': ['py', 'python3', 'python2'],
  'java': ['core java', 'java se', 'java ee'],
  'c#': ['csharp', 'c sharp', '.net c#'],
  'c++': ['cpp', 'c plus plus'],
  'react': ['react.js', 'reactjs', 'react js'],
  'next.js': ['nextjs', 'next js'],
  'vue': ['vue.js', 'vuejs', 'vue js'],
  'angular': ['angularjs', 'angular js', 'angular 2+'],
  'node.js': ['nodejs', 'node js', 'node'],
  'express': ['express.js', 'expressjs'],
  'fastapi': ['fast api'],
  'django': ['django rest framework', 'drf'],
  'flask': ['micro flask'],
  'spring': ['spring boot', 'spring framework', 'springboot'],
  'mongodb': ['mongo', 'mongo db'],
  'postgresql': ['postgres', 'pg', 'psql'],
  'mysql': ['my sql'],
  'redis': ['redis cache'],
  'graphql': ['graph ql'],
  'rest api': ['rest', 'restful', 'restful api', 'restful apis'],
  'docker': ['docker container', 'containerization'],
  'kubernetes': ['k8s', 'kube'],
  'aws': ['amazon web services', 'amazon aws'],
  'azure': ['microsoft azure'],
  'gcp': ['google cloud', 'google cloud platform'],
  'git': ['github', 'gitlab', 'version control', 'git/github'],
  'ci/cd': ['cicd', 'continuous integration', 'continuous deployment', 'github actions', 'jenkins'],
  'html': ['html5'],
  'css': ['css3'],
  'sass': ['scss', 'sass/scss'],
  'tailwind': ['tailwindcss', 'tailwind css'],
  'bootstrap': ['bootstrap css'],
  'machine learning': ['ml', 'machine learning algorithms'],
  'deep learning': ['dl', 'neural networks'],
  'tensorflow': ['tf', 'tensor flow'],
  'pytorch': ['torch'],
  'opencv': ['open cv'],
  'pandas': ['pandas library'],
  'numpy': ['numpy library'],
  'scikit-learn': ['sklearn'],
  'linux': ['unix', 'bash', 'shell scripting', 'linux/unix'],
  'agile': ['scrum', 'kanban', 'agile scrum'],
  'mern': ['mern stack'],
  'mean': ['mean stack'],
};

// ─── Build reverse lookup (alias → canonical) ─────────────────────────────────
const ALIAS_TO_CANONICAL = {};
for (const [canonical, aliases] of Object.entries(SKILL_SYNONYMS)) {
  ALIAS_TO_CANONICAL[canonical.toLowerCase()] = canonical;
  for (const alias of aliases) {
    ALIAS_TO_CANONICAL[alias.toLowerCase()] = canonical;
  }
}

// ─── Normalize a single skill ─────────────────────────────────────────────────
/**
 * Normalizes a skill string to its canonical form.
 * @param {string} skill
 * @returns {string} canonical skill name (lowercased)
 */
function normalizeSkill(skill) {
  if (!skill || typeof skill !== 'string') return '';
  const lower = skill.trim().toLowerCase();
  return ALIAS_TO_CANONICAL[lower] || lower;
}

/**
 * Normalizes an array of skills.
 * @param {string[]} skills
 * @returns {string[]} unique normalized skills
 */
function normalizeSkills(skills) {
  if (!Array.isArray(skills)) return [];
  const normalized = [];
  
  skills.forEach(s => {
    if (typeof s !== 'string') return;
    // Handle cases where multiple skills are in one string (e.g. "React, Node.js")
    const parts = s.split(/[,;/]+/).map(p => p.trim()).filter(Boolean);
    parts.forEach(p => {
      const norm = normalizeSkill(p);
      if (norm) normalized.push(norm);
    });
  });

  return [...new Set(normalized)];
}

// ─── Levenshtein Distance (fuzzy matching) ────────────────────────────────────
/**
 * Computes the Levenshtein distance between two strings.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Calculates similarity between two strings (0 = no match, 1 = identical).
 * @param {string} s1
 * @param {string} s2
 * @returns {number} similarity score between 0 and 1
 */
function fuzzyMatch(s1, s2) {
  if (!s1 || !s2) return 0;
  const a = s1.toLowerCase().trim();
  const b = s2.toLowerCase().trim();
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const dist = levenshtein(a, b);
  return 1 - dist / maxLen;
}

// ─── Core Matching Logic ──────────────────────────────────────────────────────
/**
 * Matches candidate's extracted skills against a job's required skills.
 *
 * @param {string[]} extractedSkills - Skills found in the candidate's resume
 * @param {string[]} requiredSkills  - Skills required by the job posting
 * @param {number}   threshold       - Minimum similarity to count as a match (default 0.75)
 * @returns {{
 *   matchedSkills: string[],
 *   unmatchedSkills: string[],
 *   advantageSkills: string[],
 *   matchScore: number,
 *   status: 'SELECTED' | 'REJECTED'
 * }}
 */
function matchSkills(extractedSkills, requiredSkills, threshold = 0.75) {
  const normExtracted = normalizeSkills(extractedSkills);
  const normRequired  = normalizeSkills(requiredSkills);

  const matchedSkills   = [];
  const unmatchedSkills = [];

  for (const req of normRequired) {
    let matched = false;

    // 1. Exact / synonym match first
    if (normExtracted.includes(req)) {
      matched = true;
    } 
    
    // 2. Substring matching (e.g. "React" matches "React.js" or "React Native")
    if (!matched) {
      for (const ext of normExtracted) {
        if (ext.includes(req) || req.includes(ext)) {
          matched = true;
          break;
        }
      }
    }

    // 3. Fuzzy match (Levenshtein)
    if (!matched) {
      for (const ext of normExtracted) {
        const score = fuzzyMatch(req, ext);
        if (score >= threshold) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      matchedSkills.push(req);
    } else {
      unmatchedSkills.push(req);
    }
  }

  // Advantage skills: candidate has skills beyond what's required
  const advantageSkills = normExtracted.filter(
    ext => !normRequired.includes(ext) &&
           !normRequired.some(req => fuzzyMatch(req, ext) >= threshold)
  );

  const matchScore = normRequired.length > 0
    ? Math.round((matchedSkills.length / normRequired.length) * 100)
    : 0;

  const status = matchScore >= 50 ? 'SELECTED' : 'REJECTED';

  return { matchedSkills, unmatchedSkills, advantageSkills, matchScore, status };
}

module.exports = { normalizeSkill, normalizeSkills, fuzzyMatch, matchSkills, SKILL_SYNONYMS };
