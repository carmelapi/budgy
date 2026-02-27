-- Migration: Create account_balances table
-- Stores the user's actual bank account balance for a given month

CREATE TABLE IF NOT EXISTS account_balances (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, month)
);

CREATE INDEX IF NOT EXISTS idx_account_balances_user_id ON account_balances(user_id);
