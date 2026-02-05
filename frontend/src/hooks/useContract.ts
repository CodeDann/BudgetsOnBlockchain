import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from './useMetaMask';

// Human-Readable ABI matching your TransparentTransactions.sol exactly
const CONTRACT_ABI = [
  "function createTrx(uint256 _amount, string calldata _description, string calldata _recipientName)",
  "function trxCount() public view returns (uint256)",
  "function validAddressArray(address) public view returns (bool)",
  "event TrxLog(uint256 id, uint256 trxCount, uint256 amount, string description, string recipientName, address proccessedBy)"
];

// Clean the address: remove spaces or hidden characters that might come from .env
const RAW_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const CONTRACT_ADDRESS = RAW_ADDRESS.trim();

export function useContract() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { account } = useMetaMask();

  const createTransaction = useCallback(async (
    amount: string, 
    description: string, 
    recipientName: string
  ) => {
    console.log("--- Starting Transaction Flow ---");

    // 1. Pre-initialization Checks
    if (!window.ethereum) {
      const msg = "MetaMask not found. Please install the extension.";
      setError(msg);
      return;
    }

    if (!account) {
      const msg = "Wallet not connected. Please connect MetaMask.";
      setError(msg);
      return;
    }

    // Check if address is a valid Ethereum hex string
    if (!ethers.isAddress(CONTRACT_ADDRESS)) {
      const msg = `Invalid Contract Address: "${CONTRACT_ADDRESS}". Check your .env file.`;
      console.error(msg);
      setError(msg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 2. Initialize Provider and Signer
      // "any" allows the provider to stay resilient if the local chain restarts
      const provider = new ethers.BrowserProvider(window.ethereum, "any");
      const signer = await provider.getSigner();
      
      console.log("Debug: Connected Account:", await signer.getAddress());
      console.log("Debug: Target Contract:", CONTRACT_ADDRESS);

      // 3. Network/Bytecode Verification
      // This is the "Truth Test" to see if the contract exists on the current chain
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === "0x" || code === "0x0") {
        throw new Error("Contract not found at this address on the current network. Did you redeploy?");
      }
      console.log("Debug: Contract bytecode verified.");

      // 4. Create Instance
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // 5. Logic Check (The 'approvedAddress' modifier)
      // Call the mapping to see if the user is authorized before sending gas
      console.log("Debug: Checking authorization for:", account);
      const isApproved = await contract.validAddressArray(account);
      if (!isApproved) {
        throw new Error("Your address is not authorized in this contract's whitelist.");
      }

      // 6. Data Formatting
      const parsedAmount = ethers.parseUnits(amount || "0", 18);
      console.log("Debug: Parsed Amount (Wei):", parsedAmount.toString());

      // 7. Execution
      console.log("Debug: Prompting MetaMask for signature...");
      const tx = await contract.createTrx(
        parsedAmount,
        description,
        recipientName
      );

      console.log("Transaction Submitted! Hash:", tx.hash);

      // 8. Wait for mining
      const receipt = await tx.wait();
      console.log("Transaction Mined! Receipt:", receipt);
      
      setLoading(false);
      return receipt;
      
    } catch (err: any) {
      setLoading(false);
      
      // Parse specific ethers errors
      let friendlyError = "Transaction failed";
      
      if (err.code === "ACTION_REJECTED") {
        friendlyError = "User rejected the transaction in MetaMask.";
      } else if (err.message.includes("not authorized")) {
        friendlyError = "Access Denied: You are not an approved address.";
      } else if (err.message.includes("bytecode")) {
        friendlyError = "Contract not found. Ensure MetaMask is on Hardhat (31337).";
      } else {
        friendlyError = err.reason || err.message || friendlyError;
      }

      console.error("Contract Call Failure:", err);
      setError(friendlyError);
      throw err;
    }
  }, [account]);

  return {
    createTransaction,
    loading,
    error
  };
}