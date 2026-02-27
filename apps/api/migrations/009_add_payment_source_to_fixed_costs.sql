-- Migration: Add payment_source to fixed_costs table
ALTER TABLE fixed_costs
  ADD COLUMN IF NOT EXISTS payment_source VARCHAR(10) DEFAULT NULL
    CHECK (payment_source IN ('revolut', 'bank'));
