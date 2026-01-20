# Blockchain Indexer Microservice - Setup Plan

## Overview
This microservice listens to blockchain events from the GovTransactions contract and stores them in a PostgreSQL database running in Docker.

## Architecture
```
Blockchain (Hardhat) → Event Listener → PostgreSQL (Docker) → ChainExplorer (Frontend)
```

## Setup Steps

### 1. Prerequisites
- ✅ Node.js installed
- ✅ Docker and Docker Compose installed
- ✅ Hardhat node running on `http://127.0.0.1:8545`
- ✅ Contract deployed at `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

### 2. Install Dependencies
```bash
cd backend/microservice
npm install
```

### 3. Configure Environment
Create `.env` file in `backend/microservice/`:
```bash
# Database Configuration (matches docker-compose.yml)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=budgets_blockchain
DB_USER=postgres
DB_PASSWORD=postgres

# Blockchain Configuration
RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

# Service Configuration
POLL_INTERVAL=5000
START_BLOCK=0
```

### 4. Start PostgreSQL (Docker)
```bash
# Start PostgreSQL container
npm run docker:up

# Or manually:
docker compose up -d

# Verify it's running
docker compose ps
```

### 5. Set Up Database Schema
```bash
# Wait a few seconds for PostgreSQL to be ready, then:
npm run setup-db

# Or use the all-in-one command:
npm run setup
```

### 6. Start the Indexer
```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

## Docker Commands

| Command | Description |
|---------|-------------|
| `npm run docker:up` | Start PostgreSQL container |
| `npm run docker:down` | Stop and remove container |
| `npm run docker:logs` | View PostgreSQL logs |
| `npm run docker:restart` | Restart PostgreSQL container |
| `npm run setup` | Start Docker + setup database (all-in-one) |

## Verification

### Check Docker Container
```bash
docker compose ps
# Should show: budgets-postgres | Up
```

### Check Database Connection
```bash
# Connect to PostgreSQL
docker exec -it budgets-postgres psql -U postgres -d budgets_blockchain

# List tables
\dt

# Check transactions
SELECT COUNT(*) FROM transactions;

# Exit
\q
```

### Check Indexer Logs
The indexer will show:
- ✅ Connected to network
- ✅ Connected to PostgreSQL database
- ✅ Event listener started
- ✅ Indexed transaction messages

## Troubleshooting

### PostgreSQL not accessible
```bash
# Check if container is running
docker compose ps

# Check logs
npm run docker:logs

# Restart if needed
npm run docker:restart
```

### Database connection errors
- Verify `.env` matches `docker-compose.yml` credentials
- Ensure container is healthy: `docker compose ps`
- Check port 5432 is not used by another service

### No events being indexed
- Verify Hardhat node is running
- Check contract address in `.env` matches deployment
- Verify RPC_URL is correct
- Check indexer logs for errors

## Data Flow

1. **Contract emits event** → `TrxLog(GovId, trxCount, amount, description, senderAddress, recipientAddress, recipientName)`
2. **Event listener catches it** → `blockchainListener.js` processes the event
3. **Stored in database** → `db.js` inserts into `transactions` table
4. **Sync state updated** → `sync_state` table tracks last processed block

## Next Steps (After Setup)

1. ✅ Microservice is running and indexing transactions
2. ⏭️ Create API endpoints to query transactions (for ChainExplorer)
3. ⏭️ Update ChainExplorer component to fetch from API
4. ⏭️ Add search/filter functionality

## File Structure
```
backend/microservice/
├── docker-compose.yml          # PostgreSQL Docker setup
├── .env                        # Environment configuration (create this)
├── package.json                # Dependencies and scripts
├── index.js                    # Main entry point
├── database/
│   ├── schema.sql              # Database schema
│   └── db.js                   # Database operations
├── services/
│   └── blockchainListener.js   # Blockchain event listener
└── scripts/
    └── setup-db.js             # Database setup script
```
