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

```
CORRECT FLOW:

1. Claude implements backend completely (all routes, controllers, DB changes)
2. Claude says: "✅ Backend done. Files modified: [list]. Ready for you to test."
3. I test the backend (Postman, curl, etc.)
4. I do: git add / commit / push
5. I say: "ok, go with Frontend"
6. Claude implements ONLY the first page (e.g. LoginPage)
7. Claude says: "✅ LoginPage done. Files: [list]. Test it and let me know."
8. I test the page
9. I do: git add / commit / push (if happy)
10. I say: "ok procedi" OR "cambia questo..."
11. Repeat for each page
```

**Rules:**

- Backend: complete ALL routes + controllers + DB changes before touching frontend
- Frontend: implement **1 page at a time**, wait for my feedback before moving on
- **Never** implement all pages at once
- **Never** run `npm run build` — I handle production builds myself

---

## Development Workflow

1. Pull latest: `git checkout main && git pull origin main`
2. Create branch: `git checkout -b feature/feature-name`
3. Ask Claude to explain the plan first
4. Backend phase → I test → I commit/push
5. Frontend phase (page by page) → I test → I commit/push
6. When all pages done: I create PR on GitHub
7. After merge: I deploy to Hetzner

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
