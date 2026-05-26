# UI Contract: TodoCard Component

**Feature Branch**: `001-overdue-todo-items` | **Date**: 2026-05-26

Describes the updated component API and rendering contract for `TodoCard` after the overdue indicator feature is added.

---

## Component: `TodoCard`

**File**: `packages/frontend/src/components/TodoCard.js`

### Props (unchanged)

| Prop | Type | Required | Description |
|---|---|---|---|
| `todo` | `Object` | Yes | The todo item (see fields below) |
| `todo.id` | `number` | Yes | Unique identifier |
| `todo.title` | `string` | Yes | Display text |
| `todo.completed` | `boolean` | Yes | Completion state |
| `todo.dueDate` | `string \| null` | No | ISO date `YYYY-MM-DD` or `null` |
| `onToggle` | `Function(id)` | Yes | Called when completion checkbox is toggled |
| `onEdit` | `Function(id, title, dueDate)` | Yes | Called to save an edited todo |
| `onDelete` | `Function(id)` | Yes | Called to delete the todo |
| `isLoading` | `boolean` | No | Disables interactive controls when `true` |

> No new props are added. `currentDate` is **not** passed as a prop — `isOverdue()` calls `new Date()` internally; the parent `App.js` re-renders components via `setCurrentDate` state, which triggers a re-render of all `TodoCard` instances.

### Rendering Contract

#### Overdue Badge (card view)

- **Condition**: `isOverdue(todo) === true`
- **Element**: `<span className="overdue-badge" aria-label="Overdue">Overdue</span>`
- **Position**: Rendered in the content area, directly below the title and above the due date
- **Style**: `color: var(--warning-color); font-size: 12px; font-weight: 600;`

#### Overdue Badge (edit view)

- **Condition**: `isEditing === true && isOverdue(todo) === true`
- **Element**: Same `<span className="overdue-badge" aria-label="Overdue">Overdue</span>`
- **Position**: Rendered at the top of the `.edit-form` div, before the title input
- **Style**: same as card view

#### Completed State

- When `todo.completed === true`: overdue badge is **never** rendered (even if `dueDate` is in the past)

### Accessibility Requirements

- The `.overdue-badge` element MUST include `aria-label="Overdue"` for screen reader compatibility (SC-004)
- The badge MUST NOT rely solely on color — the text "Overdue" must be present as visible text (FR-004)

---

## Component: `TodoList`

**File**: `packages/frontend/src/components/TodoList.js`

No prop changes. `TodoList` passes the `todo` object through to `TodoCard` unchanged; the `isOverdue` computation happens inside `TodoCard`, not `TodoList`.

---

## Utility: `isOverdue`

**File**: `packages/frontend/src/utils/overdueUtils.js`

```
isOverdue(todo: { completed: boolean, dueDate: string | null }) → boolean
```

| Input | Output |
|---|---|
| `{ completed: false, dueDate: null }` | `false` |
| `{ completed: false, dueDate: "today" }` | `false` |
| `{ completed: false, dueDate: "yesterday" }` | `true` |
| `{ completed: true, dueDate: "yesterday" }` | `false` |

---

## App-Level Polling Contract

**File**: `packages/frontend/src/App.js`

A `currentDate` state variable is updated every 60,000 ms via `setInterval`. This triggers a re-render of the component tree, causing all `TodoCard` instances to re-evaluate `isOverdue(todo)` with the current date. The interval is cleaned up on component unmount.

```
setInterval(60_000) → setCurrentDate(new Date()) → App re-renders → TodoCard re-evaluates isOverdue
```
