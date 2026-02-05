import { ethers } from 'ethers';
import { addTransaction } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const RPC_URL = process.env.RPC_URL || "ws://127.0.0.1:8545";
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS;

// 1. Include the functions in the ABI to prevent "Unrecognized Selector" errors 
// during provider background checks/polling.
const CONTRACT_ABI = [
  "function createTrx(uint256 _amount, string _description, string _recipientName)",
  "function trxCount() public view returns (uint256)",
  "event TrxLog(uint256 id, uint256 trxCount, uint256 amount, string description, string recipientName, address proccessedBy)"
];

async function startIndexer() {
    // Ensure we use the WebSocket provider
    const provider = new ethers.WebSocketProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    console.log(`🚀 Indexer started. Monitoring: ${CONTRACT_ADDRESS}`);

    // In Ethers v6, the listener arguments match the event plus the 'event' object at the end
    contract.on("TrxLog", async (id, trxCount, amount, description, recipientName, proccessedBy, log) => {
        try {
            console.log(`📦 New Event Detected: ID ${id}`);
            
            const transaction = {
                contract_tx_id: Number(trxCount),
                amount: ethers.formatEther(amount),
                description: description,
                recipient_name: recipientName,
                
                // Use log object properly for v6
                trx_hash: log.log.transactionHash, 
                block_hash: log.log.blockHash,
                block_number: log.log.blockNumber,
                block_created_time: new Date()
            };

            const inserted = await addTransaction(transaction);
            console.log('✅ Indexed successfully:', inserted.trx_hash);
        } catch (err) {
            console.error('❌ Indexer logic error:', err);
        }
    });

    provider.on("error", (e) => {
        console.error("WS Provider Error:", e);
    });
}

startIndexer();