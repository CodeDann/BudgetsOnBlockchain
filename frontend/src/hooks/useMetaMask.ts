import { useState, useCallback, useEffect } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useMetaMask() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [signing, setSigning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  // Check for MetaMask on mount and clear errors if it's available
  useEffect(() => {
    if (window.ethereum) {
      setError(null);
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            // Check if we have a stored signature for this account
            const storedAuth = localStorage.getItem(`auth_${accounts[0]}`);
            if (storedAuth) {
              const authData = JSON.parse(storedAuth);
              setSignature(authData.signature);
              setIsAuthenticated(true);
            }
          }
        })
        .catch(() => {
          // Silently fail if we can't check accounts
        });
    }
  }, []);

  const connect = useCallback(async () => {
    // Check for MetaMask availability
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      setConnecting(true);
      setError(null);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        // Check if we have a stored signature for this account
        const storedAuth = localStorage.getItem(`auth_${accounts[0]}`);
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          setSignature(authData.signature);
          setIsAuthenticated(true);
        }
      } else {
        setError('No accounts found');
      }
    } catch (err: any) {
      setError(err.message ?? 'Failed to connect to MetaMask');
    } finally {
      setConnecting(false);
    }
  }, []);

  const signMessage = useCallback(async () => {
    if (!account || !window.ethereum) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setSigning(true);
      setError(null);

      // Create a message to sign (EIP-191 format)
      const message = `Connect wallet to Transparent Transactions.\n\nThis allows you to securely process transactions on the blockchain.\n\nWallet: ${account}\n\nThis request will not trigger a blockchain transaction or cost any gas fees.`;
      
      // Request signature using personal_sign (automatically handles EIP-191 prefix)
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account],
      });

      // Store signature and mark as authenticated
      // Note: In production, you should verify the signature on the backend
      // For now, if the user successfully signed, we trust it
      setSignature(signature);
      setIsAuthenticated(true);
      
      // Store authentication in localStorage
      localStorage.setItem(`auth_${account}`, JSON.stringify({
        signature,
        message,
        timestamp: Date.now(),
      }));
    } catch (err: any) {
      if (err.code === 4001) {
        setError('Signature request was rejected');
      } else {
        setError(err.message ?? 'Failed to sign message');
      }
      setIsAuthenticated(false);
      setSignature(null);
    } finally {
      setSigning(false);
    }
  }, [account]);

  return {
    account,
    connect,
    connecting,
    error,
    signMessage,
    signing,
    isAuthenticated,
    signature,
  };
}
