import dotenv from 'dotenv';
import { initializeListener, testEventQuery, catchUp } from '../services/blockchainListener.js';
import { closePool } from '../database/db.js';

dotenv.config();

(async () => {
  try {
    console.log('🧪 Testing Blockchain Event Query...\n');
    
    await initializeListener();
    
    // Test querying all events from block 0
    console.log('\n1️⃣ Testing query from block 0 to latest:');
    await testEventQuery(0, 'latest');
    
    // Test catch-up
    console.log('\n2️⃣ Running catch-up:');
    await catchUp();
    
    await closePool();
    console.log('\n✅ Test complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
})();
