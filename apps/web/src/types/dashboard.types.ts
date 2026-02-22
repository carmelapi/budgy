// Types for Dashboard components

// Data structure for the balance chart
// Each point represents a month's balance
export interface MonthlyData {
  month: string;      // e.g., "Jan", "Feb"
  balance: number;    // Total balance for that month
}

// Data structure for transactions (expenses/incomes)
export interface Transaction {
  id: number;
  description: string;
  amount: number;     // Negative for expenses, positive for incomes
  date: string;       // ISO date string (YYYY-MM-DD)
  category?: string;  // Optional: "rent", "salary", etc.
}

// Data structure for todo items
export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}
