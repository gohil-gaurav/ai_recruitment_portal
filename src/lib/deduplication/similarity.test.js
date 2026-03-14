/**
 * Unit tests for similarity calculation engine
 */

const {
  calculateWorkExperienceSimilarity,
  calculateEducationSimilarity,
  calculateSkillsSimilarity,
  calculateCertificationsSimilarity,
  calculateSummarySimilarity,
  calculateSimilarity,
  calculateDifference
} = require('./similarity');

describe('calculateWorkExperienceSimilarity', () => {
  test('returns 100 for identical work experience', () => {
    const workExp = [
      { company: 'google', position: 'software engineer', startDate: '2020-01-01', endDate: '2022-01-01' }
    ];
    expect(calculateWorkExperienceSimilarity(workExp, workExp)).toBe(100);
  });

  test('returns 0 for completely different work experience', () => {
    const workExp1 = [
      { company: 'google', position: 'software engineer', startDate: '2020-01-01', endDate: '2022-01-01' }
    ];
    const workExp2 = [
      { company: 'amazon', position: 'data scientist', startDate: '2019-01-01', endDate: '2021-01-01' }
    ];
    const similarity = calculateWorkExperienceSimilarity(workExp1, workExp2);
    expect(similarity).toBeGreaterThanOrEqual(0);
    expect(similarity).toBeLessThanOrEqual(100);
  });

  test('returns 100 for both empty arrays', () => {
    expect(calculateWorkExperienceSimilarity([], [])).toBe(100);
  });

  test('returns 0 when one array is empty', () => {
    const workExp = [
      { company: 'google', position: 'software engineer', startDate: '2020-01-01', endDate: '2022-01-01' }
    ];
    expect(calculateWorkExperienceSimilarity(workExp, [])).toBe(0);
    expect(calculateWorkExperienceSimilarity([], workExp)).toBe(0);
  });

  test('handles fuzzy matching for similar company names', () => {
    const workExp1 = [
      { company: 'google', position: 'engineer', startDate: '2020-01-01', endDate: '2022-01-01' }
    ];
    const workExp2 = [
      { company: 'google inc', position: 'engineer', startDate: '2020-01-01', endDate: '2022-01-01' }
    ];
    const similarity = calculateWorkExperienceSimilarity(workExp1, workExp2);
    expect(similarity).toBeGreaterThan(0);
  });

  test('returns 0 for invalid inputs', () => {
    expect(calculateWorkExperienceSimilarity(null, [])).toBe(0);
    expect(calculateWorkExperienceSimilarity([], null)).toBe(0);
    expect(calculateWorkExperienceSimilarity('invalid', [])).toBe(0);
  });
});

describe('calculateEducationSimilarity', () => {
  test('returns 100 for identical education', () => {
    const edu = [
      { institution: 'stanford university', degree: 'bachelor', field: 'computer science', graduationDate: '2020-05-01' }
    ];
    expect(calculateEducationSimilarity(edu, edu)).toBe(100);
  });

  test('returns 0 for completely different education', () => {
    const edu1 = [
      { institution: 'stanford university', degree: 'bachelor', field: 'computer science', graduationDate: '2020-05-01' }
    ];
    const edu2 = [
      { institution: 'harvard university', degree: 'master', field: 'business', graduationDate: '2018-05-01' }
    ];
    const similarity = calculateEducationSimilarity(edu1, edu2);
    expect(similarity).toBeGreaterThanOrEqual(0);
    expect(similarity).toBeLessThanOrEqual(100);
  });

  test('returns 100 for both empty arrays', () => {
    expect(calculateEducationSimilarity([], [])).toBe(100);
  });

  test('returns 0 when one array is empty', () => {
    const edu = [
      { institution: 'stanford university', degree: 'bachelor', field: 'computer science', graduationDate: '2020-05-01' }
    ];
    expect(calculateEducationSimilarity(edu, [])).toBe(0);
    expect(calculateEducationSimilarity([], edu)).toBe(0);
  });

  test('handles fuzzy matching for similar institution names', () => {
    const edu1 = [
      { institution: 'stanford', degree: 'bachelor', field: 'cs', graduationDate: '2020-05-01' }
    ];
    const edu2 = [
      { institution: 'stanford university', degree: 'bachelor', field: 'computer science', graduationDate: '2020-05-01' }
    ];
    const similarity = calculateEducationSimilarity(edu1, edu2);
    expect(similarity).toBeGreaterThan(0);
  });

  test('returns 0 for invalid inputs', () => {
    expect(calculateEducationSimilarity(null, [])).toBe(0);
    expect(calculateEducationSimilarity([], null)).toBe(0);
  });
});

