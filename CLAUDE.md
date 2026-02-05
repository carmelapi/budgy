# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Learning Mode

Junior frontend developer learning full-stack development:

- **Frontend**: React + TypeScript (learning)
- **Backend**: Express.js + PostgreSQL (learning)
- **Deployment**: Hetzner VPS (first time)

**Instructions for Claude Code:**

1. **BEFORE** making changes: Explain WHAT you'll do and WHY
2. **AFTER** changes: Explain WHAT changed in the code
3. Suggest React/TypeScript best practices
4. Add comments in code for complex parts
5. Warn me about common beginner mistakes
6. Don't make verbose code
7. Start always with plan mode on

---

## CRITICAL WORKFLOW RULES

### Backend First, Frontend After

- **ALWAYS** complete backend FIRST, frontend AFTER (never together)
- Backend: all routes + controllers + database changes
- Only after backend is done → start frontend

### Page-by-Page Development

- **NEVER** implement all pages at once
- Implement **1 page at a time**
- After each page: show me what you did → wait for my feedback
- **I decide** when to move forward

### No Production Builds

- **DO NOT** run `npm run build` 
- **DO NOT** create production builds
- Only use `npm run dev` for development
- **I will build** for production when I'm ready

### Correct Flow Example

```
1. Claude implements backend completely
2. Claude: "Backend done. Files modified: [list]. Ready for frontend?"
3. Test the backend
4. I give you the consent to commit and push
5. I say: "Yes, continue"
6. Claude start Frontend and implements ONLY LoginPage
7. Claude: "LoginPage done. Files: [list]. Should I continue?"
8. I test the page
9. I do: git add/commit/push (if I want)
10. I say: "ok procedi" OR "cambia questo..."
11. Repeat for each page...
```

---

## Project Overview

Budgy is a full-stack budget management application.

**Features:**

- Track expenses (monthly/yearly/one-time)
- Track income (salary/gifts/bonuses)
- Calculate remaining budget
- Manage savings

**Tech Stack:**

- Frontend: React 19 + TypeScript + Vite
- Backend: Express.js + PostgreSQL
- UI: Tailwind CSS + Material-UI
- Routing: React Router

---

## Architecture

### Frontend (`/client`)

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **API Communication**: Fetch API / Axios

**Folder Structure:**

```
/client
  /src
    /components     # Reusable components
    /pages         # Page components (LoginPage, Dashboard)
    /services      # API calls
    /types         # TypeScript types/interfaces
    /utils         # Helper functions
    App.tsx        # Main app component
    main.tsx       # Entry point
```

### Backend (`/server`)

- **Runtime**: Node.js + Express.js
- **Database**: PostgreSQL with `pg` library
- **Authentication**: bcrypt for password hashing
- **Module System**: ES Modules

### Client-Server Communication

- API URL configured via `VITE_API_URL` environment variable
- Default: `http://localhost:3001`

---

## Commands

### Client (from `/client` directory)

```bash
npm run dev      # Start Vite dev server (localhost:5173) - USE THIS
npm run lint     # Run ESLint
npm run preview  # Preview production build (ONLY if I built it first)

# DO NOT USE THESE (I'll run them when ready):
# npm run build    # I will run this myself for production
```

### Server (from `/server` directory)

```bash
npm start        # Start Express server (localhost:3001)
```

---

## Database

### Server Info

- **IP Address**: `YOUR_SERVER_IP` (no domain currently)
- **OS**: Ubuntu 22.04 / 24.04
- **SSH Access**: `ssh root@YOUR_SERVER_IP` or `ssh username@YOUR_SERVER_IP`

### Deployment Steps

**1. Clone Repository**

```bash
cd /var/www
git clone YOUR_GITHUB_REPO_URL
cd budgy
```

**2. Setup Backend**

```bash
cd server
npm install

# Start with PM2
pm2 start server.js --name budgy-api
pm2 save
pm2 startup  # Enable auto-restart on reboot
```

**3. Build Frontend** (I do this manually when ready)

```bash
cd ../client
npm install
npm run build
```

**4. Serve Frontend**

```bash
# Install serve globally
npm install -g serve

# Serve the built files
pm2 serve dist 5173 --name budgy-frontend
pm2 save
```

### Useful PM2 Commands

```bash
pm2 status              # Show all running processes
pm2 logs budgy-api      # View API logs
pm2 logs budgy-frontend # View frontend logs
pm2 restart all         # Restart all apps
pm2 stop all            # Stop all apps
pm2 delete all          # Remove all apps from PM2
pm2 monit               # Real-time monitoring dashboard
```

---

## Development Workflow

### Adding New Features

1. **Pull latest from main**: `git checkout main && git pull origin main`
2. **Create feature branch**: `git checkout -b feature/feature-name`
3. Ask Claude Code to explain the implementation plan
4. **Backend Phase:**
  - Claude implements all backend code
  - Claude shows me what changed
  - I test it manually
  - I commit & push (if satisfied)
5. **Frontend Phase (page by page):**
  - I tell Claude which page to implement
  - Claude implements ONLY that page
  - Claude shows me what changed
  - I test the page
  - I commit & push (if satisfied)
  - I tell Claude "ok procedi" for next page
6. When all pages done: I create PR on GitHub
7. After PR merged: I deploy to Hetzner

### Common Tasks

- **Add new API endpoint**: Work in `/server/routes`
- **Add new page**: Work in `/client/src/pages`
- **Add new component**: Work in `/client/src/components`
- **Database changes**: Update schema, create migration

---

## 💡 Tips for Working with Claude Code

**Good Prompts:**

- "Explain how authentication works in this app"
- "Help me add a new expense tracking feature, explain each step"
- "What's the difference between this React pattern and how I'd do it in Vue?"
- "Review this component and suggest improvements"
- "I'm getting this error: [error message]. Explain what's wrong and how to fix it"

**Ask Before Acting:**

- "Before you make changes, explain what you'll modify and why"
- "Show me the plan first, then we'll implement it step by step"

**Control the Flow:**

- "Implement only backend first"
- "Now implement only LoginPage"
- "ok procedi" (to move to next page)
- "Wait, modify this first..." (to pause and adjust)

---

## 🛠 Troubleshooting

### Frontend Issues

- **Port 5173 already in use**: `lsof -ti:5173 | xargs kill -9`
- **API calls failing**: Verify `VITE_API_URL` in `.env`

### Backend Issues

- **Port 3001 already in use**: `lsof -ti:3001 | xargs kill -9`
- **Database connection fails**: Check PostgreSQL is running and credentials in `.env`
- **CORS errors**: Verify CORS middleware in `server.js`

### Deployment Issues

- **Can't SSH**: Check firewall rules and SSH key configuration
- **PM2 app crashes**: Check logs with `pm2 logs budgy-api`

---

**Last Updated**: February 2026