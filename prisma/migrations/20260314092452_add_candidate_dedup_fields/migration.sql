-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "skills" TEXT NOT NULL,
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT,
    "education" TEXT,
    "resumeText" TEXT NOT NULL,
    "resumeFileUrl" TEXT,
    "resumeHash" TEXT,
    "contentHash" TEXT,
    "resumeEmbedding" JSONB,
    "duplicateFlag" BOOLEAN NOT NULL DEFAULT false,
    "pipelineStatus" TEXT NOT NULL DEFAULT 'Applied',
    "linkedin" TEXT,
    "github" TEXT,
    "portfolio" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "summary" TEXT,
    "candidateScore" INTEGER NOT NULL DEFAULT 0,
    "rating" INTEGER,
    "employmentHistory" TEXT,
    "certifications" TEXT,
    "languages" TEXT,
    "salaryExpectation" INTEGER,
    "availability" TEXT NOT NULL DEFAULT 'Available',
    "interviewNotes" TEXT,
    "feedback" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "documentPath" TEXT NOT NULL,
    "extractedData" JSONB NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeduplicationLog" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "newResumeId" TEXT NOT NULL,
    "mostSimilarResumeId" TEXT,
    "similarityScore" DOUBLE PRECISION NOT NULL,
    "differencePercentage" DOUBLE PRECISION NOT NULL,
    "decision" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeduplicationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- CreateIndex
CREATE INDEX "Candidate_resumeHash_idx" ON "Candidate"("resumeHash");

-- CreateIndex
CREATE INDEX "Candidate_contentHash_idx" ON "Candidate"("contentHash");

-- CreateIndex
CREATE INDEX "Resume_candidateId_idx" ON "Resume"("candidateId");

-- CreateIndex
CREATE INDEX "Resume_isActive_idx" ON "Resume"("isActive");

-- CreateIndex
CREATE INDEX "DeduplicationLog_candidateId_idx" ON "DeduplicationLog"("candidateId");

-- CreateIndex
CREATE INDEX "DeduplicationLog_timestamp_idx" ON "DeduplicationLog"("timestamp");

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeduplicationLog" ADD CONSTRAINT "DeduplicationLog_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeduplicationLog" ADD CONSTRAINT "DeduplicationLog_newResumeId_fkey" FOREIGN KEY ("newResumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeduplicationLog" ADD CONSTRAINT "DeduplicationLog_mostSimilarResumeId_fkey" FOREIGN KEY ("mostSimilarResumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;
