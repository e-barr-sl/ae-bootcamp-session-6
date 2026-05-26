# Data Model: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items` | **Date**: 2026-05-26

---

## Existing Entity: Todo

No schema changes to the backend. The `Todo` entity already provides all fields required to derive overdue status.

### Fields

| Field | Type | Nullable | Description |
|---|---|---|---|
| `id` | integer | No | Auto-increment primary key |
| `title` | string (≤ 255) | No | Human-readable todo description |
| `completed` | boolean | No | `true` when the todo has been marked done |
| `dueDate` | string (ISO 8601 date, `YYYY-MM-DD`) | Yes | Optional deadline; `null` if no deadline set |
| `createdAt` | string (ISO 8601 datetime) | No | Server-assigned creation timestamp |

### Validation Rules (existing, unchanged)

- `title`: required, non-empty after trim, max 255 characters
- `dueDate`: optional; if present, must be a valid calendar date in `YYYY-MM-DD` format
- `completed`: defaults to `false` on creation

---

## Derived State: `isOverdue`

Overdue is **not stored** — it is computed on the frontend at render time.

### Definition

```
isOverdue(todo) = !todo.completed && todo.dueDate !== null && due < today
```

where:
- `today` = local calendar date at time of render (midnight-normalised: `new Date()` with `setHours(0, 0, 0, 0)`)
- `due` = `new Date(todo.dueDate)` with `setHours(0, 0, 0, 0)` applied

### Truth Table

| `completed` | `dueDate` | `due < today` | `isOverdue` |
|---|---|---|---|
| `false` | null | — | `false` |
| `false` | today | `false` | `false` |
| `false` | yesterday (or earlier) | `true` | `true` |
| `true` | any | — | `false` |

### State Transitions

```
[incomplete, no due date]       → isOverdue = false  (no change possible without date)
[incomplete, due today]         → isOverdue = false  → (at midnight) → isOverdue = true
[incomplete, due in past]       → isOverdue = true
  ↓ user marks complete
[complete, due in past]         → isOverdue = false
  ↓ user un-marks complete
[incomplete, due in past]       → isOverdue = true   (immediate, FR-007)
  ↓ user edits due date to past
[incomplete, new due in past]   → isOverdue = true   (immediate on save, FR-009)
```

---

## Utility Module: `overdueUtils`

**File**: `packages/frontend/src/utils/overdueUtils.js`

```js
/**
 * Determines whether a todo item is overdue.
 *
 * A todo is overdue when:
 *  - it is incomplete (completed === false), AND
 *  - it has a due date set (dueDate !== null), AND
 *  - the due date is strictly before today's local calendar date.
 *
 * "Due today" is NOT overdue (due < today, not <=).
 *
 * @param {Object} todo - The todo item object
 * @param {boolean} todo.completed - Completion status
 * @param {string|null} todo.dueDate - ISO date string (YYYY-MM-DD) or null
 * @returns {boolean}
 */
export function isOverdue(todo) {
  if (!todo.dueDate || todo.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(todo.dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}
```

### Test Coverage Required

All scenarios from the truth table above must have corresponding test cases in `packages/frontend/src/utils/__tests__/overdueUtils.test.js`:

1. Returns `false` for todo with no due date
2. Returns `false` for completed todo with past due date
3. Returns `false` for incomplete todo with due date = today
4. Returns `true` for incomplete todo with due date = yesterday
5. Returns `true` for incomplete todo with due date = one year ago
6. Returns `false` when todo is re-completed after being overdue

---

## CSS Token: `--warning-color`

**File**: `packages/frontend/src/styles/theme.css`

New token added to both light and dark mode palettes:

| Mode | CSS variable | Value | WCAG AA vs surface |
|---|---|---|---|
| Light | `--warning-color` | `#b45309` | ✅ 4.84:1 vs `#ffffff` |
| Dark | `--warning-color` | `#f59e0b` | ✅ 6.77:1 vs `#2d2d2d` |

Added alongside the existing `--success-color` and `--danger-color` tokens.
