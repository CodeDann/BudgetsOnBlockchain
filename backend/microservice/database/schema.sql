-- PostgreSQL schema for storing blockchain transactions
-- Run this to set up the database
-- First create the database manually: CREATE DATABASE budgets_blockchain;
-- Then run: psql -U postgres -d budgets_blockchain -f database/schema.sql

-- Transactions table matching the contract's Transaction struct
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    trx_id BIGINT NOT NULL UNIQUE,  -- Transaction ID from contract (trxCount)
    gov_id BIGINT NOT NULL,
    amount NUMERIC(78, 0) NOT NULL,  -- uint256 can be very large
    description TEXT NOT NULL,
    sender_address VARCHAR(42) NOT NULL,  -- Ethereum address (0x + 40 hex chars)
    recipient_address VARCHAR(42) NOT NULL,
    recipient_name TEXT NOT NULL,
    block_number BIGINT NOT NULL,
    transaction_hash VARCHAR(66) NOT NULL UNIQUE,  -- 0x + 64 hex chars
    log_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_trx_id ON transactions(trx_id);
CREATE INDEX IF NOT EXISTS idx_transactions_sender_address ON transactions(sender_address);
CREATE INDEX IF NOT EXISTS idx_transactions_recipient_address ON transactions(recipient_address);
CREATE INDEX IF NOT EXISTS idx_transactions_block_number ON transactions(block_number);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Table to track the last processed block (for efficient event listening)
CREATE TABLE IF NOT EXISTS sync_state (
    id INTEGER PRIMARY KEY DEFAULT 1,
    last_processed_block BIGINT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial sync state
INSERT INTO sync_state (last_processed_block) 
VALUES (0)
ON CONFLICT (id) DO NOTHING;
