// TypeScript interfaces for Incomes & Outcomes pages
// These define the shape of data to enable autocomplete and prevent bugs

// Incomes Page - Monthly income data
export interface MonthlyIncome {
  id: number;
  user_id: number;
  month: string;        // Format: "2026-02"
  salary: string;       // Decimal from DB comes as string
  extra: string;        // Decimal from DB comes as string
  total: string;        // Auto-calculated by DB: salary + extra
  created_at: string;
  updated_at: string;
}

// Fixed Costs - Recurring monthly expenses
export interface FixedCost {
  id: number;
  user_id: number;
  description: string;  // e.g., "Hedvig (cat insurance)"
  amount: string;       // Decimal from DB comes as string
  currency: 'SEK' | 'EUR';
  payment_source: 'revolut' | 'bank' | null;
  created_at: string;
  updated_at: string;
}

// Monthly Outcomes - Monthly expense breakdown
export interface MonthlyOutcome {
  id: number;
  user_id: number;
  month: string;        // Format: "2026-02"
  avgift_loan: string;  // Decimal from DB comes as string
  debt: string;         // Decimal from DB comes as string
  extra: string;        // Decimal from DB comes as string
  created_at: string;
  updated_at: string;
}
