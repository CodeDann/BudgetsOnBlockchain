import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

export async function addTransaction(transaction) {
  const {
    contract_tx_id, 
    amount,
    description,
    recipient_name,
    trx_hash,
    block_hash,
    block_number,
    block_created_time,
  } = transaction;

  const query = `
    INSERT INTO transactions 
      (contract_tx_id, amount, description, recipient_name, trx_hash, block_hash, block_number, block_created_time)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [
    contract_tx_id, 
    amount,
    description,
    recipient_name,
    trx_hash,
    block_hash,
    block_number,
    block_created_time,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}
