-- Migration: Create fixed_costs table
-- This table stores recurring monthly expenses (subscriptions, insurance, etc.)

CREATE TABLE IF NOT EXISTS fixed_costs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description VARCHAR(100) NOT NULL, -- e.g., "Hedvig (cat insurance)", "Claude AI"
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'SEK' CHECK (currency IN ('SEK', 'EUR')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_fixed_costs_user_id ON fixed_costs(user_id);

-- Create trigger to auto-update updated_at timestamp
CREATE TRIGGER update_fixed_costs_updated_at
BEFORE UPDATE ON fixed_costs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add comment to document table purpose
COMMENT ON TABLE fixed_costs IS 'Stores recurring monthly expenses like subscriptions, insurance, utilities. Supports SEK and EUR currencies.';
