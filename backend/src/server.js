import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
// import { ethers } from 'ethers';
import pkg from 'pg';

dotenv.config();
const PORT = process.env.BACKEND_INTERNAL_PORT || 5060;


// --- Express Setup ---
const app = express();
app.use(cors({ origin: '*' }));

// --- Database Setup ---
const { Pool } = pkg;
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});



// --- Blockchain Setup --- maybe backend does not need any blockchain interaction if we do ( Web3 Fronend, Indexer, Backend ) architecture.
// // Using host.docker.internal to reach the Hardhat node on your Mac
// const provider = new ethers.WebSocketProvider(process.env.RPC_URL || "http://host.docker.internal:8545");

// // Default Hardhat Account #0 Private Key
// const privateKey = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// const wallet = new ethers.Wallet(privateKey, provider);

// // Contract Address from your deployment
// const contractAddress = process.env.VITE_CONTRACT_ADDRESS; 
// const contractABI = [
//   "function createTrx(uint256 _amount, string calldata _description, string calldata _recipientName) external"
// ];

// const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// === Endpoints ===

// Fetch all transactions from the database
app.get('/fetch_transactions', async (req, res) => {
    try {
        // Query the database directly
        // Note: Replace 'pool' with whatever your pg pool variable is named
        const result = await pool.query(
            'SELECT * FROM transactions ORDER BY block_created_time DESC'
        );
        
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/ping', (req, res) => res.send('pong\n'));




app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});