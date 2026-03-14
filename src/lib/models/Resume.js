import prisma from '../prisma.js'

/**
 * Resume Model - Handles database operations for Resume records
 */
export class Resume {
  /**
   * Create a new resume record
   * @param {Object} data - Resume data
   * @param {string} data.candidateId - Candidate ID
   * @param {string} data.documentPath - Path to resume document
   * @param {Object} data.extractedData - Extracted resume data (ResumeData structure)
   * @param {string} data.uploadedBy - User who uploaded the resume
   * @returns {Promise<Object>} Created resume record
   */
  static async create(data) {
    return prisma.resume.create({
      data: {
        candidateId: data.candidateId,
        documentPath: data.documentPath,
        extractedData: data.extractedData,
        uploadedBy: data.uploadedBy,
        version: 1,
        isActive: true,
      },
    })
  }

  /**
   * Find resume by ID
   * @param {string} id - Resume ID
   * @returns {Promise<Object|null>} Resume record or null
   */
  static async findById(id) {
    return prisma.resume.findUnique({
      where: { id },
    })
  }

  /**
   * Find all active resumes for a candidate
   * @param {string} candidateId - Candidate ID
   * @returns {Promise<Array>} Array of resume records
   */
  static async findByCandidate(candidateId) {
    return prisma.resume.findMany({
      where: {
        candidateId,
        isActive: true,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    })
  }

  /**
   * Update resume record
   * @param {string} id - Resume ID
   * @param {Object} data - Data to update
   * @returns {Promise<Object>} Updated resume record
   */
  static async update(id, data) {
    return prisma.resume.update({
      where: { id },
      data,
    })
  }

  /**
   * Deactivate a resume (soft delete)
   * @param {string} id - Resume ID
   * @returns {Promise<Object>} Updated resume record
   */
  static async deactivate(id) {
    return prisma.resume.update({
      where: { id },
      data: { isActive: false },
    })
  }

  /**
   * Delete resume permanently
   * @param {string} id - Resume ID
   * @returns {Promise<Object>} Deleted resume record
   */
  static async delete(id) {
    return prisma.resume.delete({
      where: { id },
    })
  }

  /**
   * Get resume count for a candidate
   * @param {string} candidateId - Candidate ID
   * @returns {Promise<number>} Count of active resumes
   */
  static async countByCandidate(candidateId) {
    return prisma.resume.count({
      where: {
        candidateId,
        isActive: true,
      },
    })
  }
}
