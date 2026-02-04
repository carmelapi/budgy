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
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # TypeScript check + production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
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

**3. Build Frontend**
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
4. Make changes with Claude Code's guidance
5. Test locally (frontend + backend)
6. **Commit changes**: `git add <files> && git commit -m "message"`
7. **Push to branch**: `git push -u origin feature/feature-name`
8. Create PR on GitHub when ready
9. Deploy to Hetzner after PR is merged

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

---

## 🐛 Troubleshooting

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