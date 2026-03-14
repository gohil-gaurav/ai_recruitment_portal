# Implementation Plan: Resume Deduplication Logic

## Overview

This implementation plan breaks down the resume deduplication feature into discrete, manageable tasks. The approach follows a layered architecture: database setup, data extraction utilities, similarity calculation engine, deduplication decision logic, integration into the upload API, comprehensive testing with property-based tests for all 12 correctness properties, and error handling.

Each task builds incrementally on previous work, with property-based tests placed close to implementation to catch errors early. All tasks are written in JavaScript.

## Tasks

- [x] 1. Set up database schema and models
  - Create migration files for `resumes` and `deduplication_logs` tables
  - Define database indexes for candidate_id and timestamps
  - Create TypeScript/JavaScript model classes for Resume and DeduplicationLog
  - Set up database connection and transaction support
  - _Requirements: 1.1, 4.4, 6.4_

- [x] 2. Implement resume data extraction utility
  - [x] 2.1 Create ResumeData interface and data structures
    - Define interfaces for ResumeData, WorkExperienceEntry, EducationEntry, ContactInfo
    - Implement text normalization function (lowercase, trim, remove extra spaces)
    - Implement date normalization function (standardize to YYYY-MM-DD format)
    - _Requirements: 1.1, 1.3_
  
  - [ ]* 2.2 Write property test for text normalization consistency
    - **Property 2: Text Normalization Consistency**
    - **Validates: Requirements 1.3**
  
  - [x] 2.3 Implement resume document parser
    - Create extractFromDocument() function to parse resume text/JSON
    - Extract work experience entries with company, position, dates, description
    - Extract education entries with institution, degree, field, graduation date
    - Extract skills, certifications, summary, and contact information
    - Handle missing or incomplete fields gracefully
    - _Requirements: 1.1, 6.1_
  
  - [ ]* 2.4 Write property test for data extraction completeness
    - **Property 9: Data Extraction Completeness**
    - **Validates: Requirements 1.1, 6.1**

- [x] 3. Implement similarity calculation engine
  - [x] 3.1 Create field-level similarity calculators
    - Implement calculateWorkExperienceSimilarity() using fuzzy matching for company/position names
    - Implement calculateEducationSimilarity() comparing institutions, degrees, fields
    - Implement calculateSkillsSimilarity() using set intersection
    - Implement calculateCertificationsSimilarity() using set intersection
    - Implement calculateSummarySimilarity() using Levenshtein distance or similar algorithm
    - _Requirements: 1.2, 1.4_
  
  - [ ]* 3.2 Write property test for field weight application
    - **Property 12: Field Weight Application**
    - **Validates: Requirements 1.4**
  
  - [x] 3.3 Implement overall similarity calculation
    - Create calculateSimilarity(resumeData1, resumeData2) function
    - Apply field weights: Work Experience 40%, Education 25%, Skills 20%, Certifications 10%, Summary 5%
    - Handle missing fields by adjusting weights proportionally
    - Ensure result is always between 0 and 100
    - _Requirements: 1.2, 1.4_
  
  - [ ]* 3.4 Write property test for similarity score range
    - **Property 1: Similarity Score Range**
    - **Validates: Requirements 1.2, 2.3**
  
  - [ ]* 3.5 Write property test for reproducible similarity calculation
    - **Property 3: Reproducible Similarity Calculation**
    - **Validates: Requirements 1.5**
  
  - [x] 3.6 Implement difference percentage calculation
    - Create calculateDifference(similarityScore) function
    - Return 100 - similarityScore
    - Ensure result is always between 0 and 100
    - _Requirements: 2.1, 2.2_
  
  - [ ]* 3.7 Write property test for difference percentage formula
    - **Property 4: Difference Percentage Formula**
    - **Validates: Requirements 2.1**

- [ ] 4. Implement deduplication decision engine
  - [ ] 4.1 Create DeduplicationResult interface and decision logic
    - Define DeduplicationResult with decision, maxSimilarityScore, mostSimilarResumeId, differencePercentage, reasoning
    - Implement applyThreshold(differencePercentage) to return NEW_ENTRY or DUPLICATE
    - _Requirements: 4.1, 4.2_
  
  - [ ]* 4.2 Write property test for threshold decision consistency
    - **Property 6: Threshold Decision Consistency**
    - **Validates: Requirements 4.1, 4.2**
  
  - [ ] 4.3 Implement comparison with existing resumes
    - Create compareWithExisting(newResumeData, candidateId) function
    - Retrieve all existing resumes for candidate from database
    - Calculate similarity score with each existing resume
    - Find maximum similarity score and corresponding resume ID
    - Calculate difference percentage
    - Apply threshold to determine decision
    - _Requirements: 3.3, 3.4, 4.1, 4.2_
  
  - [ ]* 4.4 Write property test for maximum similarity identification
    - **Property 5: Maximum Similarity Identification**
    - **Validates: Requirements 3.3, 3.4**
  
  - [ ] 4.5 Implement empty candidate handling
    - Handle case where candidate has no existing resumes
    - Return NEW_ENTRY decision with null mostSimilarResumeId
    - _Requirements: 4.3_
  
  - [ ]* 4.6 Write property test for empty candidate handling
    - **Property 7: Empty Candidate Handling**
    - **Validates: Requirements 4.3**

- [ ] 5. Implement deduplication logging
  - [ ] 5.1 Create deduplication log storage function
    - Implement logDeduplicationDecision(candidateId, newResumeId, mostSimilarResumeId, similarityScore, differencePercentage, decision, userId) function
    - Store log entry in deduplication_logs table with all required fields
    - Include timestamp and user ID for audit trail
    - _Requirements: 4.4_
  
  - [ ]* 5.2 Write property test for deduplication logging
    - **Property 8: Deduplication Logging**
    - **Validates: Requirements 4.4**

