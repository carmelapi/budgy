# CLAUDE.frontend.md — Frontend Guide

> ⬅️ Back to main: [`CLAUDE.md`](./CLAUDE.md)

> 🌿 **Reminder**: Have you created the branch yet? `git checkout -b feature/feature-name` — do that before you start!

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Material-UI
- **Routing**: React Router
- **API Communication**: Fetch API / Axios
- **API URL**: configured via `VITE_API_URL` env variable (default: `http://localhost:3001`)

---

## Folder Structure

```
/client
  /src
    /components     # Reusable components (buttons, forms, cards...)
    /pages          # Full page components (LoginPage, Dashboard...)
    /services       # API call functions (auth.service.ts, expenses.service.ts...)
    /types          # TypeScript interfaces and types
    /utils          # Helper functions
    App.tsx         # Main app with routing
    main.tsx        # Entry point
```

---

## Rules

- Implement **1 page at a time** — never all at once
- After each page: show me what changed and wait for my feedback
- Follow React + TypeScript best practices (explain them if I don't know them yet)
- Prefer functional components + hooks
- Keep components small and focused on one thing

---

## Commands

```bash
# From /client directory:
npm run dev      # Start dev server → http://localhost:5173
npm run lint     # Check for code errors
npm run preview  # Preview a build (only after I built it)

# ❌ DON'T run this — I'll do it when ready:
# npm run build
```

---

## Common Beginner Mistakes to Watch For

- Forgetting to type props with TypeScript interfaces
- Calling APIs directly in components instead of using `/services`
- Using `any` type in TypeScript (avoid it — explain why each time)
- Mutating state directly instead of using `setState`
- Not handling loading and error states in API calls

---

## Tips for Prompting

- "Implement only the LoginPage, explain each part"
- "What's the difference between this React pattern and how I'd do it in Vue?"
- "Review this component and suggest TypeScript improvements"
