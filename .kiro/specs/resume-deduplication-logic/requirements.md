# Requirements Document: Resume Deduplication Logic

## Introduction

This feature implements intelligent resume comparison logic to distinguish between duplicate resume uploads and genuinely different resume versions for the same candidate. The system will calculate the similarity between a new resume and existing resumes, and determine whether to add it as a new entry or treat it as a duplicate based on an 80% difference threshold.

## Glossary

- **Resume**: A document containing candidate employment history, skills, education, and qualifications
- **Candidate**: A person applying for positions
- **Similarity Score**: A percentage value (0-100%) representing how similar two resumes are
- **Difference Percentage**: A percentage value (0-100%) representing how different two resumes are (inverse of similarity)
- **Resume Entry**: A stored resume record associated with a candidate
- **Deduplication Logic**: The system component that determines whether a new resume is a duplicate or a new version
- **Resume Data**: Structured information extracted from a resume (e.g., work experience, education, skills)

## Requirements

### Requirement 1: Calculate Resume Similarity

**User Story:** As a system, I want to calculate the similarity between two resumes, so that I can determine if they represent the same or different versions.

#### Acceptance Criteria

1. WHEN the Deduplication_Logic receives two resumes for comparison, THE Deduplication_Logic SHALL extract comparable data fields from both resumes
2. THE Deduplication_Logic SHALL calculate a similarity score between 0 and 100 representing the percentage of matching data
3. WHEN comparing resume data fields, THE Deduplication_Logic SHALL normalize text (lowercase, trim whitespace) before comparison
4. THE Deduplication_Logic SHALL weight different data fields appropriately (e.g., work experience, education, skills)
5. THE Deduplication_Logic SHALL return a similarity score that is reproducible for the same pair of resumes

### Requirement 2: Determine Difference Percentage

**User Story:** As the system, I want to convert similarity scores to difference percentages, so that I can apply the 80% threshold rule.

#### Acceptance Criteria

1. THE Deduplication_Logic SHALL calculate difference percentage as (100 - similarity_score)
2. WHEN a similarity score is 20, THE Deduplication_Logic SHALL calculate a difference percentage of 80
3. THE Deduplication_Logic SHALL ensure difference percentage is always between 0 and 100

### Requirement 3: Compare New Resume Against Existing Resumes

**User Story:** As the system, I want to compare a new resume against all existing resumes for a candidate, so that I can find the most similar existing resume.

#### Acceptance Criteria

1. WHEN a new resume is uploaded for a candidate, THE Deduplication_Logic SHALL retrieve all existing resumes for that candidate
2. THE Deduplication_Logic SHALL calculate the similarity score between the new resume and each existing resume
3. THE Deduplication_Logic SHALL identify the existing resume with the highest similarity score
4. THE Deduplication_Logic SHALL return the maximum similarity score and the corresponding existing resume ID

### Requirement 4: Apply 80% Difference Threshold

**User Story:** As the system, I want to apply the 80% difference threshold, so that I can decide whether to add a new resume entry or treat it as a duplicate.

#### Acceptance Criteria

1. WHEN the difference percentage between a new resume and the most similar existing resume is 80% or greater, THE Resume_Upload_Service SHALL add the new resume as a new resume entry
2. WHEN the difference percentage is less than 80%, THE Resume_Upload_Service SHALL treat the new resume as a duplicate
3. IF the candidate has no existing resumes, THEN THE Resume_Upload_Service SHALL add the new resume as a new resume entry
4. THE Resume_Upload_Service SHALL log the similarity score and decision (new entry or duplicate) for audit purposes

### Requirement 5: Integrate Deduplication Logic into Resume Upload Process

**User Story:** As a user, I want the deduplication logic to automatically run during resume upload, so that my resumes are properly categorized.

#### Acceptance Criteria

1. WHEN a resume is uploaded, THE Resume_Upload_Service SHALL invoke the Deduplication_Logic before storing the resume
2. THE Resume_Upload_Service SHALL pass the new resume and candidate ID to the Deduplication_Logic
3. WHEN the Deduplication_Logic determines the resume is a new entry, THE Resume_Upload_Service SHALL create a new resume record
4. WHEN the Deduplication_Logic determines the resume is a duplicate, THE Resume_Upload_Service SHALL either update the existing resume or reject the upload based on system policy
5. THE Resume_Upload_Service SHALL return a clear response indicating whether the resume was added as new or treated as duplicate

### Requirement 6: Handle Edge Cases

**User Story:** As the system, I want to handle edge cases gracefully, so that the deduplication logic is robust.

#### Acceptance Criteria

1. IF a resume has missing or incomplete data fields, THEN THE Deduplication_Logic SHALL handle the comparison without crashing
2. IF two resumes have no comparable data, THEN THE Deduplication_Logic SHALL assign a default similarity score
3. WHEN comparing resumes with different formats or structures, THE Deduplication_Logic SHALL normalize them before comparison
4. IF the resume upload fails after deduplication analysis, THEN THE Resume_Upload_Service SHALL not store partial or inconsistent state

