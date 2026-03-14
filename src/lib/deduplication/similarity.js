/**
 * Similarity calculation engine for resume deduplication
 * Implements field-level similarity calculators and overall similarity calculation
 */

const Fuse = require('fuse.js');
const levenshtein = require('js-levenshtein');
const { FIELD_WEIGHTS, FUZZY_MATCH_THRESHOLD } = require('./types');

/**
 * Calculate similarity between two work experience arrays
 * Uses fuzzy matching for company and position names
 * @param {Array} workExp1 - First work experience array
 * @param {Array} workExp2 - Second work experience array
 * @returns {number} Similarity score (0-100)
 */
function calculateWorkExperienceSimilarity(workExp1, workExp2) {
  if (!Array.isArray(workExp1) || !Array.isArray(workExp2)) {
    return 0;
  }

  // Handle empty arrays
  if (workExp1.length === 0 && workExp2.length === 0) {
    return 100;
  }
  if (workExp1.length === 0 || workExp2.length === 0) {
    return 0;
  }

  let totalSimilarity = 0;
  let comparisonCount = 0;

  // For each entry in workExp1, find the best match in workExp2
  workExp1.forEach(entry1 => {
    let bestMatchScore = 0;
    
    workExp2.forEach(entry2 => {
      // Calculate similarity for this pair
      let pairScore = 0;
      let fieldCount = 0;

      // Compare company names
      if (entry1.company && entry2.company) {
        const companySim = stringSimilarity(entry1.company, entry2.company);
        pairScore += companySim;
        fieldCount++;
      }

      // Compare positions
      if (entry1.position && entry2.position) {
        const positionSim = stringSimilarity(entry1.position, entry2.position);
        pairScore += positionSim;
        fieldCount++;
      }

      // Average the field similarities
      const avgScore = fieldCount > 0 ? pairScore / fieldCount : 0;
      
      if (avgScore > bestMatchScore) {
        bestMatchScore = avgScore;
      }
    });

    totalSimilarity += bestMatchScore;
    comparisonCount++;
  });

  // Calculate average similarity across all entries
  return comparisonCount > 0 ? totalSimilarity / comparisonCount : 0;
}

/**
 * Calculate string similarity using simple character-based comparison
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score (0-100)
 */
function stringSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 100;

  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  // Use Levenshtein distance
  const distance = levenshtein(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;

  return Math.max(0, similarity);
}

/**
 * Calculate similarity between two education arrays
 * Compares institutions, degrees, and fields
 * @param {Array} edu1 - First education array
 * @param {Array} edu2 - Second education array
 * @returns {number} Similarity score (0-100)
 */
function calculateEducationSimilarity(edu1, edu2) {
  if (!Array.isArray(edu1) || !Array.isArray(edu2)) {
    return 0;
  }

  // Handle empty arrays
  if (edu1.length === 0 && edu2.length === 0) {
    return 100;
  }
  if (edu1.length === 0 || edu2.length === 0) {
    return 0;
  }

  let totalSimilarity = 0;
  let comparisonCount = 0;

  // For each entry in edu1, find the best match in edu2
  edu1.forEach(entry1 => {
    let bestMatchScore = 0;
    
    edu2.forEach(entry2 => {
      // Calculate similarity for this pair
      let pairScore = 0;
      let fieldCount = 0;

      // Compare institutions
      if (entry1.institution && entry2.institution) {
        const instSim = stringSimilarity(entry1.institution, entry2.institution);
        pairScore += instSim;
        fieldCount++;
      }

      // Compare degrees
      if (entry1.degree && entry2.degree) {
        const degreeSim = stringSimilarity(entry1.degree, entry2.degree);
        pairScore += degreeSim;
        fieldCount++;
      }

      // Compare fields
      if (entry1.field && entry2.field) {
        const fieldSim = stringSimilarity(entry1.field, entry2.field);
        pairScore += fieldSim;
        fieldCount++;
      }

      // Average the field similarities
      const avgScore = fieldCount > 0 ? pairScore / fieldCount : 0;
      
      if (avgScore > bestMatchScore) {
        bestMatchScore = avgScore;
      }
    });

    totalSimilarity += bestMatchScore;
    comparisonCount++;
  });

  // Calculate average similarity across all entries
  return comparisonCount > 0 ? totalSimilarity / comparisonCount : 0;
}

/**
 * Calculate similarity between two skill arrays
 * Uses set intersection
 * @param {Array} skills1 - First skills array
 * @param {Array} skills2 - Second skills array
 * @returns {number} Similarity score (0-100)
 */
function calculateSkillsSimilarity(skills1, skills2) {
  if (!Array.isArray(skills1) || !Array.isArray(skills2)) {
    return 0;
  }

  // Handle empty arrays
  if (skills1.length === 0 && skills2.length === 0) {
    return 100;
  }
  if (skills1.length === 0 || skills2.length === 0) {
    return 0;
  }

  // Convert to sets for intersection
  const set1 = new Set(skills1.map(s => s.toLowerCase()));
  const set2 = new Set(skills2.map(s => s.toLowerCase()));

  // Calculate intersection
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  
  // Calculate union
  const union = new Set([...set1, ...set2]);

  // Similarity = intersection / union * 100
  return (intersection.size / union.size) * 100;
}

