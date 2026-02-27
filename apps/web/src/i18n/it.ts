import type { TranslationKeys } from './en';

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
  },

  auth: {
    login: {
      title: "Bentornato",
      email: "Email",
      password: "Password",
      submit: "Accedi",
      switchToSignup: "Non hai un account? Registrati",
    },
    signup: {
      title: "Crea Account",
      email: "Email",
      password: "Password",
      language: "Lingua",
      currency: "Valuta Preferita",
      submit: "Crea Account",
      switchToLogin: "Hai già un account? Accedi",
    },
    loading: "Attendere prego...",
  },

  dashboard: {
    title: "Dashboard",
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
  },
};
