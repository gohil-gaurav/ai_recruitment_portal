/**
 * Type definitions and interfaces for resume deduplication
 */

/**
 * @typedef {Object} ContactInfo
 * @property {string} [email] - Email address
 * @property {string} [phone] - Phone number
 * @property {string} [location] - Location/address
 */

/**
 * @typedef {Object} WorkExperienceEntry
 * @property {string} company - Company name
 * @property {string} position - Job position/title
 * @property {string} [startDate] - Start date (YYYY-MM or YYYY-MM-DD)
 * @property {string} [endDate] - End date (YYYY-MM or YYYY-MM-DD)
 * @property {string} [description] - Job description
 */

/**
 * @typedef {Object} EducationEntry
 * @property {string} institution - School/University name
 * @property {string} [degree] - Degree type (e.g., Bachelor, Master)
 * @property {string} [field] - Field of study
 * @property {string} [graduationDate] - Graduation date (YYYY-MM or YYYY-MM-DD)
 */

/**
 * @typedef {Object} ResumeData
 * @property {WorkExperienceEntry[]} workExperience - Work experience entries
 * @property {EducationEntry[]} education - Education entries
 * @property {string[]} skills - List of skills
 * @property {string[]} certifications - List of certifications
 * @property {string} [summary] - Professional summary
 * @property {ContactInfo} [contactInfo] - Contact information
 */

/**
 * @typedef {Object} DeduplicationResult
 * @property {string} decision - "NEW_ENTRY" or "DUPLICATE"
 * @property {number} maxSimilarityScore - Maximum similarity score (0-100)
 * @property {string|null} mostSimilarResumeId - ID of most similar resume
 * @property {number} differencePercentage - Difference percentage (0-100)
 * @property {string} [reasoning] - Explanation of the decision
 */

/**
 * @typedef {Object} FieldSimilarity
 * @property {number} workExperience - Work experience similarity (0-100)
 * @property {number} education - Education similarity (0-100)
 * @property {number} skills - Skills similarity (0-100)
 * @property {number} certifications - Certifications similarity (0-100)
 * @property {number} summary - Summary similarity (0-100)
 */

/**
 * Field weights for similarity calculation
 * Total should equal 100
 */
const FIELD_WEIGHTS = {
  workExperience: 40,
  education: 25,
  skills: 20,
  certifications: 10,
  summary: 5,
}

/**
 * Threshold for determining duplicate vs new entry
 * If difference percentage >= this value, it's a NEW_ENTRY
 * If difference percentage < this value, it's a DUPLICATE
 */
const DIFFERENCE_THRESHOLD = 80

/**
 * Default similarity score when no comparable data exists
 */
const DEFAULT_SIMILARITY_SCORE = 0

/**
 * Minimum similarity threshold for field matching
 * Used in fuzzy matching for work experience and education
 */
const FUZZY_MATCH_THRESHOLD = 0.7

/**
 * Create an empty ResumeData object
 * @returns {ResumeData} Empty resume data structure
 */
function createEmptyResumeData() {
  return {
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    summary: '',
    contactInfo: {
      email: '',
      phone: '',
      location: '',
    },
  }
}

/**
 * Validate ResumeData structure
 * @param {any} data - Data to validate
 * @returns {boolean} True if valid ResumeData
 */
function isValidResumeData(data) {
  if (!data || typeof data !== 'object') return false
  
  return (
    Array.isArray(data.workExperience) &&
    Array.isArray(data.education) &&
    Array.isArray(data.skills) &&
    Array.isArray(data.certifications) &&
    typeof data.summary === 'string'
  )
}

/**
 * Validate DeduplicationResult structure
 * @param {any} result - Result to validate
 * @returns {boolean} True if valid DeduplicationResult
 */
function isValidDeduplicationResult(result) {
  if (!result || typeof result !== 'object') return false
  
  return (
    (result.decision === 'NEW_ENTRY' || result.decision === 'DUPLICATE') &&
    typeof result.maxSimilarityScore === 'number' &&
    result.maxSimilarityScore >= 0 &&
    result.maxSimilarityScore <= 100 &&
    typeof result.differencePercentage === 'number' &&
    result.differencePercentage >= 0 &&
    result.differencePercentage <= 100
  )
}

module.exports = {
  FIELD_WEIGHTS,
  DIFFERENCE_THRESHOLD,
  DEFAULT_SIMILARITY_SCORE,
  FUZZY_MATCH_THRESHOLD,
  createEmptyResumeData,
  isValidResumeData,
  isValidDeduplicationResult
}
