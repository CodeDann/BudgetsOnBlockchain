import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'budgets_blockchain',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Store a transaction in the database
 * @param {Object} transaction - Transaction data from blockchain event
 * @returns {Promise<Object>} - Inserted transaction record
 */
export async function storeTransaction(transaction) {
  const {
    trxId,
    govId,
    amount,
    description,
    senderAddress,
    recipientAddress,
    recipientName,
    blockNumber,
    transactionHash,
    logIndex,
  } = transaction;

  const query = `
    INSERT INTO transactions (
      trx_id, gov_id, amount, description, 
      sender_address, recipient_address, recipient_name,
      block_number, transaction_hash, log_index
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (trx_id) DO UPDATE SET
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [
      trxId,
      govId,
      amount.toString(), // Convert BigInt to string for NUMERIC type
      description,
      senderAddress,
      recipientAddress,
      recipientName,
      blockNumber,
      transactionHash,
      logIndex,
    ]);

    return result.rows[0];
  } catch (error) {
    console.error('Error storing transaction:', error);
    throw error;
  }
}

/**
 * Get the last processed block number
 * @returns {Promise<number>} - Last processed block number
 */
export async function getLastProcessedBlock() {
  const query = 'SELECT last_processed_block FROM sync_state WHERE id = 1';
  
  try {
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      return 0;
    }
    return parseInt(result.rows[0].last_processed_block);
  } catch (error) {
    console.error('Error getting last processed block:', error);
    return 0;
  }
}

/**
 * Update the last processed block number
 * @param {number} blockNumber - Block number to set
 */
export async function updateLastProcessedBlock(blockNumber) {
  const query = `
    UPDATE sync_state 
    SET last_processed_block = $1, last_updated = CURRENT_TIMESTAMP
    WHERE id = 1
  `;

  try {
    await pool.query(query, [blockNumber]);
  } catch (error) {
    console.error('Error updating last processed block:', error);
    throw error;
  }
}

/**
 * Check if a transaction already exists
 * @param {string} transactionHash - Transaction hash
 * @returns {Promise<boolean>} - True if transaction exists
 */
export async function transactionExists(transactionHash) {
  const query = 'SELECT 1 FROM transactions WHERE transaction_hash = $1 LIMIT 1';
  
  try {
    const result = await pool.query(query, [transactionHash]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error checking transaction existence:', error);
    return false;
  }
}

/**
 * Get all transactions (for API endpoints later)
 * @param {number} limit - Maximum number of transactions to return
 * @param {number} offset - Number of transactions to skip
 * @returns {Promise<Array>} - Array of transactions
 */
export async function getTransactions(limit = 100, offset = 0) {
  const query = `
    SELECT * FROM transactions 
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2
  `;

  try {
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
}

/**
 * Close the database connection pool
 */
export async function closePool() {
  await pool.end();
}

export default pool;
