/**
 * Text and date normalization utilities for resume deduplication
 */

/**
 * Normalize text by converting to lowercase, trimming whitespace, and removing extra spaces
 * @param {string} text - The text to normalize
 * @returns {string} Normalized text
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Normalize date to YYYY-MM-DD format
 * Handles various date formats: YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY, YYYY-MM, Month YYYY, etc.
 * @param {string} dateString - The date string to normalize
 * @returns {string} Normalized date in YYYY-MM-DD format, or empty string if invalid
 */
function normalizeDate(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return '';
  }

  const trimmed = dateString.trim();
  
  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // YYYY-MM format
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    return trimmed + '-01';
  }

  // MM/DD/YYYY format
  const mmddyyyyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (mmddyyyyMatch) {
    const [, month, day, year] = mmddyyyyMatch;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  // DD/MM/YYYY format (less common, try if MM/DD/YYYY fails)
  const ddmmyyyyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    // Assume MM/DD/YYYY if day > 12, otherwise ambiguous - use MM/DD/YYYY as default
    if (parseInt(day) > 12) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  // Month YYYY format (e.g., "January 2020", "Jan 2020")
  const monthYearMatch = trimmed.match(/^(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{4})$/i);
  if (monthYearMatch) {
    const monthMap = {
      january: '01', february: '02', march: '03', april: '04',
      may: '05', june: '06', july: '07', august: '08',
      september: '09', october: '10', november: '11', december: '12',
      jan: '01', feb: '02', mar: '03', apr: '04',
      may: '05', jun: '06', jul: '07', aug: '08',
      sep: '09', oct: '10', nov: '11', dec: '12'
    };
    const [, month, year] = monthYearMatch;
    const monthNum = monthMap[month.toLowerCase()];
    return `${year}-${monthNum}-01`;
  }

  // YYYY format only
  if (/^\d{4}$/.test(trimmed)) {
    return `${trimmed}-01-01`;
  }

  // If no format matches, return empty string
  return '';
}

module.exports = {
  normalizeText,
  normalizeDate
};
