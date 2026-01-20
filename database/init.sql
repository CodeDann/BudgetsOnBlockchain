-- Create transactions table with blockchain metadata
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,                     -- Local auto-increment ID
    contract_tx_id BIGINT NOT NULL UNIQUE,    -- Smart contract transaction ID
    amount NUMERIC(38, 18) NOT NULL,         -- Amount in wei
    description TEXT,                         -- Description from smart contract
    recipient_name TEXT,                       -- Recipient from smart contract

    trx_hash VARCHAR(66) NOT NULL UNIQUE,     -- Ethereum transaction hash
    block_hash VARCHAR(66) NOT NULL,          -- Block hash
    block_number BIGINT NOT NULL,             -- Block number
    block_created_time TIMESTAMP NOT NULL,    -- Block timestamp

    created_at TIMESTAMP DEFAULT NOW()        -- Local insertion time
);

-- Index for fast lookup by block number
CREATE INDEX IF NOT EXISTS idx_transactions_block_number
ON transactions(block_number);

-- Index for fast lookup by transaction hash
CREATE INDEX IF NOT EXISTS idx_transactions_trx_hash
ON transactions(trx_hash);