/**
 * Calculate similarity between two certification arrays
 * Uses set intersection
 * @param {Array} certs1 - First certifications array
 * @param {Array} certs2 - Second certifications array
 * @returns {number} Similarity score (0-100)
 */
function calculateCertificationsSimilarity(certs1, certs2) {
  if (!Array.isArray(certs1) || !Array.isArray(certs2)) {
    return 0;
  }

  // Handle empty arrays
  if (certs1.length === 0 && certs2.length === 0) {
    return 100;
  }
  if (certs1.length === 0 || certs2.length === 0) {
    return 0;
  }

  // Convert to sets for intersection
  const set1 = new Set(certs1.map(c => c.toLowerCase()));
  const set2 = new Set(certs2.map(c => c.toLowerCase()));

  // Calculate intersection
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  
  // Calculate union
  const union = new Set([...set1, ...set2]);

  // Similarity = intersection / union * 100
  return (intersection.size / union.size) * 100;
}

/**
 * Calculate similarity between two summary strings
 * Uses Levenshtein distance
 * @param {string} summary1 - First summary
 * @param {string} summary2 - Second summary
 * @returns {number} Similarity score (0-100)
 */
function calculateSummarySimilarity(summary1, summary2) {
  if (typeof summary1 !== 'string' || typeof summary2 !== 'string') {
    return 0;
  }

  // Handle empty strings
  if (summary1.length === 0 && summary2.length === 0) {
    return 100;
  }
  if (summary1.length === 0 || summary2.length === 0) {
    return 0;
  }

  // Normalize strings
  const s1 = summary1.toLowerCase().trim();
  const s2 = summary2.toLowerCase().trim();

  // Calculate Levenshtein distance
  const distance = levenshtein(s1, s2);
  
  // Convert distance to similarity percentage
  const maxLength = Math.max(s1.length, s2.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;

  return Math.max(0, similarity);
}

/**
 * Calculate overall similarity between two resume data objects
 * Applies field weights and handles missing fields
 * @param {Object} resumeData1 - First resume data
 * @param {Object} resumeData2 - Second resume data
 * @returns {number} Overall similarity score (0-100)
 */
function calculateSimilarity(resumeData1, resumeData2) {
  if (!resumeData1 || !resumeData2) {
    return 0;
  }

  // Calculate field-level similarities
  const fieldSimilarities = {
    workExperience: calculateWorkExperienceSimilarity(
      resumeData1.workExperience || [],
      resumeData2.workExperience || []
    ),
    education: calculateEducationSimilarity(
      resumeData1.education || [],
      resumeData2.education || []
    ),
    skills: calculateSkillsSimilarity(
      resumeData1.skills || [],
      resumeData2.skills || []
    ),
    certifications: calculateCertificationsSimilarity(
      resumeData1.certifications || [],
      resumeData2.certifications || []
    ),
    summary: calculateSummarySimilarity(
      resumeData1.summary || '',
      resumeData2.summary || ''
    )
  };

  // Determine which fields are available in both resumes
  const availableFields = [];
  let totalWeight = 0;

  Object.keys(FIELD_WEIGHTS).forEach(field => {
    const hasData1 = hasFieldData(resumeData1, field);
    const hasData2 = hasFieldData(resumeData2, field);
    
    // Only include field if both resumes have data for it
    if (hasData1 && hasData2) {
      availableFields.push(field);
      totalWeight += FIELD_WEIGHTS[field];
    }
  });

  // If no fields are available, return 0
  if (availableFields.length === 0 || totalWeight === 0) {
    return 0;
  }

  // Calculate weighted similarity
  let weightedSum = 0;
  availableFields.forEach(field => {
    const normalizedWeight = FIELD_WEIGHTS[field] / totalWeight;
    weightedSum += fieldSimilarities[field] * normalizedWeight;
  });

  // Ensure result is between 0 and 100
  return Math.max(0, Math.min(100, weightedSum));
}

/**
 * Check if a resume has data for a specific field
 * @param {Object} resumeData - Resume data object
 * @param {string} field - Field name
 * @returns {boolean} True if field has data
 */
function hasFieldData(resumeData, field) {
  if (!resumeData) return false;

  switch (field) {
    case 'workExperience':
      return Array.isArray(resumeData.workExperience) && resumeData.workExperience.length > 0;
    case 'education':
      return Array.isArray(resumeData.education) && resumeData.education.length > 0;
    case 'skills':
      return Array.isArray(resumeData.skills) && resumeData.skills.length > 0;
    case 'certifications':
      return Array.isArray(resumeData.certifications) && resumeData.certifications.length > 0;
    case 'summary':
      return typeof resumeData.summary === 'string' && resumeData.summary.trim().length > 0;
    default:
      return false;
  }
}

/**
 * Calculate difference percentage from similarity score
 * @param {number} similarityScore - Similarity score (0-100)
 * @returns {number} Difference percentage (0-100)
 */
function calculateDifference(similarityScore) {
  if (typeof similarityScore !== 'number') {
    return 100;
  }

  const difference = 100 - similarityScore;
  
  // Ensure result is between 0 and 100
  return Math.max(0, Math.min(100, difference));
}

module.exports = {
  calculateWorkExperienceSimilarity,
  calculateEducationSimilarity,
  calculateSkillsSimilarity,
  calculateCertificationsSimilarity,
  calculateSummarySimilarity,
  calculateSimilarity,
  calculateDifference
};
