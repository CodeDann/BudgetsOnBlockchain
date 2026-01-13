import { ethers } from 'ethers';
import dotenv from 'dotenv';
import {
  storeTransaction,
  getLastProcessedBlock,
  updateLastProcessedBlock,
  transactionExists,
} from '../database/db.js';

dotenv.config();

// Contract ABI - only need the event definition
const TRX_LOG_ABI = [
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
];

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || '5000'); // 5 seconds

let provider;
let contract;
let isRunning = false;

/**
 * Initialize the blockchain listener
 */
export async function initializeListener() {
  try {
    console.log('🔗 Connecting to blockchain...');
    console.log(`   RPC URL: ${RPC_URL}`);
    console.log(`   Contract Address: ${CONTRACT_ADDRESS}`);
    
    provider = new ethers.JsonRpcProvider(RPC_URL);
    contract = new ethers.Contract(CONTRACT_ADDRESS, TRX_LOG_ABI, provider);

    // Test connection
    const network = await provider.getNetwork();
    const currentBlock = await provider.getBlockNumber();
    console.log(`✅ Connected to network: ${network.name} (chainId: ${network.chainId})`);
    console.log(`📝 Listening to contract: ${CONTRACT_ADDRESS}`);
    console.log(`📊 Current block: ${currentBlock}`);

    // Verify contract exists by trying to read a public variable
    try {
      // Try to get the contract's trxCount to verify it's accessible
      const fullABI = [
        ...TRX_LOG_ABI,
        {
          inputs: [],
          name: 'trxCount',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ];
      const fullContract = new ethers.Contract(CONTRACT_ADDRESS, fullABI, provider);
      const trxCount = await fullContract.trxCount();
      console.log(`📈 Contract has ${trxCount.toString()} transactions recorded`);
    } catch (error) {
      console.warn('⚠️  Could not read contract state (this is okay if contract has no transactions yet)');
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to initialize blockchain listener:', error);
    throw error;
  }
}

/**
 * Process a TrxLog event and store it in the database
 */
async function processEvent(event) {
  try {
    const {
      args: [govId, trxId, amount, description, senderAddress, recipientAddress, recipientName],
      blockNumber,
      transactionHash,
      index: logIndex,
    } = event;

    // Check if transaction already exists
    const exists = await transactionExists(transactionHash);
    if (exists) {
      console.log(`⏭️  Transaction ${transactionHash} already indexed, skipping...`);
      return;
    }

    // Store transaction
    await storeTransaction({
      trxId: trxId.toString(),
      govId: govId.toString(),
      amount: amount.toString(),
      description,
      senderAddress,
      recipientAddress,
      recipientName,
      blockNumber: blockNumber.toString(),
      transactionHash,
      logIndex,
    });

    console.log(`✅ Indexed transaction #${trxId}: ${description.substring(0, 30)}...`);
  } catch (error) {
    console.error('❌ Error processing event:', error);
    throw error;
  }
}

/**
 * Listen for new events using event filters
 */
export async function startListening() {
  if (isRunning) {
    console.log('⚠️  Listener is already running');
    return;
  }

  isRunning = true;
  console.log('🚀 Starting blockchain event listener...');

  try {
    // Get last processed block
    let fromBlock = await getLastProcessedBlock();
    const currentBlock = await provider.getBlockNumber();
    
    if (fromBlock === 0) {
      // If no previous state, start from block 0 to catch all historical events
      fromBlock = 0;
      console.log(`📊 No previous sync state found. Starting from block 0 (current: ${currentBlock})`);
      console.log(`   This will process all historical events from the contract deployment.`);
    } else {
      console.log(`📊 Resuming from block: ${fromBlock} (current: ${currentBlock})`);
    }

    // Set up event filter
    const filter = contract.filters.TrxLog();

    // Listen for new events
    // Note: contract.on() callback receives args first, then the event object
    contract.on(filter, async (...args) => {
      // The last argument is the event object
      const event = args[args.length - 1];
      console.log(`🔔 New TrxLog event detected at block ${event.blockNumber}`);
      await processEvent(event);
      
      // Update last processed block
      const blockNumber = event.blockNumber;
      await updateLastProcessedBlock(blockNumber);
    });

    // Also process historical events from the last processed block
    console.log(`📚 Processing historical events from block ${fromBlock}...`);
    await processHistoricalEvents(fromBlock);

    // Set up polling to catch up on missed blocks
    setInterval(async () => {
      try {
        const currentBlock = await provider.getBlockNumber();
        const lastProcessed = await getLastProcessedBlock();
        
        if (currentBlock > lastProcessed) {
          console.log(`🔄 Catching up: processing blocks ${lastProcessed + 1} to ${currentBlock}`);
          await processHistoricalEvents(lastProcessed + 1);
        }
      } catch (error) {
        console.error('❌ Error in polling catch-up:', error);
      }
    }, POLL_INTERVAL);

    console.log('✅ Event listener started successfully');
  } catch (error) {
    console.error('❌ Error starting listener:', error);
    isRunning = false;
    throw error;
  }
}

/**
 * Process historical events from a specific block
 */
async function processHistoricalEvents(fromBlock) {
  try {
    const currentBlock = await provider.getBlockNumber();
    const toBlock = Math.min(currentBlock, fromBlock + 1000); // Process in batches of 1000

    if (fromBlock > currentBlock) {
      console.log(`⏭️  No new blocks to process (fromBlock: ${fromBlock}, current: ${currentBlock})`);
      return;
    }

    console.log(`📖 Fetching events from block ${fromBlock} to ${toBlock}...`);

    const filter = contract.filters.TrxLog();
    const events = await contract.queryFilter(filter, fromBlock, toBlock);

    console.log(`📦 Found ${events.length} event(s) to process`);

    if (events.length > 0) {
      for (const event of events) {
        try {
          await processEvent(event);
          
          // Update last processed block after each event
          await updateLastProcessedBlock(event.blockNumber);
        } catch (error) {
          console.error(`❌ Error processing event at block ${event.blockNumber}:`, error.message);
          // Continue with next event even if one fails
        }
      }
    } else {
      // Update last processed block even if no events found
      await updateLastProcessedBlock(toBlock);
    }

    // If we processed a full batch, continue with next batch
    if (toBlock < currentBlock) {
      await processHistoricalEvents(toBlock + 1);
    } else {
      console.log(`✅ Finished processing historical events up to block ${toBlock}`);
    }
  } catch (error) {
    console.error('❌ Error processing historical events:', error);
    // Don't throw - allow the listener to continue
    console.error('   Error details:', error.message);
  }
}

/**
 * Test function to query events directly
 */
export async function testEventQuery(fromBlock = 0, toBlock = 'latest') {
  try {
    console.log(`🧪 Testing event query from block ${fromBlock} to ${toBlock}...`);
    const filter = contract.filters.TrxLog();
    const events = await contract.queryFilter(filter, fromBlock, toBlock);
    console.log(`📦 Found ${events.length} TrxLog event(s)`);
    
    if (events.length > 0) {
      events.forEach((event, index) => {
        console.log(`\n  Event ${index + 1}:`);
        console.log(`    Block: ${event.blockNumber}`);
        console.log(`    Tx Hash: ${event.transactionHash}`);
        console.log(`    Args:`, event.args.map(a => a.toString()));
      });
    }
    
    return events;
  } catch (error) {
    console.error('❌ Error querying events:', error);
    throw error;
  }
}

/**
 * Manually trigger a catch-up to process any missed events
 */
export async function catchUp() {
  try {
    const currentBlock = await provider.getBlockNumber();
    const lastProcessed = await getLastProcessedBlock();
    
    console.log(`🔄 Manual catch-up: processing blocks ${lastProcessed + 1} to ${currentBlock}`);
    await processHistoricalEvents(lastProcessed + 1);
    console.log('✅ Catch-up complete');
  } catch (error) {
    console.error('❌ Error during catch-up:', error);
    throw error;
  }
}

/**
 * Stop the listener
 */
export function stopListening() {
  if (contract) {
    contract.removeAllListeners();
    isRunning = false;
    console.log('🛑 Event listener stopped');
  }
}
