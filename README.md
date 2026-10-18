# Budgy

A personal budget app to understand what comes in, what goes out, and how your
balance changes over time.

Budgy brings monthly income, recurring costs, expenses, and account balances into
one dashboard, with an iOS-inspired interface, rounded tables, and subtle shadows.

## Features

- **Monthly overview** — compare income, expenses, and account totals, with a balance chart.
- **Income tracking** — manage salary and extra income separately for each month.
- **Fixed costs** — track recurring expenses in SEK or EUR and identify their payment source.
- **Monthly expenses** — record housing/loan payments, debt, and additional expenses.
- **Budget analysis** — view spending percentages and the amount remaining after a savings target.
- **Calculations in amount fields** — enter `535*3` or `284+3920` and preview the result before saving.
- **Accounts and preferences** — registration, login, English/Italian translations, and currency settings.
- **Updates without page reloads** — saved entries update the visible tables and chart.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router |
| Interface | Material UI, MUI X Charts, Tailwind CSS |
| API | Node.js, Express 5 |
| Database | PostgreSQL, SQL migrations |
| Authentication | JWT, bcrypt |
| Repository | npm workspaces |

```text
budgy/
├── apps/
│   ├── api/
│   │   ├── features/       # Auth, income, expenses, transactions, balances
│   │   ├── migrations/     # Database schema
│   │   ├── tests/          # Income regression tests
│   │   └── server.js       # Express entry point
│   └── web/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── i18n/
│       │   ├── pages/
│       │   └── theme.ts    # Shared Material UI theme
│       └── tests/          # Amount calculation tests
├── .nvmrc
└── package.json
```

## Getting started

### 1. Install dependencies

Use **Node.js 22** (the version specified in `.nvmrc`), **npm 10 or later**, and
**PostgreSQL 16**. The commands below assume nvm is installed.

```bash
git clone git@github.com:carmelapi/budgy.git
cd budgy
nvm install
nvm use
npm ci
cp apps/api/.env.example apps/api/.env
```

Run npm commands from the repository root unless a command explicitly changes
directory. One `npm ci` installs dependencies for both workspaces.

### 2. Configure the environment

Edit `apps/api/.env`:

| Variable | Local example | Purpose |
| --- | --- | --- |
| `DB_HOST` | `127.0.0.1` | PostgreSQL host |
| `DB_PORT` | `5433` | PostgreSQL port |
| `DB_NAME` | `budgy` | Database name |
| `DB_USER` | `budgy` | Database role |
| `DB_PASSWORD` | Empty for the local trust setup below | Database password |
| `PORT` | `3001` | API port |
| `CLIENT_URL` | `http://localhost:5173` | Allowed frontend origin for CORS |
| `JWT_SECRET` | Your generated secret | Token signing key |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |

Generate a signing key with `openssl rand -hex 32`, then replace the
`JWT_SECRET` placeholder. Local `.env` files are ignored by Git; commit only the
`.env.example` templates.

The frontend defaults to `http://localhost:3001`. To use another API address:

```bash
cp apps/web/.env.example apps/web/.env
```

Set `VITE_API_URL` in that file and restart Vite. Only put public configuration in
`VITE_` variables: their values are included in the frontend bundle.

### 3. Create the database

If you already have PostgreSQL running, create an empty database, update the
`DB_*` settings to match it, and apply the schema:

```bash
(cd apps/api && node runMigrations.js)
```

For a dedicated local database on **macOS with Homebrew**, use the following
setup instead. Install PostgreSQL with `brew install postgresql@16` if needed.
Run these initialization commands **once**:

```bash
export PATH="$(brew --prefix postgresql@16)/bin:$PATH"
mkdir -p .local
initdb -D .local/postgres -U budgy -A trust --encoding=UTF8
pg_ctl -D .local/postgres -l .local/postgres.log -o '-h 127.0.0.1 -p 5433 -k /private/tmp' start
createdb -h 127.0.0.1 -p 5433 -U budgy budgy
(cd apps/api && node runMigrations.js)
```

This matches the environment template. Database files live in the Git-ignored
`.local/` directory. Trust authentication is used for local development, with the
server listening on loopback.

**Apply `runMigrations.js` only to an empty database.** It executes SQL files in
order without recording applied migrations, and some statements cannot be run
twice. The numbering skips migration 008; no file needs to be created for that gap.

