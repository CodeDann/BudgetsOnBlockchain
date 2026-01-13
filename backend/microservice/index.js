import dotenv from 'dotenv';
import { initializeListener, startListening, stopListening } from './services/blockchainListener.js';
import { closePool } from './database/db.js';

dotenv.config();

console.log('🚀 Starting Blockchain Indexer Microservice...');
console.log('📋 Configuration:');
console.log(`   RPC URL: ${process.env.RPC_URL || 'http://127.0.0.1:8545'}`);
console.log(`   Contract: ${process.env.CONTRACT_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'}`);
console.log(`   DB: ${process.env.DB_NAME || 'budgets_blockchain'}`);

// Graceful shutdown handler
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  
  try {
    stopListening();
    await closePool();
    console.log('✅ Shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  shutdown('uncaughtException');
});

// Start the service
(async () => {
  try {
    await initializeListener();
    await startListening();
    console.log('✅ Blockchain Indexer is running. Press Ctrl+C to stop.');
  } catch (error) {
    console.error('❌ Failed to start service:', error);
    process.exit(1);
  }
})();
