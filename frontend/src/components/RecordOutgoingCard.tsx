import { useState } from 'react';
import { Card, Text, Alert } from '@mantine/core';
import classes from '../scss/RecordOutgoingCard.module.scss';
import { InputBoxAmount, InputBoxDescription, InputBoxRecipientName, InputBoxRecipientAddress } from './InputBox';
import { SendButton } from './AuthButton';
import { useContract } from '../hooks/useContract';
import { useMetaMask } from '../hooks/useMetaMask';

/**
 * RecordOutgoingCard component
 * 
 * Matches the structure of GovTransactions.sol contract:
 * - createTrx(uint256 _amount, string calldata _description, address _recipientAddress, string calldata _recipientName)
 * 
 * Transaction struct fields:
 * - id: auto-generated (trxCount)
 * - amount: the value of the transaction
 * - description: short text description
 * - senderAddress: automatically set to msg.sender (the connected wallet)
 * - recipientAddress: who the money was sent to
 * - recipientName: name of the recipient
 */
export function RecordOutgoingCard() {
  // Form state matching contract function parameters
  const [amount, setAmount] = useState('');           // uint256 _amount
  const [description, setDescription] = useState('');  // string calldata _description
  const [recipientAddress, setRecipientAddress] = useState(''); // address _recipientAddress
  const [recipientName, setRecipientName] = useState('');       // string calldata _recipientName

  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { account } = useMetaMask();
  const { createTransaction, loading, error } = useContract();

  const handleSubmit = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    // Validate inputs - matching contract requirements
    if (!amount || !description || !recipientAddress || !recipientName) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate amount is a positive number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }

    // Validate Ethereum address format (40 hex characters after 0x)
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      alert('Please enter a valid Ethereum address (0x followed by 40 hex characters)');
      return;
    }

    try {
      setSuccess(false);
      setTxHash(null);
      
      // Call contract function with parameters in exact order:
      // createTrx(uint256 _amount, string calldata _description, address _recipientAddress, string calldata _recipientName)
      const result = await createTransaction(
        amount,
        description,
        recipientAddress,
        recipientName,
        account // senderAddress is automatically set to msg.sender in the contract
      );

      setSuccess(true);
      setTxHash(result.hash);
      
      // Reset form after successful transaction
      setAmount('');
      setDescription('');
      setRecipientAddress('');
      setRecipientName('');
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  return (
    <Card withBorder radius="md" p="xl" shadow="xl" className={classes.card}>
      <Text fz="lg" className={classes.title} fw={500}>
        Record Outgoing Transaction
      </Text>
      <Text fz="xs" c="dimmed" mt={3} mb="xl">
        Record a new transaction on-chain. Only approved addresses can record transactions.
      </Text>

      {/* Form fields in order matching createTrx function signature */}
      {/* 1. uint256 _amount - The value of the transaction */}
      <InputBoxAmount value={amount} onChange={setAmount} />
      
      {/* 2. string calldata _description - Short text description */}
      <InputBoxDescription value={description} onChange={setDescription} />
      
      {/* 3. address _recipientAddress - Who the money was sent to */}
      <InputBoxRecipientAddress value={recipientAddress} onChange={setRecipientAddress} />
      
      {/* 4. string calldata _recipientName - Name of the recipient */}
      <InputBoxRecipientName value={recipientName} onChange={setRecipientName} />
      
      {error && (
        <Alert color="red" mt="md">
          Error: {error}
        </Alert>
      )}

      {success && txHash && (
        <Alert color="green" mt="md">
          Transaction successful! Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
        </Alert>
      )}

      <SendButton onClick={handleSubmit} disabled={loading} />
    </Card>
  );
}