/**
 * Resume data extraction utility
 * Parses resume documents and extracts structured data
 */

const { normalizeText, normalizeDate } = require('./normalizer');

/**
 * @typedef {Object} ContactInfo
 * @property {string} email
 * @property {string} phone
 * @property {string} location
 */

/**
 * @typedef {Object} WorkExperienceEntry
 * @property {string} company
 * @property {string} position
 * @property {string} startDate - YYYY-MM-DD format
 * @property {string} endDate - YYYY-MM-DD format
 * @property {string} description
 */

/**
 * @typedef {Object} EducationEntry
 * @property {string} institution
 * @property {string} degree
 * @property {string} field
 * @property {string} graduationDate - YYYY-MM-DD format
 */

/**
 * @typedef {Object} ResumeData
 * @property {WorkExperienceEntry[]} workExperience
 * @property {EducationEntry[]} education
 * @property {string[]} skills
 * @property {string[]} certifications
 * @property {string} summary
 * @property {ContactInfo} contactInfo
 */

/**
 * Extract resume data from a document
 * Handles both text and JSON formats
 * @param {string|Object} document - Resume document (text or parsed JSON)
 * @returns {ResumeData} Extracted resume data
 */
function extractFromDocument(document) {
  if (!document) {
    return createEmptyResumeData();
  }

  let data;
  
  // Handle string input (text resume)
  if (typeof document === 'string') {
    data = parseTextResume(document);
  } 
  // Handle object input (JSON resume)
  else if (typeof document === 'object') {
    data = document;
  } 
  else {
    return createEmptyResumeData();
  }

  return {
    workExperience: extractWorkExperience(data),
    education: extractEducation(data),
    skills: extractSkills(data),
    certifications: extractCertifications(data),
    summary: extractSummary(data),
    contactInfo: extractContactInfo(data)
  };
}

/**
 * Create an empty ResumeData structure
 * @returns {ResumeData}
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
      location: ''
    }
  };
}

/**
 * Parse text-based resume into structured object
 * @param {string} text
 * @returns {Object}
 */
