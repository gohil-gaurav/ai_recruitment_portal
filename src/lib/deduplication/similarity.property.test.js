/**
 * Property-based tests for similarity calculation engine
 * Uses fast-check for property-based testing
 */

const fc = require('fast-check');
const {
  calculateWorkExperienceSimilarity,
  calculateEducationSimilarity,
  calculateSkillsSimilarity,
  calculateCertificationsSimilarity,
  calculateSummarySimilarity,
  calculateSimilarity,
  calculateDifference
} = require('./similarity');

describe('Property-Based Tests for Similarity Calculation', () => {
  /**
   * Property 1: Similarity Score Range
   * For any pair of resumes, the calculated similarity score shall always be between 0 and 100 (inclusive).
   * **Validates: Requirements 1.2, 2.3**
   */
  test('Property 1: Similarity Score Range - similarity is always between 0 and 100', () => {
    fc.assert(
      fc.property(
        fc.record({
          workExperience: fc.array(fc.record({
            company: fc.string(),
            position: fc.string(),
            startDate: fc.string(),
            endDate: fc.string(),
            description: fc.string()
          })),
          education: fc.array(fc.record({
            institution: fc.string(),
            degree: fc.string(),
            field: fc.string(),
            graduationDate: fc.string()
          })),
          skills: fc.array(fc.string()),
          certifications: fc.array(fc.string()),
          summary: fc.string()
        }),
        fc.record({
          workExperience: fc.array(fc.record({
            company: fc.string(),
            position: fc.string(),
            startDate: fc.string(),
            endDate: fc.string(),
            description: fc.string()
          })),
          education: fc.array(fc.record({
            institution: fc.string(),
            degree: fc.string(),
            field: fc.string(),
            graduationDate: fc.string()
          })),
          skills: fc.array(fc.string()),
          certifications: fc.array(fc.string()),
          summary: fc.string()
        }),
        (resume1, resume2) => {
          const similarity = calculateSimilarity(resume1, resume2);
          return similarity >= 0 && similarity <= 100;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3: Reproducible Similarity Calculation
   * For any pair of resumes, calculating the similarity score multiple times shall always produce the same result.
   * **Validates: Requirements 1.5**
   */
  test('Property 3: Reproducible Similarity Calculation - same inputs produce same outputs', () => {
    fc.assert(
      fc.property(
        fc.record({
          workExperience: fc.array(fc.record({
            company: fc.string(),
            position: fc.string(),
            startDate: fc.string(),
            endDate: fc.string(),
            description: fc.string()
          })),
          education: fc.array(fc.record({
            institution: fc.string(),
            degree: fc.string(),
            field: fc.string(),
            graduationDate: fc.string()
          })),
          skills: fc.array(fc.string()),
          certifications: fc.array(fc.string()),
          summary: fc.string()
        }),
        fc.record({
          workExperience: fc.array(fc.record({
            company: fc.string(),
            position: fc.string(),
            startDate: fc.string(),
            endDate: fc.string(),
            description: fc.string()
          })),
          education: fc.array(fc.record({
            institution: fc.string(),
            degree: fc.string(),
            field: fc.string(),
            graduationDate: fc.string()
          })),
          skills: fc.array(fc.string()),
          certifications: fc.array(fc.string()),
          summary: fc.string()
        }),
        (resume1, resume2) => {
          const similarity1 = calculateSimilarity(resume1, resume2);
          const similarity2 = calculateSimilarity(resume1, resume2);
          const similarity3 = calculateSimilarity(resume1, resume2);
          return similarity1 === similarity2 && similarity2 === similarity3;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4: Difference Percentage Formula
   * For any similarity score between 0 and 100, the difference percentage shall equal exactly (100 - similarity_score).
   * **Validates: Requirements 2.1**
   */
  test('Property 4: Difference Percentage Formula - difference = 100 - similarity', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100 }),
        (similarityScore) => {
          const difference = calculateDifference(similarityScore);
          const expected = 100 - similarityScore;
          // Use approximate equality due to floating point precision
          return Math.abs(difference - expected) < 0.0001;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 12: Field Weight Application
   * For any pair of resumes where one field is identical and all other fields differ,
   * the similarity score shall reflect the weight of the identical field.
   * **Validates: Requirements 1.4**
   */
  test('Property 12: Field Weight Application - similarity reflects field weights', () => {
    // Test work experience weight (40%)
    fc.assert(
      fc.property(
        fc.array(fc.record({
          company: fc.string({ minLength: 1 }),
          position: fc.string({ minLength: 1 }),
          startDate: fc.string(),
          endDate: fc.string(),
          description: fc.string()
        }), { minLength: 1 }),
        (workExp) => {
          const resume1 = {
            workExperience: workExp,
            education: [],
            skills: [],
            certifications: [],
            summary: ''
          };
          const resume2 = {
            workExperience: workExp, // Same work experience
            education: [],
            skills: [],
            certifications: [],
            summary: ''
          };
          const similarity = calculateSimilarity(resume1, resume2);
          // When only work experience has data and it matches, similarity should be 100
          return similarity === 100;
        }
      ),
      { numRuns: 50 }
    );

    // Test skills weight (20%)
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
        (skills) => {
          const resume1 = {
            workExperience: [],
            education: [],
            skills: skills,
            certifications: [],
            summary: ''
          };
          const resume2 = {
            workExperience: [],
            education: [],
            skills: skills, // Same skills
            certifications: [],
            summary: ''
          };
          const similarity = calculateSimilarity(resume1, resume2);
          // When only skills have data and they match, similarity should be 100
          return similarity === 100;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Additional property test: Field-level similarity ranges
   * Each field-level similarity function should return values between 0 and 100
   */
  test('Field-level similarity functions return values between 0 and 100', () => {
    // Work experience similarity
    fc.assert(
      fc.property(
        fc.array(fc.record({
          company: fc.string(),
          position: fc.string(),
          startDate: fc.string(),
          endDate: fc.string(),
          description: fc.string()
        })),
        fc.array(fc.record({
          company: fc.string(),
          position: fc.string(),
          startDate: fc.string(),
          endDate: fc.string(),
          description: fc.string()
        })),
        (workExp1, workExp2) => {
          const similarity = calculateWorkExperienceSimilarity(workExp1, workExp2);
          return similarity >= 0 && similarity <= 100;
        }
      ),
      { numRuns: 100 }
    );

    // Education similarity
    fc.assert(
      fc.property(
        fc.array(fc.record({
          institution: fc.string(),
          degree: fc.string(),
          field: fc.string(),
          graduationDate: fc.string()
        })),
        fc.array(fc.record({
          institution: fc.string(),
          degree: fc.string(),
          field: fc.string(),
          graduationDate: fc.string()
        })),
        (edu1, edu2) => {
          const similarity = calculateEducationSimilarity(edu1, edu2);
          return similarity >= 0 && similarity <= 100;
        }
      ),
      { numRuns: 100 }
    );

    // Skills similarity
    fc.assert(
      fc.property(
        fc.array(fc.string()),
        fc.array(fc.string()),
        (skills1, skills2) => {
          const similarity = calculateSkillsSimilarity(skills1, skills2);
          return similarity >= 0 && similarity <= 100;
        }
      ),
      { numRuns: 100 }
    );

    // Certifications similarity
    fc.assert(
      fc.property(
        fc.array(fc.string()),
        fc.array(fc.string()),
        (certs1, certs2) => {
          const similarity = calculateCertificationsSimilarity(certs1, certs2);
          return similarity >= 0 && similarity <= 100;
        }
      ),
      { numRuns: 100 }
    );

    // Summary similarity
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        (summary1, summary2) => {
          const similarity = calculateSummarySimilarity(summary1, summary2);
          return similarity >= 0 && similarity <= 100;
        }
      ),
      { numRuns: 100 }
    );
  });
});
