# Design Document: Resume Deduplication Logic

## Overview

The Resume Deduplication Logic is a system component that intelligently compares resumes to distinguish between duplicate uploads and genuinely different resume versions for the same candidate. The system extracts structured data from resumes, normalizes the data, calculates similarity scores using weighted field comparison, and applies an 80% difference threshold to determine whether a new resume should be added as a new entry or treated as a duplicate.

The design focuses on practical implementation with clear data extraction, field-level comparison, and integration into the existing resume upload API.

## Architecture

The system consists of three main layers:

1. **Data Extraction Layer**: Parses resume documents and extracts structured data fields
2. **Comparison Engine**: Calculates similarity scores using weighted field comparison
3. **Decision Logic**: Applies the 80% threshold and integrates with the upload service

### Component Interaction Flow

```
Resume Upload Request
    ↓
Extract Resume Data (new resume)
    ↓
Retrieve Existing Resumes (for candidate)
    ↓
Calculate Similarity Scores (new vs each existing)
    ↓
Find Maximum Similarity
    ↓
Calculate Difference Percentage
    ↓
Apply 80% Threshold
    ↓
Decision: New Entry or Duplicate
    ↓
Store Result & Log Decision
```

## Components and Interfaces

### 1. Resume Data Extractor

**Purpose**: Extract structured data from resume documents

**Input**: Resume document (text or parsed content)

**Output**: Structured resume data object

**Data Structure**:
```
ResumeData {
  workExperience: WorkExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  certifications: string[]
  summary: string
  contactInfo: {
    email: string
    phone: string
    location: string
  }
}

WorkExperienceEntry {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

EducationEntry {
  institution: string
  degree: string
  field: string
  graduationDate: string
}
```

**Key Operations**:
- `extractFromDocument(document)`: Parse resume and extract structured data
- `normalizeText(text)`: Lowercase, trim whitespace, remove extra spaces
- `normalizeDate(dateString)`: Standardize date formats (YYYY-MM or YYYY-MM-DD)

### 2. Similarity Calculator

**Purpose**: Calculate similarity scores between two resume data objects

**Input**: Two ResumeData objects

**Output**: Similarity score (0-100)

**Field Weights**:
- Work Experience: 40%
- Education: 25%
- Skills: 20%
- Certifications: 10%
- Summary: 5%

**Calculation Method**:
1. Calculate field-level similarity for each comparable field
2. Apply weights to each field similarity
3. Sum weighted similarities to get overall score

**Field Comparison Logic**:

- **Work Experience**: Compare company names, positions, and date ranges. Use fuzzy matching for company/position names (e.g., "Google" vs "Google Inc"). Match if 70%+ of entries are similar.
- **Education**: Compare institutions, degrees, and fields. Match if 70%+ of entries are similar.
- **Skills**: Compare skill lists using set intersection. Similarity = (matching skills / total unique skills) × 100
- **Certifications**: Compare certification lists using set intersection. Similarity = (matching certs / total unique certs) × 100
- **Summary**: Use string similarity (Levenshtein distance or similar algorithm) to compare summaries

**Key Operations**:
- `calculateSimilarity(resumeData1, resumeData2)`: Returns 0-100 score
- `calculateFieldSimilarity(field1, field2, fieldType)`: Returns 0-100 score for specific field
- `calculateDifference(similarityScore)`: Returns 100 - similarityScore

### 3. Deduplication Decision Engine

**Purpose**: Apply business logic to determine if resume is duplicate or new entry

**Input**: 
- New resume data
- Candidate ID
- Existing resumes for candidate (if any)

**Output**:
```
DeduplicationResult {
  decision: "NEW_ENTRY" | "DUPLICATE"
  maxSimilarityScore: number
  mostSimilarResumeId: string | null
  differencPercentage: number
  reasoning: string
}
```

**Decision Logic**:
1. If no existing resumes for candidate → NEW_ENTRY
2. Calculate similarity with each existing resume
3. Find maximum similarity score
4. Calculate difference percentage = 100 - maxSimilarityScore
5. If difference percentage ≥ 80% → NEW_ENTRY
6. If difference percentage < 80% → DUPLICATE

**Key Operations**:
- `compareWithExisting(newResumeData, candidateId)`: Returns DeduplicationResult
- `applyThreshold(differencePercentage)`: Returns decision

### 4. Resume Upload Service Integration

**Purpose**: Orchestrate the deduplication process during resume upload

**Integration Points**:
- Receives resume upload request
- Invokes data extraction
- Invokes deduplication decision engine
- Stores result based on decision
- Logs decision for audit

**Workflow**:
```
uploadResume(resumeDocument, candidateId)
  ↓
extractedData = extractor.extract(resumeDocument)
  ↓
result = deduplicationEngine.compareWithExisting(extractedData, candidateId)
  ↓
if result.decision == "NEW_ENTRY":
    store new resume record
    return { status: "added", resumeId: newId }
else:
    return { status: "duplicate", mostSimilarResumeId: result.mostSimilarResumeId }
  ↓
log(result) for audit
```

## Data Models

### Resume Record (Database)

