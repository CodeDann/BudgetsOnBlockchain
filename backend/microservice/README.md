# Blockchain Indexer Microservice

This microservice continuously listens to blockchain events from the GovTransactions contract and stores them in a PostgreSQL database.

## Setup

### Quick Start (All-in-One)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (copy from .env.example and adjust if needed)
cp .env.example .env

# 3. Start Docker PostgreSQL and setup database
npm run setup

# 4. Start the indexer
npm start
```

### Detailed Setup

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

The default `.env` matches the Docker setup. No changes needed unless you customize docker-compose.yml.

#### 3. Start PostgreSQL (Docker)
```bash
# Start PostgreSQL container
npm run docker:up

# Or manually:
docker compose up -d

# Verify it's running
docker compose ps
```

#### 4. Set Up Database Schema
```bash
# Wait a few seconds for PostgreSQL to be ready, then:
npm run setup-db
```

#### 5. Run the Service
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
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

Check if everything is working:
```bash
# Check Docker container
docker compose ps

# Check database (connect to PostgreSQL)
docker exec -it budgets-postgres psql -U postgres -d budgets_blockchain -c "SELECT COUNT(*) FROM transactions;"
```

## How It Works

1. **Connects to Blockchain**: Uses ethers.js to connect to the Hardhat node
2. **Listens for Events**: Monitors the `TrxLog` event from the GovTransactions contract
3. **Stores in Database**: Saves each transaction to PostgreSQL
4. **Tracks Progress**: Maintains sync state to avoid duplicate processing
5. **Catches Up**: Periodically checks for missed blocks

## Database Schema

The `transactions` table stores:
- Transaction ID (from contract)
- Government ID
- Amount, Description
- Sender and Recipient addresses
- Block number and transaction hash
- Timestamps

## API

The service currently only indexes data. API endpoints for querying can be added later.
