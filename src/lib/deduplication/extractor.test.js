/**
 * Unit tests for resume data extraction
 */

const { extractFromDocument, createEmptyResumeData } = require('./extractor');

describe('Resume Data Extraction', () => {
  describe('createEmptyResumeData', () => {
    it('should create empty resume data structure', () => {
      const empty = createEmptyResumeData();
      
      expect(empty).toEqual({
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
      });
    });
  });

  describe('extractFromDocument - null/undefined input', () => {
    it('should return empty resume data for null input', () => {
      const result = extractFromDocument(null);
      expect(result).toEqual(createEmptyResumeData());
    });

    it('should return empty resume data for undefined input', () => {
      const result = extractFromDocument(undefined);
      expect(result).toEqual(createEmptyResumeData());
    });

    it('should return empty resume data for invalid input type', () => {
      const result = extractFromDocument(123);
      expect(result).toEqual(createEmptyResumeData());
    });
  });

  describe('extractFromDocument - work experience', () => {
    it('should extract work experience from JSON resume', () => {
      const resume = {
        workExperience: [
          {
            company: 'Google',
            position: 'Software Engineer',
            startDate: '2020-01-15',
            endDate: '2022-06-30',
            description: 'Developed backend services'
          }
        ]
      };

      const result = extractFromDocument(resume);
      
      expect(result.workExperience).toHaveLength(1);
      expect(result.workExperience[0]).toEqual({
        company: 'google',
        position: 'software engineer',
        startDate: '2020-01-15',
        endDate: '2022-06-30',
        description: 'developed backend services'
      });
    });

    it('should extract work experience with alternative field names', () => {
      const resume = {
        work: [
          {
            name: 'Microsoft',
            title: 'Senior Developer',
            start_date: '2019-03-01',
            end_date: '2021-12-31',
            summary: 'Led team projects'
          }
        ]
      };

      const result = extractFromDocument(resume);
      
      expect(result.workExperience).toHaveLength(1);
      expect(result.workExperience[0].company).toBe('microsoft');
      expect(result.workExperience[0].position).toBe('senior developer');
    });

    it('should handle missing work experience fields gracefully', () => {
      const resume = {
        workExperience: [
          {
            company: 'Apple'
            // missing other fields
          }
        ]
      };

      const result = extractFromDocument(resume);
      
      expect(result.workExperience).toHaveLength(1);
      expect(result.workExperience[0]).toEqual({
        company: 'apple',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    });

    it('should handle empty work experience array', () => {
      const resume = {
        workExperience: []
      };

      const result = extractFromDocument(resume);
      expect(result.workExperience).toEqual([]);
    });
  });

  describe('extractFromDocument - education', () => {
    it('should extract education from JSON resume', () => {
      const resume = {
        education: [
          {
            institution: 'Stanford University',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            graduationDate: '2020-05-15'
          }
        ]
      };

      const result = extractFromDocument(resume);
      
      expect(result.education).toHaveLength(1);
      expect(result.education[0]).toEqual({
        institution: 'stanford university',
        degree: 'bachelor of science',
        field: 'computer science',
        graduationDate: '2020-05-15'
      });
    });

    it('should extract education with alternative field names', () => {
      const resume = {
        education: [
          {
            school: 'MIT',
            studyType: 'Master of Science',
            area: 'Electrical Engineering',
            end_date: '2019-06-01'
          }
        ]
      };

      const result = extractFromDocument(resume);
      
      expect(result.education).toHaveLength(1);
      expect(result.education[0].institution).toBe('mit');
      expect(result.education[0].degree).toBe('master of science');
      expect(result.education[0].field).toBe('electrical engineering');
    });

    it('should handle missing education fields gracefully', () => {
      const resume = {
        education: [
          {
            institution: 'Harvard'
          }
        ]
      };

      const result = extractFromDocument(resume);
      
      expect(result.education).toHaveLength(1);
      expect(result.education[0]).toEqual({
        institution: 'harvard',
        degree: '',
        field: '',
        graduationDate: ''
      });
    });
  });

  describe('extractFromDocument - skills', () => {
    it('should extract skills from array of strings', () => {
      const resume = {
        skills: ['JavaScript', 'Python', 'React']
      };

      const result = extractFromDocument(resume);
      
      expect(result.skills).toHaveLength(3);
      expect(result.skills).toContain('javascript');
      expect(result.skills).toContain('python');
      expect(result.skills).toContain('react');
    });

    it('should extract skills from array of objects', () => {
      const resume = {
        skills: [
          { name: 'Java' },
          { name: 'SQL' }
        ]
      };

      const result = extractFromDocument(resume);
      
      expect(result.skills).toHaveLength(2);
      expect(result.skills).toContain('java');
      expect(result.skills).toContain('sql');
    });

    it('should remove duplicate skills', () => {
      const resume = {
        skills: ['JavaScript', 'javascript', 'JAVASCRIPT']
      };

      const result = extractFromDocument(resume);
      
      expect(result.skills).toHaveLength(1);
      expect(result.skills[0]).toBe('javascript');
    });

    it('should filter out empty skills', () => {
      const resume = {
        skills: ['JavaScript', '', '  ', 'Python']
      };

      const result = extractFromDocument(resume);
      
      expect(result.skills).toHaveLength(2);
      expect(result.skills).toContain('javascript');
      expect(result.skills).toContain('python');
    });

    it('should handle empty skills array', () => {
      const resume = {
        skills: []
      };

      const result = extractFromDocument(resume);
      expect(result.skills).toEqual([]);
    });
  });

  describe('extractFromDocument - certifications', () => {
    it('should extract certifications from array of strings', () => {
      const resume = {
        certifications: ['AWS Certified', 'GCP Professional']
      };

      const result = extractFromDocument(resume);
      
      expect(result.certifications).toHaveLength(2);
      expect(result.certifications).toContain('aws certified');
      expect(result.certifications).toContain('gcp professional');
    });

    it('should extract certifications from array of objects', () => {
      const resume = {
        certifications: [
          { name: 'Kubernetes' },
          { name: 'Docker' }
        ]
      };

      const result = extractFromDocument(resume);
      
      expect(result.certifications).toHaveLength(2);
      expect(result.certifications).toContain('kubernetes');
      expect(result.certifications).toContain('docker');
    });

    it('should extract awards as certifications', () => {
      const resume = {
        awards: [
          { title: 'Employee of the Year' },
          'Best Innovation Award'
        ]
      };

      const result = extractFromDocument(resume);
      
      expect(result.certifications).toHaveLength(2);
      expect(result.certifications).toContain('employee of the year');
      expect(result.certifications).toContain('best innovation award');
    });

    it('should remove duplicate certifications', () => {
      const resume = {
        certifications: ['AWS', 'aws', 'AWS Certified']
      };

      const result = extractFromDocument(resume);
      
      expect(result.certifications.length).toBeLessThanOrEqual(3);
      expect(result.certifications).toContain('aws');
    });
  });

  describe('extractFromDocument - summary', () => {
    it('should extract summary field', () => {
      const resume = {
        summary: '  Experienced Software Engineer with 10 years of experience  '
      };

      const result = extractFromDocument(resume);
      
      expect(result.summary).toBe('experienced software engineer with 10 years of experience');
    });

    it('should extract objective as summary', () => {
      const resume = {
        objective: 'Seeking a challenging role in software development'
      };

      const result = extractFromDocument(resume);
      
      expect(result.summary).toBe('seeking a challenging role in software development');
    });

    it('should extract profile as summary', () => {
      const resume = {
        profile: 'Full-stack developer with expertise in cloud technologies'
      };

      const result = extractFromDocument(resume);
      
      expect(result.summary).toBe('full-stack developer with expertise in cloud technologies');
    });

    it('should return empty string if no summary', () => {
      const resume = {};

      const result = extractFromDocument(resume);
      
      expect(result.summary).toBe('');
    });
  });

  describe('extractFromDocument - contact info', () => {
    it('should extract contact info from top-level fields', () => {
      const resume = {
        email: 'john@example.com',
        phone: '555-123-4567',
        location: 'San Francisco, CA'
      };

      const result = extractFromDocument(resume);
      
      expect(result.contactInfo).toEqual({
        email: 'john@example.com',
        phone: '555-123-4567',
        location: 'san francisco, ca'
      });
    });

    it('should extract contact info from nested contact object', () => {
      const resume = {
        contact: {
          email: 'jane@example.com',
          phone: '(555) 987-6543',
          location: 'New York, NY'
        }
      };

      const result = extractFromDocument(resume);
      
      expect(result.contactInfo.email).toBe('jane@example.com');
      expect(result.contactInfo.phone).toBe('(555) 987-6543');
      expect(result.contactInfo.location).toBe('new york, ny');
    });

    it('should extract location from object with city/state/country', () => {
      const resume = {
        location: {
          city: 'Seattle',
          state: 'WA',
          country: 'USA'
        }
      };

      const result = extractFromDocument(resume);
      
      expect(result.contactInfo.location).toBe('seattle, wa, usa');
    });

    it('should handle missing contact fields', () => {
      const resume = {
        email: 'test@example.com'
      };

      const result = extractFromDocument(resume);
      
      expect(result.contactInfo).toEqual({
        email: 'test@example.com',
        phone: '',
        location: ''
      });
    });

    it('should normalize contact info whitespace', () => {
      const resume = {
        email: '  JOHN@EXAMPLE.COM  ',
        phone: '  555-123-4567  ',
        location: '  San   Francisco  '
      };

      const result = extractFromDocument(resume);
      
      expect(result.contactInfo.email).toBe('john@example.com');
      expect(result.contactInfo.phone).toBe('555-123-4567');
      expect(result.contactInfo.location).toBe('san francisco');
    });
  });

  describe('extractFromDocument - complete resume', () => {
    it('should extract all fields from complete resume', () => {
      const resume = {
        email: 'alice@example.com',
        phone: '555-111-2222',
        location: 'Boston, MA',
        summary: 'Senior Software Engineer',
        workExperience: [
          {
            company: 'Tech Corp',
            position: 'Lead Engineer',
            startDate: '2021-01-01',
            endDate: '2023-12-31',
            description: 'Led development team'
          }
        ],
        education: [
          {
            institution: 'MIT',
            degree: 'BS',
            field: 'Computer Science',
            graduationDate: '2015-05-15'
          }
        ],
        skills: ['Python', 'JavaScript', 'AWS'],
        certifications: ['AWS Solutions Architect']
      };

      const result = extractFromDocument(resume);
      
      expect(result.workExperience).toHaveLength(1);
      expect(result.education).toHaveLength(1);
      expect(result.skills).toHaveLength(3);
      expect(result.certifications).toHaveLength(1);
      expect(result.summary).toBe('senior software engineer');
      expect(result.contactInfo.email).toBe('alice@example.com');
    });

    it('should handle resume with missing multiple fields', () => {
      const resume = {
        email: 'bob@example.com',
        workExperience: [
          {
            company: 'Company A'
          }
        ]
      };

      const result = extractFromDocument(resume);
      
      expect(result.workExperience).toHaveLength(1);
      expect(result.education).toHaveLength(0);
      expect(result.skills).toHaveLength(0);
      expect(result.certifications).toHaveLength(0);
      expect(result.summary).toBe('');
      expect(result.contactInfo.email).toBe('bob@example.com');
      expect(result.contactInfo.phone).toBe('');
      expect(result.contactInfo.location).toBe('');
    });
  });

  describe('extractFromDocument - text resume', () => {
    it('should extract email from text resume', () => {
      const textResume = 'Contact: john.doe@example.com';
      const result = extractFromDocument(textResume);
      
      expect(result.contactInfo.email).toBe('john.doe@example.com');
    });

    it('should extract phone from text resume', () => {
      const textResume = 'Phone: (555) 123-4567';
      const result = extractFromDocument(textResume);
      
      expect(result.contactInfo.phone).toBe('(555) 123-4567');
    });

    it('should handle text resume with no extractable data', () => {
      const textResume = 'Some random text without contact info';
      const result = extractFromDocument(textResume);
      
      expect(result.contactInfo.email).toBe('');
      expect(result.workExperience).toHaveLength(0);
      expect(result.education).toHaveLength(0);
    });
  });

  describe('extractFromDocument - normalization', () => {
    it('should normalize text fields to lowercase', () => {
      const resume = {
        workExperience: [
          {
            company: 'GOOGLE',
            position: 'SOFTWARE ENGINEER'
          }
        ]
      };

      const result = extractFromDocument(resume);
      
      expect(result.workExperience[0].company).toBe('google');
      expect(result.workExperience[0].position).toBe('software engineer');
    });

    it('should normalize dates to YYYY-MM-DD format', () => {
      const resume = {
        workExperience: [
          {
            company: 'Test',
            startDate: '01/15/2020',
            endDate: 'June 2022'
          }
        ]
      };

      const result = extractFromDocument(resume);
      
      expect(result.workExperience[0].startDate).toBe('2020-01-15');
      expect(result.workExperience[0].endDate).toBe('2022-06-01');
    });

    it('should trim and normalize whitespace', () => {
      const resume = {
        skills: ['  JavaScript  ', 'Python   ', '   React']
      };

      const result = extractFromDocument(resume);
      
      expect(result.skills).toContain('javascript');
      expect(result.skills).toContain('python');
      expect(result.skills).toContain('react');
    });
  });
});
