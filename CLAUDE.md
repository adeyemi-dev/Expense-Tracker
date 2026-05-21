# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:5173
npm run build    # production build
npm run lint     # run ESLint
npm run preview  # preview production build
```

No test suite is configured.

## Node version note

Vite 5 is pinned here (downgraded from the scaffolded v7) because the local Node.js is v18. Do not upgrade Vite beyond v5 unless Node is also upgraded to 20.19+.

## PostCSS note

A `postcss.config.js` exists at the project root with no plugins. This is intentional — it prevents Vite from walking up to a global `~/postcss.config.js` (which references tailwindcss) and applying it to this project, which has no Tailwind.

## Architecture

This is a single-page React app with no routing, no state management library, and no backend.

- `src/main.jsx` — entry point, mounts `<App />` into `#root`
- `src/App.jsx` — the entire application: all state, logic, and UI live here
- `src/App.css` / `src/index.css` — plain CSS, no utility framework

All transaction state is held in a single `useState` array in `App.jsx`. There is no persistence (data resets on refresh). The app intentionally ships with a bug and rough UI as part of a course exercise.
