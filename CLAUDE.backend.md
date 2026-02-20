# CLAUDE.backend.md — Backend Guide

> ⬅️ Back to main: [`CLAUDE.md`](./CLAUDE.md)

---

## Tech Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: PostgreSQL with `pg` library
- **Auth**: bcrypt for password hashing

---

## Folder Structure

```
/server
  /routes         # API route definitions (auth.routes.js, expenses.routes.js...)
  /controllers    # Business logic for each route
  /db             # Database connection + queries
  server.js       # Entry point, Express setup, middleware
  .env            # Environment variables (never commit this!)
```

---

## Rules

- Complete **all** backend work (routes + controllers + DB changes) before touching frontend
- After finishing: list every file modified and say "✅ Backend done. Ready to test."
- Always validate inputs on the backend — never trust the frontend
- Hash passwords with bcrypt — never store plain text
- Keep controllers thin: logic goes in separate service/query files when it gets complex

---

## Commands

```bash
# From /server directory:
npm start        # Start Express server → http://localhost:3001
```

---

## Environment Variables

Create a `.env` file in `/server` (never commit it):

```env
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/budgy
JWT_SECRET=your_secret_here
```

---

## Database

- **Type**: PostgreSQL
- **Connection**: via `pg` library using `DATABASE_URL` from `.env`
- When adding new features, always update the schema and create a migration file

---

## Common Beginner Mistakes to Watch For

- Forgetting to add CORS middleware when frontend can't reach backend
- Not using `async/await` correctly (missing `try/catch`)
- Storing passwords without hashing
- Exposing the `.env` file to git (always add to `.gitignore`)
- Not returning proper HTTP status codes (use 200, 201, 400, 401, 404, 500 correctly)

---

## Tips for Prompting

- "Add the POST /expenses endpoint, explain each part"
- "I'm getting a CORS error, what's wrong?"
- "Show me the plan for the auth routes before writing any code"
