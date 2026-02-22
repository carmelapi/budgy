# CLAUDE.md — Budgy Project Overview

This is the main guidance file for Claude Code. Read also:

- [`CLAUDE.frontend.md`](./CLAUDE.frontend.md) — Frontend rules and structure
- [`CLAUDE.backend.md`](./CLAUDE.backend.md) — Backend rules and structure

---

## About Me

Junior frontend developer learning full-stack development. Explain things in tutorial mode:

1. **BEFORE** making changes: explain WHAT you'll do and WHY
2. **AFTER** changes: explain WHAT changed and WHY it matters
3. Warn me about common beginner mistakes
4. Add comments in code for complex parts
5. Don't make verbose code
6. Always start with plan mode on

---

## Project Overview

**Budgy** is a full-stack budget management application.

**Features:**

- Track expenses (monthly/yearly/one-time)
- Track income (salary/gifts/bonuses)
- Calculate remaining budget
- Manage savings

**Tech Stack:**

- Frontend: React 19 + TypeScript + Vite + Tailwind CSS + Material-UI
- Backend: Express.js + PostgreSQL
- Routing: React Router

---

## 🚨 CRITICAL WORKFLOW — Backend First, Always

This is the most important rule. **Never work on frontend and backend at the same time.**

Each feature uses **3 branches**: one parent + one for BE + one for FE.

```
main
└── feature/incomes-page              ← parent branch for the whole feature
    ├── feature/incomes-page-be       ← backend sub-branch
    └── feature/incomes-page-fe       ← frontend sub-branch
```

```
CORRECT FLOW:

── SETUP ──────────────────────────────────────────────────────

0. 🌿 Create the PARENT branch first (from main):
   git checkout main
   git pull origin main
   git checkout -b feature/<feature-name>

── BACKEND PHASE ──────────────────────────────────────────────

1. 🔀 Create the BE sub-branch (from parent, NOT from main):
   git checkout -b feature/<feature-name>-be

2. Claude implements backend completely (routes + controllers + DB changes)

3. Claude says: "✅ Backend done. Files modified: [list]. Brief summary of what was built."

4. I test the backend (Postman, curl, etc.)

5. Merge BE into parent and push:
   git add . && git commit -m "feat: backend for <feature-name>"
   git checkout feature/<feature-name>
   git merge feature/<feature-name>-be
   git push origin feature/<feature-name>

── FRONTEND PHASE ─────────────────────────────────────────────

6. I say: "ok, go with Frontend"

7. 🔀 Create the FE sub-branch (from parent, NOT from main):
   git checkout feature/<feature-name>
   git checkout -b feature/<feature-name>-fe

8. Claude implements ONLY the first page

9. Claude says: "✅ [PageName] done. Files: [list]. Test it and let me know."

10. I test the page

11. Merge FE into parent and push:
    git add . && git commit -m "feat: frontend <feature-name>"
    git checkout feature/<feature-name>
    git merge feature/<feature-name>-fe
    git push origin feature/<feature-name>

12. I say: "ok, continue" OR "change this..."
13. Repeat steps 7–12 for each additional page

── DONE ───────────────────────────────────────────────────────

14. 🎉 Open PR: feature/<feature-name> → main on GitHub
```

**Rules:**

- Always create sub-branches FROM the parent branch, never directly from main
- Backend: complete ALL routes + controllers + DB changes before touching frontend
- Frontend: implement **1 page at a time**, wait for my feedback before moving on
- **Never** implement all pages at once
- **Never** run `npm run build` — I handle production builds myself

---

## Development Workflow

> 🚨 **Golden Rule**: Create the branch **FIRST** — before planning, before coding, before asking Claude.

```bash
# ✅ ALWAYS first thing — create the parent branch:
git checkout main
git pull origin main
git checkout -b feature/<feature-name>

# Then follow the CRITICAL WORKFLOW above for BE and FE sub-branches
```

---

## Server Info

- **OS**: Ubuntu 22.04 / 24.04
- **SSH**: `ssh root@YOUR_SERVER_IP`

### Deployment Steps

```bash
# 1. Clone
cd /var/www && git clone YOUR_GITHUB_REPO_URL && cd budgy

# 2. Backend
cd server && npm install
pm2 start server.js --name budgy-api
pm2 save && pm2 startup

# 3. Frontend (I do this manually)
cd ../client && npm install && npm run build
npm install -g serve
pm2 serve dist 5173 --name budgy-frontend && pm2 save
```

### PM2 Commands

```bash
pm2 status              # Show all processes
pm2 logs budgy-api      # View API logs
pm2 restart all         # Restart everything
pm2 monit               # Real-time dashboard
```

---

## Troubleshooting

- **Port 5173 in use**: `lsof -ti:5173 | xargs kill -9`
- **Port 3001 in use**: `lsof -ti:3001 | xargs kill -9`
- **API calls failing**: Check `VITE_API_URL` in `.env`
- **DB connection fails**: Check PostgreSQL is running + `.env` credentials
- **CORS errors**: Check CORS middleware in `server.js`
- **PM2 crashes**: `pm2 logs budgy-api`
