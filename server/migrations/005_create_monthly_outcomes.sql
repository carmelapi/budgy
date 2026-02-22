-- Migration: Create monthly_outcomes table
-- This table stores monthly expense breakdown (loan payments, debt, extra expenses)

CREATE TABLE IF NOT EXISTS monthly_outcomes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month VARCHAR(7) NOT NULL, -- Format: "YYYY-MM" (e.g., "2026-02")
  avgift_loan DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (avgift_loan >= 0), -- Loan payments
  debt DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (debt >= 0),
  extra DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (extra >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Prevent duplicate months per user
  UNIQUE(user_id, month)
);

-- Create indexes for performance
CREATE INDEX idx_monthly_outcomes_user_id ON monthly_outcomes(user_id);
CREATE INDEX idx_monthly_outcomes_user_month ON monthly_outcomes(user_id, month);

-- Create trigger to auto-update updated_at timestamp
CREATE TRIGGER update_monthly_outcomes_updated_at
BEFORE UPDATE ON monthly_outcomes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add comment to document table purpose
COMMENT ON TABLE monthly_outcomes IS 'Stores monthly expense breakdown: loan payments (avgift), debt, and extra expenses';