### 4. Start the app

In terminal 1, from the repository root:

```bash
nvm use
npm run dev:api
```

In terminal 2, from the same repository root:

```bash
nvm use
npm run dev:web
```

Open [Budgy](http://localhost:5173), create an account, and add your first month.
The [API root](http://localhost:3001) should return `API online`.
Authentication and saved data require both the API and PostgreSQL to be running.

For later sessions, start the dedicated database before starting the app:

```bash
export PATH="$(brew --prefix postgresql@16)/bin:$PATH"
pg_ctl -D .local/postgres -l .local/postgres.log -o '-h 127.0.0.1 -p 5433 -k /private/tmp' start
```

Stop each application with `Ctrl+C`. To stop the dedicated database:

```bash
"$(brew --prefix postgresql@16)/bin/pg_ctl" -D .local/postgres stop
```

## Using Budgy

### Add income to an existing month

Salary and extra income share one monthly entry. In **Add → Income**, fill in
only the amounts you want to set:

- A blank field keeps its existing value; for a new month it defaults to zero.
- An explicit `0` sets that field to zero.
- A supplied amount replaces that field's previous value; it is not added to it.

For example, if salary is already recorded, leave salary blank and enter
`284+3920` in extra. Budgy saves **4204** as extra and preserves the salary.

### Calculate directly in an amount field

Use `+`, `-`, `*`, `/`, and parentheses. Decimal points and commas are accepted.

| Input | Saved amount |
| --- | --- |
| `535*3` | `1605.00` |
| `100+25,50` | `125.50` |
| `(1200-300)/3` | `300.00` |

The result appears beneath the field before saving and is rounded to two decimal
places when saved. Incomplete expressions, division by zero, and negative results
are rejected. Fixed costs must be greater than zero.

### Populate the dashboard with demo data

Create an account first, then run this command with **that account's email**:

```bash
(cd apps/api && node seedDemo.js your-account@example.com)
```

The script adds six months of income, expenses, and previous-month balances, plus
fixed costs marked `[Demo]`. Existing monthly entries are preserved. Re-running
it does not duplicate the same demo fixed costs. It accepts only a local database
host. Reload the dashboard once after seeding.

The balance chart needs income and expenses for a month, plus an account balance
for the **previous month**. Missing data can leave the chart empty or show `null`
in the dashboard table.

## Commands and checks

| Command, from the repository root | Purpose |
| --- | --- |
| `npm run dev:web` | Start the Vite development server |
| `npm run dev:api` | Start the Express API |
| `npm run build:web` | Check TypeScript and build the frontend into `apps/web/dist` |
| `npm run lint:web` | Run ESLint on the frontend |
| `npm run test:amount` | Test arithmetic parsing and saved amounts using Node.js 22 |
| `(cd apps/api && node --test tests/incomes.test.js)` | Test monthly income updates against the configured local database |

The income tests require the database schema to exist. They use temporary records
inside a transaction and roll them back. Restart the API after backend changes;
the current start command does not watch files.

## Troubleshooting

**React or CSS type declarations are missing in VS Code**

Open the same repository folder in which you ran `npm ci`. Another clone has its
own dependencies. From that folder, run `nvm use` and `npm ci`; if errors persist,
run **TypeScript: Restart TS Server** from the command palette.

**Port 5173 is already in use**

Vite may select another port. To use port 5175 explicitly:

```bash
npm run dev --workspace=apps/web -- --host 127.0.0.1 --port 5175 --strictPort
```

Set `CLIENT_URL=http://localhost:5175` in `apps/api/.env`, restart the API, and open
[http://localhost:5175](http://localhost:5175). Use the same hostname in the browser
and `CLIENT_URL`; `localhost` and `127.0.0.1` are different CORS origins.

**Login or data requests fail**

Check that PostgreSQL is running, the `DB_*` values match it, migrations have been
applied, and the API returns `API online`. If the frontend or API port changed,
update `CLIENT_URL` and `VITE_API_URL` accordingly.

## Current limitations

- Budget analysis currently uses a fixed **30% savings target**.
- Currency preferences and fixed-cost conversion are available, but the dashboard,
  chart, and several monthly tables still display SEK.
- ESLint currently reports existing issues; a successful build does not imply
  that the lint check passes.

## Author

**Carmela Pippa** — [Portfolio](https://carmelapippa.netlify.app)
