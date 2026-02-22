-- Migration: Create incomes table
-- This table stores monthly income data (salary + extra income)

CREATE TABLE IF NOT EXISTS incomes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL, -- Format: "YYYY-MM" (e.g., "2026-02")
  salary DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (salary >= 0),
  extra DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (extra >= 0),
  total DECIMAL(10, 2) GENERATED ALWAYS AS (salary + extra) STORED, -- Auto-calculated
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Prevent duplicate months per user
  UNIQUE(user_id, month)
);

-- Create indexes for performance
CREATE INDEX idx_incomes_user_id ON incomes(user_id);
CREATE INDEX idx_incomes_user_month ON incomes(user_id, month);

-- Create trigger to auto-update updated_at timestamp
CREATE TRIGGER update_incomes_updated_at
BEFORE UPDATE ON incomes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add comment to document table purpose
COMMENT ON TABLE incomes IS 'Stores monthly income data: salary and extra income (gifts, bonuses, etc.)';
