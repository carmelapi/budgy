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
    addDialog: {
      chooseTitle: "What do you want to add?",
      income: "Income",
      outcome: "Outcome",
      bankBalance: "Bank Account Balance",
      cancel: "Cancel",
      back: "Back",
      month: "Month",
      addIncomeTitle: "Add Income",
      salary: "Salary",
      extra: "Extra",
      addOutcomeTitle: "Add Outcome",
      loanAvgift: "Loan / Avgift",
      debt: "Debt",
      addBankBalanceTitle: "Add Bank Account Balance",
      amountOnAccount: "Amount on account",
      somethingWentWrong: "Something went wrong",
    },
  },

  sidebar: {
    dashboard: "Dashboard",
    incomes: "Incomes",
    outcomes: "Outcomes",
  },

  auth: {
    login: {
      title: "Welcome Back",
      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      submit: "Login",
      noAccount: "Don't have an account?",
      signUpLink: "Sign up",
    },
    signup: {
      title: "Create Account",
      email: "Email",
      password: "Password",
      language: "Language",
      currency: "Preferred Currency",
      submit: "Create Account",
      signUp: "Sign Up",
      hasAccount: "Already have an account?",
      loginLink: "Login",
    },
    loading: "Please wait...",
    errors: {
      bothRequired: "Please enter both email and password",
      passwordLength: "Password must be at least 6 characters",
    },
  },

  dashboard: {
    title: "Dashboard",
    todo: {
      title: "This Month's Actions",
      transferRevolut: "Transfer to Revolut",
      transferBank: "Transfer to Your Bank",
      transferDeposit: "Transfer to Deposit",
      dailyOutcomes: "Daily Outcomes (Revolut)",
      loading: "Loading...",
      empty: "No data yet — add income and outcome data",
    },
    chart: {
      title: "Monthly Progress",
      totalAccount: "Total Account",
      loading: "Loading chart...",
      empty: "No data yet — add income and outcome data to see the chart",
    },
    table: {
      title: "Dashboard Summary",
      month: "Month",
      totalIncomes: " Incomes",
      finalTotal: "Outcomes",
      totalAccount: "Total Account",
      empty: "No data yet — add income and outcome data to see the summary",
      loading: "Loading dashboard...",
      editBalanceTitle: "Edit Bank Balance",
      balanceAmount: "Balance (kr)",
    },
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
    dialog: {
      editTitle: "Edit Income",
      month: "Month",
      salary: "Salary (kr)",
      extra: "Extra (kr)",
      cancel: "Cancel",
      save: "Save",
      saving: "Saving...",
    },
    errors: {
      monthRequired: "Month is required",
      salaryMin: "Salary must be 0 or greater",
      extraMin: "Extra must be 0 or greater",
    },
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
        editTitle: "Edit Fixed Cost",
        description: "Description",
        descriptionPlaceholder: "e.g., Netflix, Rent, Insurance",
        amount: "Amount",
        amountPlaceholder: "e.g., 149, 20",
        currency: "Currency",
        cancel: "Cancel",
        save: "Save",
        saving: "Saving...",
        paymentSource: "Payment source",
        revolut: "Revolut",
        bank: "Your Bank",
      },
      errors: {
        descriptionRequired: "Description is required",
        amountInvalid: "Amount must be greater than 0",
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
      dialog: {
        editTitle: "Edit Monthly Outcome",
        month: "Month",
        avgiftLoan: "Avgift + Loan (kr)",
        debt: "Debt (kr)",
        extra: "Extra (kr)",
        cancel: "Cancel",
        save: "Save",
        saving: "Saving...",
      },
      errors: {
        monthRequired: "Month is required",
        avgiftLoanMin: "Avgift + Loan must be 0 or greater",
        debtMin: "Debt must be 0 or greater",
        extraMin: "Extra must be 0 or greater",
      },
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
    errorPrefix: "Error",
  },
};

export type TranslationKeys = typeof en;