```
Resume {
  id: UUID
  candidateId: UUID
  documentPath: string (S3 or file storage path)
  extractedData: ResumeData (JSON)
  uploadedAt: timestamp
  uploadedBy: string
  version: integer
  isActive: boolean
}
```

### Deduplication Log (Database)

```
DeduplicationLog {
  id: UUID
  candidateId: UUID
  newResumeId: UUID
  mostSimilarResumeId: UUID | null
  similarityScore: number
  differencePercentage: number
  decision: "NEW_ENTRY" | "DUPLICATE"
  timestamp: timestamp
  userId: string
}
```

### Database Schema Updates

**New Table: resumes**
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY,
  candidate_id UUID NOT NULL,
  document_path VARCHAR(500) NOT NULL,
  extracted_data JSONB NOT NULL,
  uploaded_at TIMESTAMP NOT NULL,
  uploaded_by VARCHAR(255),
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);

CREATE INDEX idx_resumes_candidate_id ON resumes(candidate_id);
CREATE INDEX idx_resumes_is_active ON resumes(is_active);
```

**New Table: deduplication_logs**
```sql
CREATE TABLE deduplication_logs (
  id UUID PRIMARY KEY,
  candidate_id UUID NOT NULL,
  new_resume_id UUID NOT NULL,
  most_similar_resume_id UUID,
  similarity_score DECIMAL(5,2),
  difference_percentage DECIMAL(5,2),
  decision VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id VARCHAR(255),
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  FOREIGN KEY (new_resume_id) REFERENCES resumes(id),
  FOREIGN KEY (most_similar_resume_id) REFERENCES resumes(id)
);

CREATE INDEX idx_dedup_logs_candidate_id ON deduplication_logs(candidate_id);
CREATE INDEX idx_dedup_logs_timestamp ON deduplication_logs(timestamp);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Before writing the correctness properties, I need to analyze the acceptance criteria for testability.


### Property 1: Similarity Score Range

*For any* pair of resumes, the calculated similarity score shall always be between 0 and 100 (inclusive).

**Validates: Requirements 1.2, 2.3**

### Property 2: Text Normalization Consistency

*For any* two resumes that differ only in text casing and whitespace, the similarity score calculated after normalization shall be identical to the score calculated from their normalized versions.

**Validates: Requirements 1.3**

### Property 3: Reproducible Similarity Calculation

*For any* pair of resumes, calculating the similarity score multiple times shall always produce the same result.

**Validates: Requirements 1.5**

### Property 4: Difference Percentage Formula

*For any* similarity score between 0 and 100, the difference percentage shall equal exactly (100 - similarity_score).

**Validates: Requirements 2.1**

### Property 5: Maximum Similarity Identification

*For any* set of existing resumes and a new resume, the returned maximum similarity score shall be greater than or equal to all individual similarity scores calculated between the new resume and each existing resume.

**Validates: Requirements 3.3, 3.4**

### Property 6: Threshold Decision Consistency

*For any* new resume and candidate with existing resumes, if the difference percentage is ≥ 80%, the decision shall be "NEW_ENTRY"; if the difference percentage is < 80%, the decision shall be "DUPLICATE".

**Validates: Requirements 4.1, 4.2**

### Property 7: Empty Candidate Handling

*For any* candidate with no existing resumes, uploading a new resume shall result in a "NEW_ENTRY" decision.

**Validates: Requirements 4.3**

### Property 8: Deduplication Logging

*For any* resume upload decision, a corresponding log entry shall be created with the correct candidate ID, similarity score, difference percentage, and decision status.

**Validates: Requirements 4.4**

### Property 9: Data Extraction Completeness

*For any* resume document, the extracted data shall contain all expected fields (work experience, education, skills, certifications, summary, contact info) without crashing, even if some fields are empty or missing.

**Validates: Requirements 1.1, 6.1**

### Property 10: Format Normalization

*For any* two resumes with identical content but different formatting or structure, the similarity score shall be the same after normalization.

**Validates: Requirements 6.3**

### Property 11: Transaction Consistency

*For any* resume upload that fails after deduplication analysis, the database shall not contain any partial or inconsistent state related to that upload attempt.

**Validates: Requirements 6.4**

### Property 12: Field Weight Application

*For any* pair of resumes where one field is identical and all other fields differ, the similarity score shall reflect the weight of the identical field (e.g., if only work experience matches, the score should be approximately 40).

**Validates: Requirements 1.4**

## Error Handling

### Missing or Incomplete Data

**Scenario**: Resume has missing fields (e.g., no work experience, empty skills list)

