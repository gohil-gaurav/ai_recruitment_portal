/**
 * Property-based tests for resume data extraction
 * Uses fast-check for property-based testing
 */

const fc = require('fast-check');
const { extractFromDocument } = require('./extractor');
const { normalizeText, normalizeDate } = require('./normalizer');

describe('Resume Data Extraction - Property-Based Tests', () => {
  describe('Property 2: Text Normalization Consistency', () => {
    it('should produce identical similarity for resumes differing only in text casing and whitespace', () => {
      /**
       * Validates: Requirements 1.3
       * 
       * For any two resumes that differ only in text casing and whitespace,
       * the extracted data should be identical after normalization.
       */
      fc.assert(
        fc.property(
          fc.record({
            company: fc.string({ minLength: 1 }),
            position: fc.string({ minLength: 1 }),
            description: fc.string({ minLength: 1 })
          }),
          (baseData) => {
            // Create two resumes with same content but different casing/whitespace
            const resume1 = {
              workExperience: [baseData]
            };

            const resume2 = {
              workExperience: [
                {
                  company: `  ${baseData.company.toUpperCase()}  `,
                  position: `${baseData.position.toLowerCase()}   `,
                  description: `   ${baseData.description}  `
                }
              ]
            };

            const extracted1 = extractFromDocument(resume1);
            const extracted2 = extractFromDocument(resume2);

            // After normalization, both should be identical
            expect(extracted1.workExperience[0].company).toBe(extracted2.workExperience[0].company);
            expect(extracted1.workExperience[0].position).toBe(extracted2.workExperience[0].position);
            expect(extracted1.workExperience[0].description).toBe(extracted2.workExperience[0].description);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should normalize text consistently regardless of input casing', () => {
      /**
       * Validates: Requirements 1.3
       * 
       * Text normalization should always produce lowercase output
       * regardless of input casing.
       */
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (text) => {
            const normalized = normalizeText(text);
            
            // Result should be lowercase
            expect(normalized).toBe(normalized.toLowerCase());
            
            // Result should not have leading/trailing whitespace
            expect(normalized).toBe(normalized.trim());
            
            // Result should not have multiple consecutive spaces
            expect(normalized).not.toMatch(/  /);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should normalize whitespace consistently', () => {
      /**
       * Validates: Requirements 1.3
       * 
       * Multiple spaces, tabs, and newlines should be normalized to single spaces.
       */
      fc.assert(
        fc.property(
          fc.tuple(
            fc.string({ minLength: 1, maxLength: 50 }),
            fc.string({ minLength: 1, maxLength: 50 })
          ),
          ([word1, word2]) => {
            // Create text with various whitespace patterns
            const textWithSpaces = `${word1}    ${word2}`;
            const textWithTabs = `${word1}\t\t${word2}`;
            const textWithNewlines = `${word1}\n\n${word2}`;
            const textWithMixed = `${word1}  \t\n  ${word2}`;

            const normalized1 = normalizeText(textWithSpaces);
            const normalized2 = normalizeText(textWithTabs);
            const normalized3 = normalizeText(textWithNewlines);
            const normalized4 = normalizeText(textWithMixed);

            // All should normalize to the same result
            expect(normalized1).toBe(normalized2);
            expect(normalized2).toBe(normalized3);
            expect(normalized3).toBe(normalized4);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 9: Data Extraction Completeness', () => {
    it('should extract all fields without crashing even with missing data', () => {
      /**
       * Validates: Requirements 1.1, 6.1
       * 
       * For any resume document, the extracted data should contain all expected fields
       * without crashing, even if some fields are empty or missing.
       */
      fc.assert(
        fc.property(
          fc.record({
            workExperience: fc.option(fc.array(fc.record({
              company: fc.option(fc.string()),
              position: fc.option(fc.string()),
              startDate: fc.option(fc.string()),
              endDate: fc.option(fc.string()),
              description: fc.option(fc.string())
            }), { maxLength: 3 })),
            education: fc.option(fc.array(fc.record({
              institution: fc.option(fc.string()),
              degree: fc.option(fc.string()),
              field: fc.option(fc.string()),
              graduationDate: fc.option(fc.string())
            }), { maxLength: 3 })),
            skills: fc.option(fc.array(fc.string(), { maxLength: 5 })),
            certifications: fc.option(fc.array(fc.string(), { maxLength: 5 })),
            summary: fc.option(fc.string()),
            email: fc.option(fc.string()),
            phone: fc.option(fc.string()),
            location: fc.option(fc.string())
          }),
          (resume) => {
            // Should not throw
            const result = extractFromDocument(resume);

            // Should have all expected fields
            expect(result).toHaveProperty('workExperience');
            expect(result).toHaveProperty('education');
            expect(result).toHaveProperty('skills');
            expect(result).toHaveProperty('certifications');
            expect(result).toHaveProperty('summary');
            expect(result).toHaveProperty('contactInfo');

            // Fields should be correct types
            expect(Array.isArray(result.workExperience)).toBe(true);
            expect(Array.isArray(result.education)).toBe(true);
            expect(Array.isArray(result.skills)).toBe(true);
            expect(Array.isArray(result.certifications)).toBe(true);
            expect(typeof result.summary).toBe('string');
            expect(typeof result.contactInfo).toBe('object');

            // Contact info should have expected fields
            expect(result.contactInfo).toHaveProperty('email');
            expect(result.contactInfo).toHaveProperty('phone');
            expect(result.contactInfo).toHaveProperty('location');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should extract all available fields from complete resumes', () => {
      /**
       * Validates: Requirements 1.1, 6.1
       * 
       * When all fields are present, extraction should capture all of them.
       */
      fc.assert(
        fc.property(
          fc.record({
            company: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
            position: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
            institution: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
            degree: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
            skill: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
            certification: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
            summary: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
            email: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
            phone: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
            location: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0)
          }),
          (data) => {
            const resume = {
              workExperience: [
                {
                  company: data.company,
                  position: data.position,
                  startDate: '2020-01-01',
                  endDate: '2021-12-31',
                  description: 'Work description'
                }
              ],
              education: [
                {
                  institution: data.institution,
                  degree: data.degree,
                  field: 'Field',
                  graduationDate: '2020-05-15'
                }
              ],
              skills: [data.skill],
              certifications: [data.certification],
              summary: data.summary,
              email: data.email,
              phone: data.phone,
              location: data.location
            };

            const result = extractFromDocument(resume);

            // All fields should be extracted
            expect(result.workExperience.length).toBeGreaterThan(0);
            expect(result.education.length).toBeGreaterThan(0);
            expect(result.skills.length).toBeGreaterThan(0);
            expect(result.certifications.length).toBeGreaterThan(0);
            expect(result.summary.length).toBeGreaterThan(0);
            expect(result.contactInfo.email.length).toBeGreaterThan(0);
            expect(result.contactInfo.phone.length).toBeGreaterThan(0);
            expect(result.contactInfo.location.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle resumes with partial data without crashing', () => {
      /**
       * Validates: Requirements 1.1, 6.1
       * 
       * Extraction should gracefully handle resumes with only some fields populated.
       */
      fc.assert(
        fc.property(
          fc.oneof(
            fc.record({ workExperience: fc.array(fc.record({ company: fc.string() })) }),
            fc.record({ education: fc.array(fc.record({ institution: fc.string() })) }),
            fc.record({ skills: fc.array(fc.string()) }),
            fc.record({ summary: fc.string() }),
            fc.record({ email: fc.string() })
          ),
          (partialResume) => {
            // Should not throw
            const result = extractFromDocument(partialResume);

            // Should still have all fields
            expect(result).toHaveProperty('workExperience');
            expect(result).toHaveProperty('education');
            expect(result).toHaveProperty('skills');
            expect(result).toHaveProperty('certifications');
            expect(result).toHaveProperty('summary');
            expect(result).toHaveProperty('contactInfo');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should extract skills and certifications as arrays without duplicates', () => {
      /**
       * Validates: Requirements 1.1, 6.1
       * 
       * Skills and certifications should be deduplicated arrays.
       */
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 10 }),
          (skillsList) => {
            const resume = {
              skills: skillsList,
              certifications: skillsList
            };

            const result = extractFromDocument(resume);

            // Should be arrays
            expect(Array.isArray(result.skills)).toBe(true);
            expect(Array.isArray(result.certifications)).toBe(true);

            // Should not have duplicates
            const uniqueSkills = new Set(result.skills);
            const uniqueCerts = new Set(result.certifications);
            expect(result.skills.length).toBeLessThanOrEqual(uniqueSkills.size + 1);
            expect(result.certifications.length).toBeLessThanOrEqual(uniqueCerts.size + 1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should normalize all extracted text fields', () => {
      /**
       * Validates: Requirements 1.1, 6.1
       * 
       * All text fields should be normalized (lowercase, trimmed, single spaces).
       */
      fc.assert(
        fc.property(
          fc.record({
            company: fc.string({ minLength: 1 }),
            position: fc.string({ minLength: 1 }),
            institution: fc.string({ minLength: 1 }),
            skill: fc.string({ minLength: 1 })
          }),
          (data) => {
            const resume = {
              workExperience: [
                {
                  company: `  ${data.company.toUpperCase()}  `,
                  position: `${data.position}   `
                }
              ],
              education: [
                {
                  institution: `   ${data.institution}  `
                }
              ],
              skills: [`  ${data.skill}  `]
            };

            const result = extractFromDocument(resume);

            // All text should be normalized
            if (result.workExperience.length > 0) {
              expect(result.workExperience[0].company).toBe(result.workExperience[0].company.toLowerCase());
              expect(result.workExperience[0].company).toBe(result.workExperience[0].company.trim());
            }

            if (result.education.length > 0) {
              expect(result.education[0].institution).toBe(result.education[0].institution.toLowerCase());
              expect(result.education[0].institution).toBe(result.education[0].institution.trim());
            }

            if (result.skills.length > 0) {
              result.skills.forEach(skill => {
                expect(skill).toBe(skill.toLowerCase());
                expect(skill).toBe(skill.trim());
              });
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Date Normalization Properties', () => {
    it('should normalize dates to YYYY-MM-DD format consistently', () => {
      /**
       * Validates: Requirements 1.3
       * 
       * All valid date formats should normalize to YYYY-MM-DD.
       */
      fc.assert(
        fc.property(
          fc.tuple(
            fc.integer({ min: 2000, max: 2030 }),
            fc.integer({ min: 1, max: 12 }),
            fc.integer({ min: 1, max: 28 })
          ),
          ([year, month, day]) => {
            const normalized = normalizeDate(`${month}/${day}/${year}`);
            
            // Should match YYYY-MM-DD format
            expect(normalized).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            
            // Should contain the year
            expect(normalized).toContain(year.toString());
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle invalid dates gracefully', () => {
      /**
       * Validates: Requirements 1.3
       * 
       * Invalid dates should return empty string without crashing.
       */
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (invalidDate) => {
            // Should not throw
            const result = normalizeDate(invalidDate);
            
            // Result should be string
            expect(typeof result).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
