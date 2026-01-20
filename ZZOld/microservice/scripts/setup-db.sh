#!/bin/bash

# Database setup script for Blockchain Indexer
# This script creates the database and runs the schema

set -e

DB_NAME=${DB_NAME:-budgets_blockchain}
DB_USER=${DB_USER:-postgres}
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}

echo "🗄️  Setting up PostgreSQL database for Blockchain Indexer..."
echo ""

# Check if database exists
if psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "⚠️  Database '$DB_NAME' already exists"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "DROP DATABASE $DB_NAME;"
    else
        echo "✅ Using existing database"
        exit 0
    fi
fi

# Create database
echo "📦 Creating database '$DB_NAME'..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

# Run schema
echo "📋 Running schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f database/schema.sql

echo ""
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env"
echo "2. Update .env with your database credentials"
echo "3. Run 'npm install' to install dependencies"
echo "4. Run 'npm start' to start the indexer"