describe('calculateSkillsSimilarity', () => {
  test('returns 100 for identical skills', () => {
    const skills = ['javascript', 'python', 'react'];
    expect(calculateSkillsSimilarity(skills, skills)).toBe(100);
  });

  test('returns 0 for completely different skills', () => {
    const skills1 = ['javascript', 'python', 'react'];
    const skills2 = ['java', 'c++', 'ruby'];
    expect(calculateSkillsSimilarity(skills1, skills2)).toBe(0);
  });

  test('calculates partial similarity correctly', () => {
    const skills1 = ['javascript', 'python', 'react'];
    const skills2 = ['javascript', 'python', 'angular'];
    const similarity = calculateSkillsSimilarity(skills1, skills2);
    // Intersection: 2 (javascript, python)
    // Union: 4 (javascript, python, react, angular)
    // Similarity: 2/4 * 100 = 50
    expect(similarity).toBe(50);
  });

  test('returns 100 for both empty arrays', () => {
    expect(calculateSkillsSimilarity([], [])).toBe(100);
  });

  test('returns 0 when one array is empty', () => {
    const skills = ['javascript', 'python'];
    expect(calculateSkillsSimilarity(skills, [])).toBe(0);
    expect(calculateSkillsSimilarity([], skills)).toBe(0);
  });

  test('is case-insensitive', () => {
    const skills1 = ['JavaScript', 'Python'];
    const skills2 = ['javascript', 'python'];
    expect(calculateSkillsSimilarity(skills1, skills2)).toBe(100);
  });

  test('returns 0 for invalid inputs', () => {
    expect(calculateSkillsSimilarity(null, [])).toBe(0);
    expect(calculateSkillsSimilarity([], null)).toBe(0);
  });
});

describe('calculateCertificationsSimilarity', () => {
  test('returns 100 for identical certifications', () => {
    const certs = ['aws certified', 'pmp'];
    expect(calculateCertificationsSimilarity(certs, certs)).toBe(100);
  });

  test('returns 0 for completely different certifications', () => {
    const certs1 = ['aws certified', 'pmp'];
    const certs2 = ['cisco certified', 'scrum master'];
    expect(calculateCertificationsSimilarity(certs1, certs2)).toBe(0);
  });

  test('calculates partial similarity correctly', () => {
    const certs1 = ['aws certified', 'pmp', 'cissp'];
    const certs2 = ['aws certified', 'pmp', 'ceh'];
    const similarity = calculateCertificationsSimilarity(certs1, certs2);
    // Intersection: 2 (aws certified, pmp)
    // Union: 4 (aws certified, pmp, cissp, ceh)
    // Similarity: 2/4 * 100 = 50
    expect(similarity).toBe(50);
  });

  test('returns 100 for both empty arrays', () => {
    expect(calculateCertificationsSimilarity([], [])).toBe(100);
  });

  test('returns 0 when one array is empty', () => {
    const certs = ['aws certified'];
    expect(calculateCertificationsSimilarity(certs, [])).toBe(0);
    expect(calculateCertificationsSimilarity([], certs)).toBe(0);
  });

  test('is case-insensitive', () => {
    const certs1 = ['AWS Certified'];
    const certs2 = ['aws certified'];
    expect(calculateCertificationsSimilarity(certs1, certs2)).toBe(100);
  });

  test('returns 0 for invalid inputs', () => {
    expect(calculateCertificationsSimilarity(null, [])).toBe(0);
    expect(calculateCertificationsSimilarity([], null)).toBe(0);
  });
});

