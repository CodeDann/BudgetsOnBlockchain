import { ethers } from 'ethers';
import { addTransaction } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS;

const CONTRACT_ABI = [
  "event TrxLog(uint256 id, uint256 trxCount, uint256 amount, string description, string recipientName, address proccessedBy)"
];

async function startIndexer() {
    // 1. Establish WebSocket Connection
    const provider = new ethers.WebSocketProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    console.log(`🚀 Indexer started. Monitoring contract: ${CONTRACT_ADDRESS}`);

    contract.on("TrxLog", async (id, trxCount, amount, description, recipientName, proccessedBy, event) => {
        try {
            const transaction = {
                contract_tx_id: Number(trxCount),
                amount: ethers.formatEther(amount),
                description: description,
                recipient_name: recipientName,
                
                // Fix: Add the block_hash which is required by your DB
                trx_hash: event.log.transactionHash,
                block_hash: event.log.blockHash, // <--- Add this line
                
                block_number: event.log.blockNumber,
                block_created_time: new Date()
            };

            const inserted = await addTransaction(transaction);
            console.log('✅ Success! Transaction indexed:', inserted.trx_hash);
        } catch (err) {
            console.error('❌ Database insertion error:', err);
        }
    });

    // 3. Keep-alive / Error handling
    provider.on("error", (e) => {
        console.error("WS Provider Error", e);
        // In a real app, you'd trigger a restart here
    });
}

startIndexer();