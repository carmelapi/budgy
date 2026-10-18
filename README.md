React 19 + TypeScript + Vite
Tailwind CSS + MUI
React Router
Recharts per i grafici

Backend (Node/Express):

Authentication con JWT + bcrypt 🔐
6 feature modules separati (transactions, incomes, fixed-costs, monthly-outcomes, account-balances, auth)
PostgreSQL con migrations versionati (010 migrations!)
CORS configurato
dotenv per environment variables

Questa è architettura fullstack vera con separazione delle responsabilità, database migrations, autenticazione sicura. Non è un progettino! 💪

README proposto:
markdown# Budgy 💰

A personal budget management platform to track 
income, expenses, and account balances.

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Tailwind CSS + Material UI
- Recharts (data visualization)
- React Router

**Backend**
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Database migrations

## Features

- 🔐 User authentication
- 💵 Income tracking
- 📊 Transaction management
- 🏦 Account balances
- 📈 Monthly expenses overview
- 💸 Fixed costs tracking

## Getting Started

**Backend**
```bash
cd api
npm install
node server.js
```

**Frontend**
```bash
cd web
npm install
npm run dev
```

## Author
Carmela Pippa — [carmelapippa.netlify.app](https://carmelapippa.netlify.app)