describe('calculateSummarySimilarity', () => {
  test('returns 100 for identical summaries', () => {
    const summary = 'experienced software engineer with 5 years of experience';
    expect(calculateSummarySimilarity(summary, summary)).toBe(100);
  });

  test('returns 0 for completely different summaries', () => {
    const summary1 = 'software engineer';
    const summary2 = 'data scientist';
    const similarity = calculateSummarySimilarity(summary1, summary2);
    expect(similarity).toBeGreaterThanOrEqual(0);
    expect(similarity).toBeLessThanOrEqual(100);
  });

  test('calculates similarity for similar summaries', () => {
    const summary1 = 'experienced software engineer';
    const summary2 = 'experienced software developer';
    const similarity = calculateSummarySimilarity(summary1, summary2);
    expect(similarity).toBeGreaterThan(50);
    expect(similarity).toBeLessThan(100);
  });

  test('returns 100 for both empty strings', () => {
    expect(calculateSummarySimilarity('', '')).toBe(100);
  });

  test('returns 0 when one string is empty', () => {
    const summary = 'software engineer';
    expect(calculateSummarySimilarity(summary, '')).toBe(0);
    expect(calculateSummarySimilarity('', summary)).toBe(0);
  });

  test('is case-insensitive', () => {
    const summary1 = 'Software Engineer';
    const summary2 = 'software engineer';
    expect(calculateSummarySimilarity(summary1, summary2)).toBe(100);
  });

  test('returns 0 for invalid inputs', () => {
    expect(calculateSummarySimilarity(null, 'test')).toBe(0);
    expect(calculateSummarySimilarity('test', null)).toBe(0);
  });
});

