-- Migration: Add base_currency to users table
-- Allows users to choose their preferred currency (EUR, SEK, USD, etc.)

ALTER TABLE users
ADD COLUMN base_currency VARCHAR(3) DEFAULT 'SEK' CHECK (base_currency IN ('SEK', 'EUR', 'USD', 'GBP', 'NOK', 'DKK'));

-- Add comment
COMMENT ON COLUMN users.base_currency IS 'User preferred currency for displaying amounts. Supported: SEK, EUR, USD, GBP, NOK, DKK';

-- Update existing users to SEK (default)
UPDATE users SET base_currency = 'SEK' WHERE base_currency IS NULL;
