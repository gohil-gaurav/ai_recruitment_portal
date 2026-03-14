import prisma from '../prisma.js'

/**
 * Execute a function within a database transaction
 * Ensures atomicity - all operations succeed or all rollback
 * @param {Function} callback - Async function to execute within transaction
 * @returns {Promise<any>} Result of the callback function
 * @throws {Error} If transaction fails
 */
export async function withTransaction(callback) {
  try {
    return await prisma.$transaction(async (tx) => {
      return await callback(tx)
    })
  } catch (error) {
    console.error('Transaction failed:', error)
    throw error
  }
}

/**
 * Execute multiple operations in a transaction
 * @param {Array<Function>} operations - Array of async functions to execute
 * @returns {Promise<Array>} Array of results from each operation
 * @throws {Error} If any operation fails
 */
export async function executeInTransaction(operations) {
  try {
    return await prisma.$transaction(async (tx) => {
      const results = []
      for (const operation of operations) {
        const result = await operation(tx)
        results.push(result)
      }
      return results
    })
  } catch (error) {
    console.error('Transaction with multiple operations failed:', error)
    throw error
  }
}

/**
 * Retry a transaction with exponential backoff
 * Useful for handling transient database failures
 * @param {Function} callback - Async function to execute within transaction
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} initialDelayMs - Initial delay in milliseconds (default: 100)
 * @returns {Promise<any>} Result of the callback function
 * @throws {Error} If all retry attempts fail
 */
export async function withTransactionRetry(callback, maxRetries = 3, initialDelayMs = 100) {
  let lastError
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await withTransaction(callback)
    } catch (error) {
      lastError = error
      
      // Don't retry on certain errors
      if (error.code === 'P2002') {
        // Unique constraint violation - don't retry
        throw error
      }
      
      if (attempt < maxRetries - 1) {
        const delayMs = initialDelayMs * Math.pow(2, attempt)
        console.warn(`Transaction attempt ${attempt + 1} failed, retrying in ${delayMs}ms...`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }
  
  console.error(`Transaction failed after ${maxRetries} attempts`)
  throw lastError
}

/**
 * Get database connection status
 * @returns {Promise<boolean>} True if database is connected, false otherwise
 */
export async function isDatabaseConnected() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection check failed:', error)
    return false
  }
}

/**
 * Disconnect from database
 * Should be called during application shutdown
 * @returns {Promise<void>}
 */
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect()
    console.log('Database disconnected')
  } catch (error) {
    console.error('Error disconnecting from database:', error)
  }
}
