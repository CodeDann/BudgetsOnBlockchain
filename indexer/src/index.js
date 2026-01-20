import { addTransaction } from './db.js';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import contractAbi from '../../backend/artifacts/contracts/GovTransactions.sol/GovTransactions.json' assert { type: 'json' }; // ABI of GovTransactions

dotenv.config();

// Connect to local Hardhat node
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

// Address of your deployed GovTransactions contract
const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

// Contract instance
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

// Listen specifically for TrxLog events
contract.on('TrxLog', async (GovId, trxCount, amount, description, senderAddress, recipientAddress, recipientName, event) => {
  console.log(`New TrxLog detected in block ${event.blockNumber}, transaction ${event.transactionHash}`);

  const transactionData = {
    contract_tx_id: trxCount, // Use the internal contract transaction ID
    amount: amount.toString(),
    description,
    recipient_name: recipientName,
    sender_address: senderAddress,
    recipient_address: recipientAddress,
    trx_hash: event.transactionHash,
    block_hash: event.blockHash,
    block_number: event.blockNumber,
    block_created_time: new Date(), // optional: could fetch real block timestamp
  };

  try {
    const inserted = await addTransaction(transactionData);
    console.log('Inserted contract transaction into DB:', inserted.contract_tx_id);
  } catch (err) {
    console.error('Error inserting contract transaction:', err);
  }
});

console.log('GovTransactions event listener started...');
