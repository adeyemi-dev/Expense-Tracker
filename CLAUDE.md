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

Single-page React app with no routing, no state management library, and no backend. All persistence is via `localStorage`.

### Component tree

- `src/main.jsx` — entry point, mounts `<App />` into `#root`
- `src/App.jsx` — root component; owns `currentUser`, `transactions`, `editingTransaction`, and `isDark` state; conditionally renders `AuthPage` or the dashboard
- `src/AuthPage.jsx` — login/signup form; writes to `ft-users` and `ft-session` in localStorage; calls `onAuth(user)` on success
- `src/Summary.jsx` — receives `transactions`; computes and displays total income, expenses, savings, and balance
- `src/TransactionForm.jsx` — owns form field state; handles both add and edit modes via `editingTransaction` prop; scrolls into view and highlights when editing
- `src/TransactionList.jsx` — owns search, filter, and `pendingDelete` state; renders the table with edit/delete actions and the CSV export button
- `src/ConfirmDialog.jsx` — modal confirmation dialog used by `TransactionList` before deleting a transaction
- `src/App.css` / `src/index.css` — plain CSS using custom properties (no utility framework); `index.css` imports Inter from Google Fonts and defines the full design token system

### State ownership

| State | Lives in | Notes |
|---|---|---|
| `currentUser` | `App` | Loaded from `ft-session` in localStorage on init |
| `transactions` | `App` | Loaded from `ft-transactions-{userId}`; saved on every change |
| `editingTransaction` | `App` | Passed to `TransactionForm`; null means add mode |
| `isDark` | `App` | Applied via `data-theme` on `<html>`; persisted to `theme` key |
| Form fields | `TransactionForm` | Reset after submit or cancel |
| Search / filters | `TransactionList` | UI-only, not persisted |
| `pendingDelete` | `TransactionList` | Holds the transaction object awaiting delete confirmation |

### localStorage keys

| Key | Contents |
|---|---|
| `ft-session` | `{id, name, email}` of the logged-in user |
| `ft-users` | Array of all registered users (including plain-text passwords — demo only) |
| `ft-transactions-{userId}` | Transactions array for a specific user |
| `theme` | `"dark"` or `"light"` |

### Transaction types and categories

Transaction `type` is one of: `income`, `expense`, `savings`.

Categories: `food`, `groceries`, `rent`, `housing`, `utilities`, `phone bill`, `transport`, `entertainment`, `clothing`, `salary`, `savings`, `black tax`, `miscellaneous`.

### Design system

CSS custom properties are defined in `index.css` on `:root` (light) and `[data-theme="dark"]`. All colours, shadows, and radii reference variables — never use hard-coded values. Key variables: `--bg`, `--surface`, `--surface-2`, `--border`, `--text-primary`, `--text-secondary`, `--income`, `--expense`, `--savings`, `--accent`.
