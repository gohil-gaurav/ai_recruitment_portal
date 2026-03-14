import prisma from '../prisma.js'

/**
 * Initialize database connection and verify schema
 * @returns {Promise<Object>} Connection status and info
 */
export async function initializeDatabase() {
  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`
    
    // Verify tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    
    const tableNames = tables.map(t => t.table_name)
    const requiredTables = ['Resume', 'DeduplicationLog', 'Candidate']
    const missingTables = requiredTables.filter(t => !tableNames.includes(t))
    
    if (missingTables.length > 0) {
      console.warn(`Missing tables: ${missingTables.join(', ')}`)
      console.warn('Run: npm run prisma:push')
    }
    
    return {
      connected: true,
      tables: tableNames,
      missingTables,
      message: 'Database connection successful',
    }
  } catch (error) {
    console.error('Database initialization failed:', error)
    return {
      connected: false,
      error: error.message,
      message: 'Database connection failed',
    }
  }
}

/**
 * Get database statistics
 * @returns {Promise<Object>} Database statistics
 */
export async function getDatabaseStats() {
  try {
    const candidateCount = await prisma.candidate.count()
    const resumeCount = await prisma.resume.count()
    const deduplicationLogCount = await prisma.deduplicationLog.count()
    
    return {
      candidates: candidateCount,
      resumes: resumeCount,
      deduplicationLogs: deduplicationLogCount,
    }
  } catch (error) {
    console.error('Failed to get database statistics:', error)
    return {
      error: error.message,
    }
  }
}

/**
 * Verify database schema matches expected structure
 * @returns {Promise<Object>} Schema verification result
 */
export async function verifySchema() {
  try {
    // Check Resume table structure
    const resumeColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Resume'
      ORDER BY ordinal_position
    `
    
    // Check DeduplicationLog table structure
    const deduplicationLogColumns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'DeduplicationLog'
      ORDER BY ordinal_position
    `
    
    const expectedResumeColumns = [
      'id', 'candidateId', 'documentPath', 'extractedData',
      'uploadedAt', 'uploadedBy', 'version', 'isActive',
      'createdAt', 'updatedAt'
    ]
    
    const expectedDeduplicationColumns = [
      'id', 'candidateId', 'newResumeId', 'mostSimilarResumeId',
      'similarityScore', 'differencePercentage', 'decision',
      'timestamp', 'userId', 'createdAt'
    ]
    
    const resumeColumnNames = resumeColumns.map(c => c.column_name)
    const deduplicationColumnNames = deduplicationLogColumns.map(c => c.column_name)
    
    const missingResumeColumns = expectedResumeColumns.filter(
      col => !resumeColumnNames.includes(col)
    )
    const missingDeduplicationColumns = expectedDeduplicationColumns.filter(
      col => !deduplicationColumnNames.includes(col)
    )
    
    return {
      valid: missingResumeColumns.length === 0 && missingDeduplicationColumns.length === 0,
      resumeColumns: resumeColumnNames,
      deduplicationLogColumns: deduplicationColumnNames,
      missingResumeColumns,
      missingDeduplicationColumns,
    }
  } catch (error) {
    console.error('Schema verification failed:', error)
    return {
      valid: false,
      error: error.message,
    }
  }
}

/**
 * Create indexes for performance optimization
 * @returns {Promise<Object>} Index creation result
 */
export async function ensureIndexes() {
  try {
    // Indexes are defined in schema.prisma, but we can verify they exist
    const resumeIndexes = await prisma.$queryRaw`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'Resume'
    `
    
    const deduplicationIndexes = await prisma.$queryRaw`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'DeduplicationLog'
    `
    
    return {
      resumeIndexes: resumeIndexes.map(i => i.indexname),
      deduplicationIndexes: deduplicationIndexes.map(i => i.indexname),
    }
  } catch (error) {
    console.error('Index verification failed:', error)
    return {
      error: error.message,
    }
  }
}
