import { useState } from 'react';
import { Card, Text, Alert, Stack } from '@mantine/core';
import classes from '../scss/RecordOutgoingCard.module.scss';
import { InputBoxAmount, InputBoxDescription, InputBoxRecipientName } from './InputBox';
import { SendButton } from './AuthButton';
import { useContract } from '../hooks/useContract';
import { useMetaMask } from '../hooks/useMetaMask';

/**
 * Updated RecordOutgoingCard component
 * * Aligned with TransparentTransactions.sol:
 * function createTrx(uint256 _amount, string calldata _description, string calldata _recipientName)
 */
export function RecordOutgoingCard() {
  // 1. Form state - strictly matching the 3 contract parameters
  const [amount, setAmount] = useState('');           // uint256 _amount
  const [description, setDescription] = useState('');  // string calldata _description
  const [recipientName, setRecipientName] = useState('');       // string calldata _recipientName

  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { account } = useMetaMask();
  
  // Note: Ensure your useContract hook is updated to accept these 3 arguments
  const { createTransaction, loading, error } = useContract();

  const handleSubmit = async () => {
    if (!account) {
      alert('Please connect your wallet first');
      return;
    }

    // 2. Validation Logic
    if (!amount || !description || !recipientName) {
      alert('Please fill in all required fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }

    try {
      setSuccess(false);
      setTxHash(null);
      
      /**
       * 3. Execution
       * We pass exactly 3 arguments to match: 
       * createTrx(_amount, _description, _recipientName)
       */
      const result = await createTransaction(
        amount,
        description,
        recipientName
      );

      setSuccess(true);
      setTxHash(result.hash);
      
      // 4. Reset form
      setAmount('');
      setDescription('');
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
        Only approved addresses can record transactions. Data is indexed to the dashboard automatically.
      </Text>

      <Stack gap="md">
        {/* _amount */}
        <InputBoxAmount value={amount} onChange={setAmount} />
        
        {/* _description */}
        <InputBoxDescription value={description} onChange={setDescription} />
        
        {/* _recipientName */}
        <InputBoxRecipientName value={recipientName} onChange={setRecipientName} />
        
        {error && (
          <Alert color="red" variant="light">
            {error}
          </Alert>
        )}

        {success && txHash && (
          <Alert color="green" variant="light" title="Success!">
            Transaction mined. Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </Alert>
        )}

        <SendButton onClick={handleSubmit} disabled={loading} />
      </Stack>
    </Card>
  );
}