**Handling**:
- Treat missing fields as empty collections or null values
- Skip comparison for missing fields (don't penalize)
- Calculate similarity based only on available fields
- Adjust field weights proportionally if some fields are missing

**Example**:
```
Resume A: has work experience, education, skills
Resume B: has only education and skills

Calculate similarity for:
- Education (25% weight)
- Skills (20% weight)
Normalize weights: education 55.6%, skills 44.4%
```

### No Comparable Data

**Scenario**: Two resumes have no overlapping data (e.g., completely different companies, skills, institutions)

**Handling**:
- Assign default similarity score of 0 (completely different)
- Log this as an edge case
- Still apply threshold logic (0% similarity = 100% difference → NEW_ENTRY)

### Malformed Resume Data

**Scenario**: Resume extraction fails or produces invalid data

**Handling**:
- Catch extraction errors and return a structured error response
- Don't proceed with deduplication if extraction fails
- Return error to upload service with clear message
- Log the error for debugging

### Database Failures

**Scenario**: Database operations fail during resume storage or logging

**Handling**:
- Use transactions to ensure atomicity
- If storage fails, rollback any partial writes
- Return error to client without storing partial state
- Log the failure for monitoring

### Concurrent Uploads

**Scenario**: Multiple resumes uploaded simultaneously for same candidate

**Handling**:
- Use database locks or optimistic concurrency control
- Each upload independently retrieves existing resumes at time of comparison
- Ensure each decision is based on consistent snapshot of data
- Log all decisions for audit trail

## Testing Strategy

### Unit Testing

Unit tests verify specific examples, edge cases, and error conditions:

1. **Data Extraction Tests**
   - Extract from well-formed resume → verify all fields present
   - Extract from resume with missing fields → verify graceful handling
   - Extract from malformed resume → verify error handling
   - Normalize text with various casing/whitespace → verify consistency

2. **Similarity Calculation Tests**
   - Identical resumes → similarity = 100
   - Completely different resumes → similarity = 0
   - Resumes with partial matches → verify weighted calculation
   - Empty resumes → verify default score

3. **Threshold Logic Tests**
   - Difference ≥ 80% → decision = NEW_ENTRY
   - Difference < 80% → decision = DUPLICATE
   - No existing resumes → decision = NEW_ENTRY
   - Verify logging occurs for each decision

4. **Integration Tests**
   - Upload resume for new candidate → verify NEW_ENTRY decision
   - Upload similar resume → verify DUPLICATE decision
   - Upload different resume → verify NEW_ENTRY decision
   - Verify database state after each upload

5. **Error Handling Tests**
   - Upload with missing fields → verify no crash
   - Database failure during storage → verify rollback
   - Concurrent uploads → verify consistency

### Property-Based Testing

Property-based tests verify universal properties across many generated inputs:

1. **Property 1: Similarity Score Range**
   - Generate random resume pairs
   - Calculate similarity
   - Verify score is always 0-100
   - Minimum 100 iterations

2. **Property 2: Text Normalization Consistency**
   - Generate resume with specific content
   - Create variant with different casing/whitespace
   - Calculate similarity for both
   - Verify scores are identical
   - Minimum 100 iterations

3. **Property 3: Reproducible Similarity**
   - Generate random resume pair
   - Calculate similarity twice
   - Verify both calculations match
   - Minimum 100 iterations

4. **Property 4: Difference Percentage Formula**
   - Generate random similarity scores (0-100)
   - Calculate difference percentage
   - Verify formula: difference = 100 - similarity
   - Minimum 100 iterations

5. **Property 5: Maximum Similarity Identification**
   - Generate new resume and 3-5 existing resumes
   - Calculate similarity for each pair
   - Verify returned max matches actual maximum
   - Minimum 100 iterations

6. **Property 6: Threshold Decision Consistency**
   - Generate resume pairs with various similarity scores
   - Apply threshold logic
   - Verify decisions match threshold rules
   - Minimum 100 iterations

7. **Property 7: Empty Candidate Handling**
   - Create candidate with no resumes
   - Upload new resume
   - Verify decision = NEW_ENTRY
   - Minimum 50 iterations

8. **Property 8: Deduplication Logging**
   - Upload resume with known decision
   - Query deduplication logs
   - Verify log entry exists with correct data
   - Minimum 100 iterations

9. **Property 9: Data Extraction Completeness**
   - Generate resumes with various missing fields
   - Extract data
   - Verify no crashes and all available fields extracted
   - Minimum 100 iterations

10. **Property 10: Format Normalization**
    - Generate resume with specific content
    - Create variant with different formatting
    - Calculate similarity
    - Verify scores are identical
    - Minimum 100 iterations

11. **Property 11: Transaction Consistency**
    - Simulate upload failure after deduplication
    - Verify no partial state in database
    - Minimum 50 iterations

12. **Property 12: Field Weight Application**
    - Generate resumes where only one field matches
    - Calculate similarity
    - Verify score approximates field weight
    - Minimum 100 iterations

### Test Configuration

- **Framework**: Use language-appropriate property-based testing library (e.g., Hypothesis for Python, fast-check for JavaScript, QuickCheck for Haskell)
- **Iterations**: Minimum 100 iterations per property test
- **Seed**: Use fixed seeds for reproducibility
- **Shrinking**: Enable automatic shrinking to find minimal failing examples
- **Tagging**: Each test tagged with format: `Feature: resume-deduplication-logic, Property {number}: {property_text}`

### Coverage Goals

- Unit tests: 90%+ code coverage
- Property tests: All 12 properties implemented
- Integration tests: All workflows (new entry, duplicate, error cases)
- Edge cases: Missing data, empty resumes, concurrent uploads, database failures
