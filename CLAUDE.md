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
- `src/App.jsx` — root component; holds the `transactions` array state and wires child components together
- `src/Summary.jsx` — receives `transactions`, computes and displays total income, expenses, and balance
- `src/TransactionForm.jsx` — owns its own form state; calls `onAdd(transaction)` prop when submitted
- `src/TransactionList.jsx` — receives `transactions`, owns its own filter state, renders the table
- `src/App.css` / `src/index.css` — plain CSS, no utility framework

State ownership: `transactions` lives in `App` and is the single source of truth. Each child owns only the UI state it needs (`TransactionForm` owns form fields, `TransactionList` owns filter selections). There is no persistence — data resets on refresh.
