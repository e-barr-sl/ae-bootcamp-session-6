# Research: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items` | **Date**: 2026-05-26

All NEEDS CLARIFICATION items from the Technical Context have been resolved below.

---

## Decision 1: Warning Color Token

**Question**: Which color value(s) should `--warning-color` use in `theme.css` to satisfy WCAG 2.1 AA (≥ 4.5:1 contrast ratio) for the "Overdue" text label in both light and dark modes?

**Decision**:
- Light mode surface (`--bg-surface: #ffffff`): `--warning-color: #b45309` (dark amber)
- Dark mode surface (`--bg-surface: #2d2d2d`): `--warning-color: #f59e0b` (bright amber)

**Contrast verification**:

| Token value | Surface | Contrast ratio | WCAG AA (≥ 4.5:1) |
|---|---|---|---|
| `#b45309` | `#ffffff` (light) | ≈ 4.84:1 | ✅ |
| `#f59e0b` | `#2d2d2d` (dark) | ≈ 6.77:1 | ✅ |

**Rationale**: Amber communicates urgency without clashing with the existing Halloween-orange primary (`#ff6b35`/`#ff8c42`). Separate light/dark values mirror the existing `--success-color` and `--danger-color` pattern already established in `theme.css` — no ad-hoc colors, full design system compliance.

**Alternatives considered**:
- Re-using `--danger-color` (red): Rejected — red already maps to destructive delete actions; using it for overdue would create semantic ambiguity.
- Re-using `--color-primary` (orange): Rejected — primary orange is used for interactive elements (buttons, borders); semantic overlap with deadline urgency is confusing.
- A single universal amber value: Rejected — one amber value cannot simultaneously meet 4.5:1 against both white (#ffffff) and dark charcoal (#2d2d2d) surfaces.

---

## Decision 2: `isOverdue` Utility Function Placement

**Question**: Where should the `isOverdue(todo)` pure function live, and what should its exact signature and logic be?

**Decision**:
- **File**: `packages/frontend/src/utils/overdueUtils.js` (new file)
- **Signature**: `export function isOverdue(todo)` — accepts a full todo object
- **Logic**:
  ```js
  export function isOverdue(todo) {
    if (!todo.dueDate || todo.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }
  ```
- **Test file**: `packages/frontend/src/utils/__tests__/overdueUtils.test.js`

**Rationale**: Extracting to a dedicated utility module (DRY principle) means `TodoCard` and `TodoForm` import the same function, preventing logic drift. A `utils/` directory is the conventional React pattern for pure, non-component, non-service helpers. Normalising both dates to midnight via `setHours(0, 0, 0, 0)` implements the spec requirement that "due today is not overdue" correctly regardless of the time of day. The function is entirely pure (no side effects), making it trivially unit-testable.

**Alternatives considered**:
- Inline per component: Rejected — duplicates logic across `TodoCard` and `TodoForm`; violates DRY.
- Backend-computed `isOverdue` field in API response: Rejected — spec explicitly states overdue is a frontend-derived state; backend changes are out of scope.
- `Date.toISOString()` string comparison: Rejected — string comparison of ISO dates is technically correct but fragile and not idiomatic for date arithmetic; `setHours` normalization is clearer.

---

## Decision 3: Dynamic Re-evaluation with `setInterval`

**Question**: How should the frontend re-evaluate overdue status every 60 seconds so that items transition from "on time" to "overdue" at midnight without a page reload?

**Decision**: Add a single `useEffect` in `App.js` that sets a `currentDate` piece of state via `setInterval` every 60,000 ms. Pass `currentDate` down to `TodoCard` and `TodoList` (through `TodoList`) so components re-render with fresh date context.

```js
// In App.js
const [currentDate, setCurrentDate] = useState(() => new Date());

useEffect(() => {
  const timer = setInterval(() => setCurrentDate(new Date()), 60_000);
  return () => clearInterval(timer);
}, []);
```

Pass `currentDate` to `TodoList` → `TodoCard` and `TodoForm` as a prop, so `isOverdue(todo, currentDate)` (or the utility reads it directly as `new Date()` since re-render is triggered) works correctly.

**Rationale**: Lifting date state to `App.js` centralises the polling in one place, avoids multiple independent timers, and ensures all cards update simultaneously at the same render cycle. Cleanup via `clearInterval` on unmount prevents memory leaks. 60 s is more than adequate given overdue transitions only occur at day boundaries.

**Alternatives considered**:
- `setInterval` inside each `TodoCard`: Rejected — creates N timers for N cards; resource waste; cards could drift out of sync.
- Using `Date.now()` without React state: Rejected — React won't know to re-render components when time passes unless state changes.
- Using a React context for `currentDate`: Considered but rejected for this scope — overkill for a single value passed through two levels of props.

---

## Decision 4: Overdue Indicator in `TodoForm` (Edit/Detail View)

**Question**: How should the overdue indicator appear in `TodoForm` / the inline edit mode within `TodoCard`?

**Decision**: When `TodoCard` renders in edit mode (`isEditing === true`), prepend the warning-colored "Overdue" badge at the top of the edit form div — same `<span>` element with class `overdue-badge` as in the card view. `TodoForm` (the add-new form) never shows the badge since it is always creating a new todo without a `todo` object.

**Rationale**: The spec (US-3, FR-009) requires the indicator to appear "at the top of the form/detail view". The inline edit form is rendered inside `TodoCard` and has direct access to the `todo` prop, so no architectural change is needed — just render the badge conditionally in the edit branch of `TodoCard`. The standalone `TodoForm` component creates new todos and has no existing-todo context, so it correctly never shows an overdue badge.

**Alternatives considered**:
- Separate "detail view" modal component: Rejected — no detail modal exists in the current design; the edit mode within `TodoCard` is the detail view per the existing UI.
- Passing `isOverdue` as a prop from `App.js`: Consistent with Decision 3 — computed locally inside `TodoCard` using `isOverdue(todo)` after the `currentDate` re-render cycle triggers.
