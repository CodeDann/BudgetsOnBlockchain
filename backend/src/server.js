import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers'; // Import ethers

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_INTERNAL_PORT || 5060;

app.use(cors({ origin: '*' }));

// --- Blockchain Setup ---
// Using host.docker.internal to reach the Hardhat node on your Mac
const provider = new ethers.WebSocketProvider(process.env.RPC_URL || "http://host.docker.internal:8545");

// Default Hardhat Account #0 Private Key
const privateKey = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const wallet = new ethers.Wallet(privateKey, provider);

// Contract Address from your deployment
const contractAddress = process.env.VITE_CONTRACT_ADDRESS; 
const contractABI = [
  "function createTrx(uint256 _amount, string calldata _description, string calldata _recipientName) external"
];

const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// === Endpoints ===

// NEW: Trigger a real on-chain transaction
app.get('/trigger', async (req, res) => {
    try {
        console.log("Sending real transaction to Hardhat...");
        
        // Hardcoded dummy data
        const amount = ethers.parseUnits("100", 18); // 100 tokens/wei
        const description = "Test Trx from Backend " + Math.floor(Math.random() * 100);
        const recipient = "Internal Tester";

        // Call the contract
        const tx = await contract.createTrx(amount, description, recipient);
        console.log("Tx Sent! Hash:", tx.hash);

        // Wait for it to be mined
        const receipt = await tx.wait();
        
        res.json({
            message: "Transaction successful!",
            txHash: receipt.hash,
            block: receipt.blockNumber
        });
    } catch (error) {
        console.error("Blockchain Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/ping', (req, res) => res.send('pong\n'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});