import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useMetaMask } from './useMetaMask';

// 1. Human-Readable ABI matching your Solidity Contract exactly
const CONTRACT_ABI = [
  "function createTrx(uint256 _amount, string calldata _description, string calldata _recipientName) external",
  "function trxCount() public view returns (uint256)",
  "event TrxLog(uint256 id, uint256 trxCount, uint256 amount, string description, string recipientName, address proccessedBy)"
];

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
console.log("Using Contract Address:", CONTRACT_ADDRESS);

export function useContract() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { account } = useMetaMask();

  const createTransaction = useCallback(async (
    amount: string, 
    description: string, 
    recipientName: string
  ) => {
    if (!window.ethereum || !account) {
      setError("MetaMask not connected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 2. Initialize Provider and Signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("Using account:", await signer.getAddress());
      // 3. Create Contract Instance
      if (!CONTRACT_ADDRESS) {
        throw new Error("Contract address not defined in environment variables");
      }
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      console.log("Contract instance created with ABI:", CONTRACT_ABI);
      console.log("Contract functions available:", contract);

      // 4. Convert amount to Wei
      // Using parseEther assuming the amount input is in ETH
      const parsedAmount = ethers.parseEther(amount);
      console.log("Parsed Amount:", parsedAmount.toString());


      // 5. Execute Contract Call (matching the 3 arguments in .sol)
      const tx = await contract.createTrx(
        parsedAmount,
        description,
        recipientName
      );

      console.log("Transaction submitted:", tx.hash);

      // 6. Wait for mining (so the Indexer picks up the event)
      const receipt = await tx.wait();
      
      setLoading(false);
      return receipt;
      
    } catch (err: any) {
      setLoading(false);
      // Handle user rejection or contract revert
      const errorMessage = err.reason || err.message || "Transaction failed";
      setError(errorMessage);
      console.error("Contract Error:", err);
      throw err;
    }
  }, [account]);

  return {
    createTransaction,
    loading,
    error
  };
}

