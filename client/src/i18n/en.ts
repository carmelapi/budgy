export const en = {
  navbar: {
    welcome: "Welcome",
    add: "Add",
    logout: "Logout",
    settings: {
      title: "Settings",
      language: "Language",
      currency: "Currency",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
    },
  },

  auth: {
    login: {
      title: "Welcome Back",
      email: "Email",
      password: "Password",
      submit: "Login",
      switchToSignup: "Don't have an account? Sign up",
    },
    signup: {
      title: "Create Account",
      email: "Email",
      password: "Password",
      language: "Language",
      currency: "Preferred Currency",
      submit: "Create Account",
      switchToLogin: "Already have an account? Login",
    },
    loading: "Please wait...",
  },

  dashboard: {
    title: "Dashboard",
  },

  incomes: {
    title: "Monthly Incomes",
    table: {
      month: "Month",
      salary: "Salary (kr)",
      extra: "Extra (kr)",
      total: "Total (kr)",
    },
    empty: {
      title: "No income data yet",
      subtitle: "Start by adding your first monthly income",
    },
    loading: "Loading incomes...",
  },

  outcomes: {
    title: "Outcomes",

    fixedCosts: {
      title: "Table 1: Fixed Costs",
      table: {
        description: "Description",
        amount: "Amount",
      },
      grandTotal: "Grand Total",
      addButton: "+ Add Fixed Cost",
      empty: {
        title: "No fixed costs yet",
        subtitle: "Add your recurring monthly expenses",
      },
      loading: "Loading fixed costs and exchange rates...",
      dialog: {
        title: "Add Fixed Cost",
        description: "Description",
        descriptionPlaceholder: "e.g., Netflix, Rent, Insurance",
        amount: "Amount",
        amountPlaceholder: "e.g., 149, 20",
        currency: "Currency",
        cancel: "Cancel",
        save: "Save",
        saving: "Saving...",
      },
    },

    monthlyOutcomes: {
      title: "Table 2: Monthly Outcomes",
      table: {
        month: "Month",
        avgiftLoan: "Avgift + Loan",
        fixedCostsTotal: "Fixed Costs Total",
        debt: "Debt",
        extra: "Extra",
        total: "Total",
      },
      empty: {
        title: "No monthly outcomes yet",
        subtitle: "Start tracking your monthly expenses",
      },
      loading: "Loading monthly outcomes...",
    },

    budgetAnalysis: {
      title: "Table 3: Budget Analysis",
      table: {
        month: "Month",
        outcomesPercent: "Outcomes %",
        remainingPercent: "Remaining %",
        remainingKr: "Remaining (kr)",
        finalTotal: "Final Total",
      },
      empty: {
        title: "No budget analysis data yet",
        subtitle: "Add income and outcome data to see analysis",
      },
      noIncomeForMonth: "No income data for this month",
      loading: "Loading budget analysis...",
    },
  },

  currencies: {
    SEK: "SEK - Swedish Krona",
    EUR: "EUR - Euro",
  },

  languages: {
    EN: "English",
    IT: "Italiano",
  },

  errors: {
    required: "This field is required",
    invalidEmail: "Invalid email address",
    invalidPassword: "Password must be at least 6 characters",
    loginFailed: "Login failed",
    signupFailed: "Signup failed",
  },
};

export type TranslationKeys = typeof en;