function parseTextResume(text) {
  // Simple text parsing - extract sections by common headers
  const sections = {};
  
  // Extract email
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  if (emailMatch) {
    sections.email = emailMatch[0];
  }

  // Extract phone (basic pattern)
  const phoneMatch = text.match(/(\+?1[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/);
  if (phoneMatch) {
    sections.phone = phoneMatch[0];
  }

  return sections;
}

/**
 * Extract work experience entries
 * @param {Object} data
 * @returns {WorkExperienceEntry[]}
 */
function extractWorkExperience(data) {
  const entries = [];

  if (!data) {
    return entries;
  }

  // Handle array of work experience
  if (Array.isArray(data.workExperience)) {
    data.workExperience.forEach(entry => {
      if (entry && typeof entry === 'object') {
        entries.push({
          company: normalizeText(entry.company || ''),
          position: normalizeText(entry.position || entry.title || ''),
          startDate: normalizeDate(entry.startDate || entry.start_date || ''),
          endDate: normalizeDate(entry.endDate || entry.end_date || ''),
          description: normalizeText(entry.description || entry.summary || '')
        });
      }
    });
  }

  // Handle work or jobs field
  if (Array.isArray(data.work)) {
    data.work.forEach(entry => {
      if (entry && typeof entry === 'object') {
        entries.push({
          company: normalizeText(entry.company || entry.name || ''),
          position: normalizeText(entry.position || entry.title || ''),
          startDate: normalizeDate(entry.startDate || entry.start_date || ''),
          endDate: normalizeDate(entry.endDate || entry.end_date || ''),
          description: normalizeText(entry.description || entry.summary || '')
        });
      }
    });
  }

  return entries;
}

/**
 * Extract education entries
 * @param {Object} data
 * @returns {EducationEntry[]}
 */
function extractEducation(data) {
  const entries = [];

  if (!data) {
    return entries;
  }

  // Handle array of education
  if (Array.isArray(data.education)) {
    data.education.forEach(entry => {
      if (entry && typeof entry === 'object') {
        entries.push({
          institution: normalizeText(entry.institution || entry.school || entry.name || ''),
          degree: normalizeText(entry.degree || entry.studyType || ''),
          field: normalizeText(entry.field || entry.area || ''),
          graduationDate: normalizeDate(entry.graduationDate || entry.graduation_date || entry.endDate || entry.end_date || '')
        });
      }
    });
  }

  return entries;
}

/**
 * Extract skills
 * @param {Object} data
 * @returns {string[]}
 */
function extractSkills(data) {
  const skills = [];

  if (!data) {
    return skills;
  }

  // Handle array of skills
  if (Array.isArray(data.skills)) {
    data.skills.forEach(skill => {
      if (typeof skill === 'string') {
        const normalized = normalizeText(skill);
        if (normalized) {
          skills.push(normalized);
        }
      } else if (skill && typeof skill === 'object' && skill.name) {
        const normalized = normalizeText(skill.name);
        if (normalized) {
          skills.push(normalized);
        }
      }
    });
  }

  return [...new Set(skills)]; // Remove duplicates
}

/**
 * Extract certifications
 * @param {Object} data
 * @returns {string[]}
 */
function extractCertifications(data) {
  const certs = [];

  if (!data) {
    return certs;
  }

  // Handle array of certifications
  if (Array.isArray(data.certifications)) {
    data.certifications.forEach(cert => {
      if (typeof cert === 'string') {
        const normalized = normalizeText(cert);
        if (normalized) {
          certs.push(normalized);
        }
      } else if (cert && typeof cert === 'object' && cert.name) {
        const normalized = normalizeText(cert.name);
        if (normalized) {
          certs.push(normalized);
        }
      }
    });
  }

  // Also check for awards field
  if (Array.isArray(data.awards)) {
    data.awards.forEach(award => {
      if (typeof award === 'string') {
        const normalized = normalizeText(award);
        if (normalized) {
          certs.push(normalized);
        }
      } else if (award && typeof award === 'object' && award.title) {
        const normalized = normalizeText(award.title);
        if (normalized) {
          certs.push(normalized);
        }
      }
    });
  }

  return [...new Set(certs)]; // Remove duplicates
}

/**
 * Extract summary
 * @param {Object} data
 * @returns {string}
 */
function extractSummary(data) {
  if (!data) {
    return '';
  }

  const summary = data.summary || data.objective || data.profile || '';
  return normalizeText(summary);
}

/**
 * Extract contact information
 * @param {Object} data
 * @returns {ContactInfo}
 */
function extractContactInfo(data) {
  const contactInfo = {
    email: '',
    phone: '',
    location: ''
  };

  if (!data) {
    return contactInfo;
  }

  // Extract email
  if (data.email) {
    contactInfo.email = normalizeText(data.email);
  } else if (data.contact && data.contact.email) {
    contactInfo.email = normalizeText(data.contact.email);
  }

  // Extract phone
  if (data.phone) {
    contactInfo.phone = normalizeText(data.phone);
  } else if (data.contact && data.contact.phone) {
    contactInfo.phone = normalizeText(data.contact.phone);
  }

  // Extract location
  if (data.location) {
    if (typeof data.location === 'string') {
      contactInfo.location = normalizeText(data.location);
    } else if (data.location.city || data.location.state || data.location.country) {
      const parts = [data.location.city, data.location.state, data.location.country].filter(Boolean);
      contactInfo.location = normalizeText(parts.join(', '));
    }
  } else if (data.contact && data.contact.location) {
    contactInfo.location = normalizeText(data.contact.location);
  }

  return contactInfo;
}

module.exports = {
  extractFromDocument,
  createEmptyResumeData
};
