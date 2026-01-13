// Contract configuration
export const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
export const RPC_URL = 'http://127.0.0.1:8545'; // Local Hardhat node

// Contract ABI - Full ABI from deployment artifacts
export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'string', name: '_GovName', type: 'string' },
      { internalType: 'uint256', name: '_GovId', type: 'uint256' },
      { internalType: 'address', name: '_RegulatorContractAddress', type: 'address' },
      { internalType: 'address[]', name: '_validAddresses', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'GovId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'trxCount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'description', type: 'string' },
      { indexed: false, internalType: 'address', name: 'senderAddress', type: 'address' },
      { indexed: false, internalType: 'address', name: 'recipientAddress', type: 'address' },
      { indexed: false, internalType: 'string', name: 'recipientName', type: 'string' },
    ],
    name: 'TrxLog',
    type: 'event',
  },
  {
    inputs: [],
    name: 'GovId',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GovName',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'RegulatorContractAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'string', name: '_description', type: 'string' },
      { internalType: 'address', name: '_recipientAddress', type: 'address' },
      { internalType: 'string', name: '_recipientName', type: 'string' },
    ],
    name: 'createTrx',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_trxId', type: 'uint256' }],
    name: 'getTrxAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTrxCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_trxId', type: 'uint256' }],
    name: 'getTrxDescription',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_trxId', type: 'uint256' }],
    name: 'getTrxRecipientAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_trxId', type: 'uint256' }],
    name: 'getTrxRecipientName',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_trxId', type: 'uint256' }],
    name: 'getTrxSenderAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'transactions',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'address', name: 'senderAddress', type: 'address' },
      { internalType: 'address', name: 'recipientAddress', type: 'address' },
      { internalType: 'string', name: 'recipientName', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'trxCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'validAddressArray',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
