import { useCallback, useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contract';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useContract() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = useCallback(async (
    amount: string,
    description: string,
    recipientAddress: string,
    recipientName: string,
    account: string
  ) => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      setLoading(true);
      setError(null);

      // Create provider and signer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(account);

      // Create contract instance
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Convert amount to BigInt
      // Assuming amount is provided as a number string (could be in wei or a larger unit)
      // For now, we'll treat it as the smallest unit. If you need ETH conversion, multiply by 10^18
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum < 0) {
        throw new Error('Invalid amount');
      }
      const amountBigInt = BigInt(Math.floor(amountNum));

      // Call the contract function
      const tx = await contract.createTrx(
        amountBigInt,
        description,
        recipientAddress,
        recipientName
      );

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      return {
        hash: tx.hash,
        receipt,
      };
    } catch (err: any) {
      let errorMessage = 'Transaction failed';
      
      // Check for specific error types
      if (err.reason) {
        errorMessage = err.reason;
      } else if (err.message) {
        errorMessage = err.message;
        // Check for common revert reasons
        if (err.message.includes('Only approved addresses')) {
          errorMessage = 'Your wallet address is not approved to record transactions. Please contact the contract administrator.';
        } else if (err.message.includes('revert') || err.message.includes('reverted')) {
          errorMessage = 'Transaction reverted. Your address may not be approved, or there was an error processing the transaction.';
        }
      } else if (err.data) {
        // Try to decode error data
        errorMessage = 'Transaction reverted. Check that your address is approved in the contract.';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createTransaction,
    loading,
    error,
  };
}
