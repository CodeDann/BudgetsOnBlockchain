import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_NAME = process.env.DB_NAME || 'budgets_blockchain';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432');
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';

async function setupDatabase() {
  console.log('🗄️  Setting up PostgreSQL database for Blockchain Indexer...\n');

  // First, connect to default 'postgres' database to create our database
  const adminPool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    database: 'postgres', // Connect to default database
    user: DB_USER,
    password: DB_PASSWORD,
  });

  try {
    // Check if database exists
    const dbCheck = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );

    if (dbCheck.rows.length > 0) {
      console.log(`✅ Database '${DB_NAME}' already exists`);
      console.log('📋 Will check and create tables if they don\'t exist...');
    } else {
      // Create database only if it doesn't exist
      console.log(`📦 Creating database '${DB_NAME}'...`);
      await adminPool.query(`CREATE DATABASE ${DB_NAME}`);
      console.log('✅ Database created');
    }

    await adminPool.end();

    // Now connect to the new database to run schema
    const dbPool = new Pool({
      host: DB_HOST,
      port: DB_PORT,
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    console.log('📋 Running schema...');
    const schemaPath = join(__dirname, '../database/schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');

    // Remove comments and split by semicolons
    const statements = schema
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
      .join('\n')
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      if (statement.length > 0) {
        try {
          await dbPool.query(statement);
          successCount++;
        } catch (error) {
          // Ignore "already exists" errors and constraint violations for initial insert
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate key') ||
              error.message.includes('violates check constraint')) {
            // These are expected, count as success
            successCount++;
          } else {
            console.error('❌ Error executing statement:', error.message);
            console.error('Statement:', statement.substring(0, 150));
            errorCount++;
          }
        }
      }
    }

    // Verify tables were created
    console.log('\n🔍 Verifying tables...');
    const tablesCheck = await dbPool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('transactions', 'sync_state')
    `);

    const createdTables = tablesCheck.rows.map(r => r.table_name);
    if (createdTables.includes('transactions') && createdTables.includes('sync_state')) {
      console.log('✅ All required tables exist');
    } else {
      console.error('❌ Missing tables:', {
        transactions: createdTables.includes('transactions'),
        sync_state: createdTables.includes('sync_state')
      });
    }

    // Verify sync_state has data
    try {
      const syncCheck = await dbPool.query('SELECT COUNT(*) FROM sync_state');
      if (parseInt(syncCheck.rows[0].count) === 0) {
        console.log('📝 Inserting initial sync state...');
        await dbPool.query(`
          INSERT INTO sync_state (last_processed_block) 
          VALUES (0)
          ON CONFLICT (id) DO NOTHING
        `);
      }
      console.log('✅ Sync state initialized');
    } catch (error) {
      console.error('❌ Error initializing sync state:', error.message);
    }

    await dbPool.end();

    console.log(`\n📊 Schema execution: ${successCount} statements succeeded, ${errorCount} errors`);

    console.log('\n✅ Database setup complete!');
    console.log('\nNext steps:');
    console.log('1. Make sure your .env file is configured with database credentials');
    console.log('2. Run "npm start" to start the indexer');
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure PostgreSQL is running and accessible.');
      console.error('   If using Docker: docker compose up -d');
      console.error('   If using local install: brew services start postgresql');
    } else if (error.code === '28P01') {
      console.error('\n💡 Authentication failed. Check your DB_USER and DB_PASSWORD in .env');
    }
    process.exit(1);
  }
}

setupDatabase();
