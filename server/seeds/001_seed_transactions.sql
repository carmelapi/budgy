-- Seed data for transactions - MINIMAL EXAMPLE
-- Just a few sample transactions for February 2026 to test the system
-- Assumes user with id 1 exists (from auth system)

-- Example transactions for current month (February 2026)
INSERT INTO transactions (user_id, description, amount, type, category, frequency, transaction_date) VALUES
  -- Income examples
  (1, 'Monthly salary', 3500.00, 'income', 'salary', 'monthly', '2026-02-01'),
  (1, 'Freelance project', 500.00, 'income', 'freelance', 'one-time', '2026-02-15'),

  -- Expense examples
  (1, 'Rent payment', 1200.00, 'expense', 'rent', 'monthly', '2026-02-05'),
  (1, 'Grocery shopping', 250.00, 'expense', 'food', 'one-time', '2026-02-10'),
  (1, 'Utilities bill', 120.00, 'expense', 'utilities', 'monthly', '2026-02-12');

-- NOTE: After testing, you can DELETE these sample transactions:
-- DELETE FROM transactions WHERE user_id = 1;
