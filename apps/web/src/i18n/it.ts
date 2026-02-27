import type { TranslationKeys } from "./en";

export const it: TranslationKeys = {
  navbar: {
    welcome: "Benvenuto",
    add: "Aggiungi",
    logout: "Esci",
    settings: {
      title: "Impostazioni",
      language: "Lingua",
      currency: "Valuta",
      cancel: "Annulla",
      save: "Salva",
      saving: "Salvataggio...",
    },
    addDialog: {
      chooseTitle: "Cosa vuoi aggiungere?",
      income: "Entrata",
      outcome: "Uscita",
      bankBalance: "Saldo Conto Bancario",
      cancel: "Annulla",
      back: "Indietro",
      month: "Mese",
      addIncomeTitle: "Aggiungi Entrata",
      salary: "Stipendio",
      extra: "Extra",
      addOutcomeTitle: "Aggiungi Uscita",
      loanAvgift: "Rata / Avgift",
      debt: "Debito",
      addBankBalanceTitle: "Aggiungi Saldo Conto Bancario",
      amountOnAccount: "Importo sul conto",
      somethingWentWrong: "Qualcosa è andato storto",
    },
  },

  sidebar: {
    dashboard: "Dashboard",
    incomes: "Entrate",
    outcomes: "Uscite",
  },

  auth: {
    login: {
      title: "Bentornato",
      email: "Email",
      emailPlaceholder: "tuaemail@email.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      submit: "Accedi",
      noAccount: "Non hai un account?",
      signUpLink: "Registrati",
    },
    signup: {
      title: "Crea Account",
      email: "Email",
      password: "Password",
      language: "Lingua",
      currency: "Valuta Preferita",
      submit: "Crea Account",
      signUp: "Registrati",
      hasAccount: "Hai già un account?",
      loginLink: "Accedi",
    },
    loading: "Attendere prego...",
    errors: {
      bothRequired: "Inserisci email e password",
      passwordLength: "La password deve contenere almeno 6 caratteri",
    },
  },

  dashboard: {
    title: "Dashboard",
    chart: {
      title: "Andamento Mensile",
      totalAccount: "Totale Conto",
      loading: "Caricamento grafico...",
      empty: "Nessun dato ancora — aggiungi entrate e uscite per vedere il grafico",
    },
    table: {
      title: "Riepilogo Dashboard",
      month: "Mese",
      totalIncomes: "Entrata",
      finalTotal: "Uscite",
      totalAccount: "Totale Conto",
      empty:
        "Nessun dato ancora — aggiungi entrate e uscite per vedere il riepilogo",
      loading: "Caricamento dashboard...",
      editBalanceTitle: "Modifica Saldo Bancario",
      balanceAmount: "Saldo (kr)",
    },
  },

  incomes: {
    title: "Entrate Mensili",
    table: {
      month: "Mese",
      salary: "Stipendio (kr)",
      extra: "Extra (kr)",
      total: "Totale (kr)",
    },
    empty: {
      title: "Nessun dato sulle entrate",
      subtitle: "Inizia aggiungendo la tua prima entrata mensile",
    },
    loading: "Caricamento entrate...",
    dialog: {
      editTitle: "Modifica Entrata",
      month: "Mese",
      salary: "Stipendio (kr)",
      extra: "Extra (kr)",
      cancel: "Annulla",
      save: "Salva",
      saving: "Salvataggio...",
    },
    errors: {
      monthRequired: "Il mese è obbligatorio",
      salaryMin: "Lo stipendio deve essere 0 o maggiore",
      extraMin: "L'extra deve essere 0 o maggiore",
    },
  },

  outcomes: {
    title: "Uscite",

    fixedCosts: {
      title: "Tabella 1: Costi Fissi",
      table: {
        description: "Descrizione",
        amount: "Importo",
      },
      grandTotal: "Totale Generale",
      addButton: "+ Aggiungi Costo Fisso",
      empty: {
        title: "Nessun costo fisso",
        subtitle: "Aggiungi le tue spese mensili ricorrenti",
      },
      loading: "Caricamento costi fissi e tassi di cambio...",
      dialog: {
        title: "Aggiungi Costo Fisso",
        editTitle: "Modifica Costo Fisso",
        description: "Descrizione",
        descriptionPlaceholder: "es. Netflix, Affitto, Assicurazione",
        amount: "Importo",
        amountPlaceholder: "es. 149, 20",
        currency: "Valuta",
        cancel: "Annulla",
        save: "Salva",
        saving: "Salvataggio...",
        paymentSource: "Fonte di pagamento",
        revolut: "Revolut",
        bank: "La tua banca",
      },
      errors: {
        descriptionRequired: "La descrizione è obbligatoria",
        amountInvalid: "L'importo deve essere maggiore di 0",
      },
    },

    monthlyOutcomes: {
      title: "Tabella 2: Uscite Mensili",
      table: {
        month: "Mese",
        avgiftLoan: "Rata + Prestito",
        fixedCostsTotal: "Totale Costi Fissi",
        debt: "Debito",
        extra: "Extra",
        total: "Totale",
      },
      empty: {
        title: "Nessuna uscita mensile",
        subtitle: "Inizia a tracciare le tue spese mensili",
      },
      loading: "Caricamento uscite mensili...",
      dialog: {
        editTitle: "Modifica Uscita Mensile",
        month: "Mese",
        avgiftLoan: "Rata + Prestito (kr)",
        debt: "Debito (kr)",
        extra: "Extra (kr)",
        cancel: "Annulla",
        save: "Salva",
        saving: "Salvataggio...",
      },
      errors: {
        monthRequired: "Il mese è obbligatorio",
        avgiftLoanMin: "Rata + Prestito deve essere 0 o maggiore",
        debtMin: "Il debito deve essere 0 o maggiore",
        extraMin: "L'extra deve essere 0 o maggiore",
      },
    },

    budgetAnalysis: {
      title: "Tabella 3: Analisi Budget",
      table: {
        month: "Mese",
        outcomesPercent: "Uscite %",
        remainingPercent: "Rimanente %",
        remainingKr: "Rimanente (kr)",
        finalTotal: "Totale Finale",
      },
      empty: {
        title: "Nessun dato di analisi budget",
        subtitle: "Aggiungi dati di entrate e uscite per vedere l'analisi",
      },
      noIncomeForMonth: "Nessun dato di entrate per questo mese",
      loading: "Caricamento analisi budget...",
    },
  },

  currencies: {
    SEK: "SEK - Corona Svedese",
    EUR: "EUR - Euro",
  },

  languages: {
    EN: "English",
    IT: "Italiano",
  },

  errors: {
    required: "Questo campo è obbligatorio",
    invalidEmail: "Indirizzo email non valido",
    invalidPassword: "La password deve contenere almeno 6 caratteri",
    loginFailed: "Accesso fallito",
    signupFailed: "Registrazione fallita",
    errorPrefix: "Errore",
  },
};