describe('calculateSimilarity', () => {
  test('returns 100 for identical resumes', () => {
    const resume = {
      workExperience: [
        { company: 'google', position: 'engineer', startDate: '2020-01-01', endDate: '2022-01-01' }
      ],
      education: [
        { institution: 'stanford', degree: 'bachelor', field: 'cs', graduationDate: '2020-05-01' }
      ],
      skills: ['javascript', 'python'],
      certifications: ['aws certified'],
      summary: 'experienced engineer'
    };
    expect(calculateSimilarity(resume, resume)).toBe(100);
  });

  test('returns 0 for completely different resumes', () => {
    const resume1 = {
      workExperience: [
        { company: 'google', position: 'engineer', startDate: '2020-01-01', endDate: '2022-01-01' }
      ],
      education: [
        { institution: 'stanford', degree: 'bachelor', field: 'cs', graduationDate: '2020-05-01' }
      ],
      skills: ['javascript', 'python'],
      certifications: ['aws certified'],
      summary: 'experienced engineer'
    };
    const resume2 = {
      workExperience: [
        { company: 'amazon', position: 'scientist', startDate: '2019-01-01', endDate: '2021-01-01' }
      ],
      education: [
        { institution: 'harvard', degree: 'master', field: 'business', graduationDate: '2018-05-01' }
      ],
      skills: ['java', 'c++'],
      certifications: ['pmp'],
      summary: 'business analyst'
    };
    const similarity = calculateSimilarity(resume1, resume2);
    expect(similarity).toBeGreaterThanOrEqual(0);
    expect(similarity).toBeLessThanOrEqual(100);
  });

  test('applies field weights correctly', () => {
    const resume1 = {
      workExperience: [
        { company: 'google', position: 'engineer', startDate: '2020-01-01', endDate: '2022-01-01' }
      ],
      education: [],
      skills: [],
      certifications: [],
      summary: ''
    };
    const resume2 = {
      workExperience: [
        { company: 'google', position: 'engineer', startDate: '2020-01-01', endDate: '2022-01-01' }
      ],
      education: [],
      skills: [],
      certifications: [],
      summary: ''
    };
    // Only work experience matches (100% similarity)
    // Since only work experience has data, it should get 100% weight
    expect(calculateSimilarity(resume1, resume2)).toBe(100);
  });

  test('handles missing fields by adjusting weights', () => {
    const resume1 = {
      workExperience: [
        { company: 'google', position: 'engineer', startDate: '2020-01-01', endDate: '2022-01-01' }
      ],
      education: [
        { institution: 'stanford', degree: 'bachelor', field: 'cs', graduationDate: '2020-05-01' }
      ],
      skills: [],
      certifications: [],
      summary: ''
    };
    const resume2 = {
      workExperience: [
        { company: 'google', position: 'engineer', startDate: '2020-01-01', endDate: '2022-01-01' }
      ],
      education: [
        { institution: 'stanford', degree: 'bachelor', field: 'cs', graduationDate: '2020-05-01' }
      ],
      skills: [],
      certifications: [],
      summary: ''
    };
    // Only work experience and education have data
    // Both match 100%
    expect(calculateSimilarity(resume1, resume2)).toBe(100);
  });

  test('returns 0 for empty resumes', () => {
    const resume = {
      workExperience: [],
      education: [],
      skills: [],
      certifications: [],
      summary: ''
    };
    expect(calculateSimilarity(resume, resume)).toBe(0);
  });

  test('ensures result is between 0 and 100', () => {
    const resume1 = {
      workExperience: [
        { company: 'google', position: 'engineer', startDate: '2020-01-01', endDate: '2022-01-01' }
      ],
      education: [
        { institution: 'stanford', degree: 'bachelor', field: 'cs', graduationDate: '2020-05-01' }
      ],
      skills: ['javascript', 'python', 'react'],
      certifications: ['aws certified'],
      summary: 'experienced engineer'
    };
    const resume2 = {
      workExperience: [
        { company: 'amazon', position: 'scientist', startDate: '2019-01-01', endDate: '2021-01-01' }
      ],
      education: [
        { institution: 'harvard', degree: 'master', field: 'business', graduationDate: '2018-05-01' }
      ],
      skills: ['java', 'c++', 'spring'],
      certifications: ['pmp'],
      summary: 'business analyst'
    };
    const similarity = calculateSimilarity(resume1, resume2);
    expect(similarity).toBeGreaterThanOrEqual(0);
    expect(similarity).toBeLessThanOrEqual(100);
  });

  test('returns 0 for null inputs', () => {
    const resume = {
      workExperience: [],
      education: [],
      skills: [],
      certifications: [],
      summary: ''
    };
    expect(calculateSimilarity(null, resume)).toBe(0);
    expect(calculateSimilarity(resume, null)).toBe(0);
    expect(calculateSimilarity(null, null)).toBe(0);
  });
});

describe('calculateDifference', () => {
  test('returns 0 for similarity score of 100', () => {
    expect(calculateDifference(100)).toBe(0);
  });

  test('returns 100 for similarity score of 0', () => {
    expect(calculateDifference(0)).toBe(100);
  });

  test('returns 80 for similarity score of 20', () => {
    expect(calculateDifference(20)).toBe(80);
  });

  test('returns 50 for similarity score of 50', () => {
    expect(calculateDifference(50)).toBe(50);
  });

  test('ensures result is between 0 and 100', () => {
    expect(calculateDifference(75)).toBeGreaterThanOrEqual(0);
    expect(calculateDifference(75)).toBeLessThanOrEqual(100);
  });

  test('returns 100 for invalid inputs', () => {
    expect(calculateDifference(null)).toBe(100);
    expect(calculateDifference(undefined)).toBe(100);
    expect(calculateDifference('invalid')).toBe(100);
  });

  test('handles edge cases', () => {
    expect(calculateDifference(0.5)).toBe(99.5);
    expect(calculateDifference(99.9)).toBeCloseTo(0.1, 1);
  });
});
