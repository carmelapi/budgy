-- Migration: Add language to users table
-- Allows users to choose their preferred language (EN or IT)

ALTER TABLE users
ADD COLUMN language VARCHAR(2) DEFAULT 'EN' CHECK (language IN ('EN', 'IT'));

-- Add comment
COMMENT ON COLUMN users.language IS 'User preferred language. Supported: EN (English), IT (Italian)';

-- Update existing users to EN (default)
UPDATE users SET language = 'EN' WHERE language IS NULL;
