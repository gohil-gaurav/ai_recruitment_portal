import prisma from '../prisma.js'

/**
 * DeduplicationLog Model - Handles database operations for deduplication audit logs
 */
export class DeduplicationLog {
  /**
   * Create a new deduplication log entry
   * @param {Object} data - Log data
   * @param {string} data.candidateId - Candidate ID
   * @param {string} data.newResumeId - ID of the new resume being evaluated
   * @param {string|null} data.mostSimilarResumeId - ID of the most similar existing resume (null if no match)
   * @param {number} data.similarityScore - Similarity score (0-100)
   * @param {number} data.differencePercentage - Difference percentage (0-100)
   * @param {string} data.decision - Decision: "NEW_ENTRY" or "DUPLICATE"
   * @param {string} data.userId - User ID who triggered the upload
   * @returns {Promise<Object>} Created log entry
   */
  static async create(data) {
    return prisma.deduplicationLog.create({
      data: {
        candidateId: data.candidateId,
        newResumeId: data.newResumeId,
        mostSimilarResumeId: data.mostSimilarResumeId || null,
        similarityScore: data.similarityScore,
        differencePercentage: data.differencePercentage,
        decision: data.decision,
        userId: data.userId,
      },
    })
  }

  /**
   * Find log entry by ID
   * @param {string} id - Log entry ID
   * @returns {Promise<Object|null>} Log entry or null
   */
  static async findById(id) {
    return prisma.deduplicationLog.findUnique({
      where: { id },
    })
  }

  /**
   * Find all log entries for a candidate
   * @param {string} candidateId - Candidate ID
   * @returns {Promise<Array>} Array of log entries
   */
  static async findByCandidate(candidateId) {
    return prisma.deduplicationLog.findMany({
      where: { candidateId },
      orderBy: {
        timestamp: 'desc',
      },
    })
  }

  /**
   * Find log entries for a specific resume
   * @param {string} resumeId - Resume ID
   * @returns {Promise<Array>} Array of log entries
   */
  static async findByResume(resumeId) {
    return prisma.deduplicationLog.findMany({
      where: {
        OR: [
          { newResumeId: resumeId },
          { mostSimilarResumeId: resumeId },
        ],
      },
      orderBy: {
        timestamp: 'desc',
      },
    })
  }

  /**
   * Find log entries by decision type
   * @param {string} candidateId - Candidate ID
   * @param {string} decision - Decision type: "NEW_ENTRY" or "DUPLICATE"
   * @returns {Promise<Array>} Array of log entries
   */
  static async findByDecision(candidateId, decision) {
    return prisma.deduplicationLog.findMany({
      where: {
        candidateId,
        decision,
      },
      orderBy: {
        timestamp: 'desc',
      },
    })
  }

  /**
   * Get log entries within a date range
   * @param {string} candidateId - Candidate ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Array of log entries
   */
  static async findByDateRange(candidateId, startDate, endDate) {
    return prisma.deduplicationLog.findMany({
      where: {
        candidateId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    })
  }

  /**
   * Get statistics for a candidate
   * @param {string} candidateId - Candidate ID
   * @returns {Promise<Object>} Statistics object
   */
  static async getStatistics(candidateId) {
    const logs = await prisma.deduplicationLog.findMany({
      where: { candidateId },
    })

    const newEntries = logs.filter(log => log.decision === 'NEW_ENTRY').length
    const duplicates = logs.filter(log => log.decision === 'DUPLICATE').length
    const avgSimilarity = logs.length > 0
      ? logs.reduce((sum, log) => sum + log.similarityScore, 0) / logs.length
      : 0

    return {
      totalUploads: logs.length,
      newEntries,
      duplicates,
      averageSimilarity: Math.round(avgSimilarity * 100) / 100,
    }
  }

  /**
   * Delete log entry
   * @param {string} id - Log entry ID
   * @returns {Promise<Object>} Deleted log entry
   */
  static async delete(id) {
    return prisma.deduplicationLog.delete({
      where: { id },
    })
  }

  /**
   * Delete all logs for a candidate (use with caution)
   * @param {string} candidateId - Candidate ID
   * @returns {Promise<Object>} Result with count of deleted entries
   */
  static async deleteByCandidate(candidateId) {
    return prisma.deduplicationLog.deleteMany({
      where: { candidateId },
    })
  }
}