- [ ] 6. Integrate deduplication logic into resume upload API
  - [ ] 6.1 Create resume upload orchestration function
    - Implement uploadResume(resumeDocument, candidateId, userId) function
    - Extract resume data using data extraction utility
    - Invoke deduplication decision engine
    - Store resume document and extracted data based on decision
    - Log deduplication decision
    - Return response indicating NEW_ENTRY or DUPLICATE status
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ] 6.2 Implement transaction management for upload
    - Use database transactions to ensure atomicity
    - Rollback all changes if any step fails
    - Ensure no partial or inconsistent state is stored
    - _Requirements: 6.4_
  
  - [ ]* 6.3 Write property test for transaction consistency
    - **Property 11: Transaction Consistency**
    - **Validates: Requirements 6.4**
  
  - [ ] 6.4 Implement format normalization in upload flow
    - Normalize resume data before comparison
    - Handle different resume formats and structures
    - _Requirements: 6.3_
  
  - [ ]* 6.5 Write property test for format normalization
    - **Property 10: Format Normalization**
    - **Validates: Requirements 6.3**

- [ ] 7. Implement error handling and edge cases
  - [ ] 7.1 Handle missing or incomplete resume data
    - Gracefully handle resumes with missing fields
    - Skip comparison for missing fields without crashing
    - Adjust field weights proportionally for available fields
    - _Requirements: 6.1_
  
  - [ ] 7.2 Handle no comparable data scenario
    - Assign default similarity score of 0 when no overlapping data exists
    - Log edge case for debugging
    - Apply threshold logic normally (0% similarity = 100% difference = NEW_ENTRY)
    - _Requirements: 6.2_
  
  - [ ] 7.3 Handle malformed resume data
    - Catch extraction errors and return structured error response
    - Don't proceed with deduplication if extraction fails
    - Return clear error message to upload service
    - Log error for monitoring
    - _Requirements: 6.1_
  
  - [ ] 7.4 Handle database failures
    - Implement retry logic for transient failures
    - Use transactions to ensure atomicity
    - Rollback on failure to prevent partial state
    - Return error to client without storing partial data
    - Log failures for monitoring
    - _Requirements: 6.4_
  
  - [ ] 7.5 Handle concurrent uploads
    - Use database locks or optimistic concurrency control
    - Ensure each upload retrieves consistent snapshot of existing resumes
    - Log all decisions for audit trail
    - _Requirements: 3.3, 4.4_

- [ ] 8. Checkpoint - Ensure all core components and tests pass
  - Verify all unit tests pass for data extraction, similarity calculation, and decision logic
  - Verify all property-based tests pass (Properties 1-12)
  - Verify no TypeScript/JavaScript compilation errors
  - Ask the user if questions arise

- [ ] 9. Write comprehensive unit tests
  - [ ] 9.1 Write unit tests for data extraction
    - Test extraction from well-formed resume with all fields
    - Test extraction from resume with missing fields
    - Test extraction from malformed resume with error handling
    - Test text normalization with various casing and whitespace
    - Test date normalization with different date formats
    - _Requirements: 1.1, 1.3, 6.1_
  
  - [ ] 9.2 Write unit tests for similarity calculation
    - Test identical resumes return similarity = 100
    - Test completely different resumes return similarity = 0
    - Test resumes with partial matches verify weighted calculation
    - Test empty resumes return default score
    - Test field-level similarity calculations
    - _Requirements: 1.2, 1.4, 2.1_
  
  - [ ] 9.3 Write unit tests for threshold logic
    - Test difference ≥ 80% returns NEW_ENTRY decision
    - Test difference < 80% returns DUPLICATE decision
    - Test no existing resumes returns NEW_ENTRY decision
    - Test logging occurs for each decision
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 9.4 Write unit tests for error handling
    - Test upload with missing fields doesn't crash
    - Test database failure during storage triggers rollback
    - Test concurrent uploads maintain consistency
    - Test malformed resume data returns error
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 10. Write integration tests
  - [ ] 10.1 Test upload resume for new candidate
    - Upload resume for candidate with no existing resumes
    - Verify NEW_ENTRY decision
    - Verify resume stored in database
    - Verify deduplication log created
    - _Requirements: 4.3, 5.1, 5.2, 5.3_
  
  - [ ] 10.2 Test upload similar resume
    - Upload resume similar to existing resume (< 80% difference)
    - Verify DUPLICATE decision
    - Verify deduplication log created with correct similarity score
    - Verify no new resume stored
    - _Requirements: 4.1, 4.2, 4.4, 5.4_
  
  - [ ] 10.3 Test upload different resume
    - Upload resume significantly different from existing resume (≥ 80% difference)
    - Verify NEW_ENTRY decision
    - Verify new resume stored in database
    - Verify deduplication log created
    - _Requirements: 4.1, 4.2, 4.4, 5.3_
  
  - [ ] 10.4 Test end-to-end upload workflow
    - Upload multiple resumes for same candidate
    - Verify correct decisions for each upload
    - Verify database state is consistent
    - Verify all deduplication logs are accurate
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Verify all unit tests pass (90%+ code coverage)
  - Verify all property-based tests pass (all 12 properties)
  - Verify all integration tests pass
  - Verify no TypeScript/JavaScript compilation errors
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP, but are recommended for production quality
- Each task references specific requirements for traceability
- Checkpoints at steps 8 and 11 ensure incremental validation
- Property tests validate universal correctness properties across many generated inputs
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end workflows
- All code should follow JavaScript/Node.js best practices and conventions
- Use appropriate libraries for fuzzy matching (e.g., fuse.js), Levenshtein distance (e.g., js-levenshtein), and property-based testing (e.g., fast-check)
