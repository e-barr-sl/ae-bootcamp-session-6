# Quickstart: Overdue Todo Items Feature

**Feature Branch**: `001-overdue-todo-items` | **Date**: 2026-05-26

---

## Prerequisites

- Node.js ≥ 18 installed
- Workspace cloned and on branch `001-overdue-todo-items`

---

## Setup

Install all dependencies from the repository root (runs for both packages):

```bash
npm install
```

---

## Running the App

Start both the backend (port 3030) and frontend (port 3000) concurrently:

```bash
npm run start
```

Open `http://localhost:3000` in a browser.

---

## Running Tests

Run the full test suite (frontend + backend) with coverage:

```bash
npm test
```

Run only frontend tests:

```bash
cd packages/frontend && npm test
```

Run only the overdue utility tests:

```bash
cd packages/frontend && npm test -- --testPathPattern="overdueUtils"
```

Run only the `TodoCard` component tests:

```bash
cd packages/frontend && npm test -- --testPathPattern="TodoCard"
```

---

## Verifying the Overdue Indicator

### Manual verification

1. Start the app (`npm run start`)
2. Create a new todo with a due date in the **past** (e.g., yesterday) — leave it incomplete
3. Verify: an amber "Overdue" label appears on the card
4. Create a todo with today's date — verify: no "Overdue" label
5. Create a todo with no due date — verify: no "Overdue" label
6. Mark the overdue todo as complete — verify: "Overdue" label disappears immediately
7. Un-mark the same todo — verify: "Overdue" label reappears immediately
8. Edit a non-overdue todo's due date to yesterday and save — verify: "Overdue" label appears immediately

### Testing dark mode

Toggle dark mode via the theme button (top right). Verify:
- The "Overdue" label is clearly visible in amber against the dark card surface
- Contrast is sufficient (visually legible)

---

## Key Files Changed

| File | Change type |
|---|---|
| `packages/frontend/src/utils/overdueUtils.js` | NEW — `isOverdue(todo)` utility |
| `packages/frontend/src/utils/__tests__/overdueUtils.test.js` | NEW — unit tests |
| `packages/frontend/src/components/TodoCard.js` | MODIFIED — overdue badge rendered |
| `packages/frontend/src/components/__tests__/TodoCard.test.js` | MODIFIED — overdue scenario tests |
| `packages/frontend/src/App.js` | MODIFIED — 60s `setInterval` for date refresh |
| `packages/frontend/src/styles/theme.css` | MODIFIED — `--warning-color` token added |

---

## Lint Check

Before opening a PR:

```bash
npm run lint
```

All ESLint errors and warnings must be resolved.
