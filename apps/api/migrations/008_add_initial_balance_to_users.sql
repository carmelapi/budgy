-- Migration: Add initial_balance to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS initial_balance NUMERIC(12,2) DEFAULT 0;
