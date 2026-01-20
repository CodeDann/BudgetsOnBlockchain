import { addTransaction } from './db.js';

// Function to generate dummy transaction data
function generateTransaction() {
  const contract_tx_id = Math.floor(Math.random() * 1000000); // Added this
  const amount = (Math.random() * 10).toFixed(2);
  const description = `Transaction ${contract_tx_id}`;
  const recipient_name = `Recipient ${Math.floor(Math.random() * 100)}`;
  const trx_hash = `0x${Math.floor(Math.random() * 1e16).toString(16)}`;
  const block_hash = `0x${Math.floor(Math.random() * 1e16).toString(16)}`;
  const block_number = Math.floor(Math.random() * 10000000);
  const block_created_time = new Date();

  return {
    contract_tx_id,       // include it here
    amount,
    description,
    recipient_name,
    trx_hash,
    block_hash,
    block_number,
    block_created_time,
  };
}

// Insert every 60s
setInterval(async () => {
  try {
    const transaction = generateTransaction();
    const inserted = await addTransaction(transaction);
    console.log(transaction);
    console.log('Inserted transaction:', inserted);
  } catch (err) {
    console.error('Error inserting transaction:', err);
  }
}, 60 * 100); // 60,000 ms = 1 minute

console.log('Transaction writer service started...');
