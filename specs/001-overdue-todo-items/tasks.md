---

description: "Task list for Support for Overdue Todo Items"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `specs/001-overdue-todo-items/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/TodoCard.contract.md ✅, quickstart.md ✅

**Scope**: Frontend-only changes — no backend modifications required.

**Tests**: Included — TDD is a project constitution principle; `isOverdue` unit tests and updated component tests for `TodoCard`/`TodoForm` are explicitly required (plan.md, Constitution Check II).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the design-system token that all overdue indicator renders depend on. Must be complete before any component work.

- [X] T001 Add `--warning-color` CSS custom properties (light: `#b45309`, dark: `#f59e0b`) to both `:root` and `[data-theme="dark"]` blocks in `packages/frontend/src/styles/theme.css`, following the existing `--success-color` / `--danger-color` pattern

**Checkpoint**: `--warning-color` is available to all components in light and dark mode

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared `isOverdue(todo)` utility that every user story's component work depends on. This phase must be fully complete before any Phase 3+ work begins.

**⚠️ CRITICAL**: No user story implementation can start until `overdueUtils` is implemented and its tests pass.

- [X] T002 [P] Create `packages/frontend/src/utils/__tests__/overdueUtils.test.js` covering all four truth-table cases from data-model.md: `null` dueDate → false; today's date → false; past date + incomplete → true; past date + completed → false. Verify tests **fail** before proceeding to T003.
- [X] T003 Create `packages/frontend/src/utils/overdueUtils.js` and implement `export function isOverdue(todo)` using the logic from research.md Decision 2: early-return on `!todo.dueDate || todo.completed`, normalize both dates with `setHours(0,0,0,0)`, and return `due < today`. Verify T002 tests now **pass**.

**Checkpoint**: `overdueUtils` is implemented, all unit tests pass — user story phases can now begin

---

## Phase 3: User Story 1 — Visual Identification of Overdue Items (Priority: P1) 🎯 MVP

**Goal**: Incomplete todo cards with a past due date display a warning-colored "Overdue" text badge in the list view and while in edit mode on the card.

**Independent Test**: Create a todo with a due date of yesterday (incomplete) → badge appears. Create a todo due today or with no due date → no badge. Mark the overdue todo complete → badge disappears immediately. Unmark it → badge reappears immediately.

### Tests for User Story 1

> **NOTE: Write these tests FIRST and confirm they FAIL before updating TodoCard.js**

- [X] T004 [P] [US1] Extend `packages/frontend/src/components/__tests__/TodoCard.test.js` with overdue badge scenarios per the TodoCard.contract.md rendering contract: past due + incomplete → badge renders with `className="overdue-badge"` and `aria-label="Overdue"`; due today + incomplete → no badge; completed + past due → no badge; no dueDate → no badge; edit mode + overdue → badge renders inside `.edit-form`

### Implementation for User Story 1

- [X] T005 [US1] Update `packages/frontend/src/components/TodoCard.js`: import `isOverdue` from `../utils/overdueUtils`; in the card view render a `<span className="overdue-badge" aria-label="Overdue" style={{color: 'var(--warning-color)', fontSize: '12px', fontWeight: 600}}>Overdue</span>` directly below the title and above the due date when `isOverdue(todo)` is true; in the edit view render the same badge at the top of the `.edit-form` div before the title input when `isEditing && isOverdue(todo)`. Verify T004 tests now **pass**.

**Checkpoint**: User Story 1 is fully functional and independently testable. Incomplete todos with past due dates show the amber "Overdue" badge; no other todos do.

---

## Phase 4: User Story 2 — Overdue Status Updates Dynamically (Priority: P2)

**Goal**: The overdue indicator re-evaluates every 60 seconds without a page reload, so todos transition to overdue at midnight automatically.

**Independent Test**: Observe that the `currentDate` state updates and triggers a re-render every 60 s (verified via test mocking `setInterval`). Confirm the interval is cleaned up on unmount (no memory leak).

### Tests for User Story 2

> **NOTE: Write this test FIRST and confirm it FAILS before updating App.js**

- [X] T006 [P] [US2] Extend `packages/frontend/src/__tests__/App.test.js` (or create if absent) with a test that mocks `setInterval` / `jest.useFakeTimers()`, advances time by 60 s, and asserts that the component re-renders (i.e., `setCurrentDate` is called), and a test that confirms `clearInterval` is called on unmount

### Implementation for User Story 2

- [X] T007 [US2] Update `packages/frontend/src/App.js`: add `const [currentDate, setCurrentDate] = useState(() => new Date())` and a `useEffect` that creates `const timer = setInterval(() => setCurrentDate(new Date()), 60_000)` and returns `() => clearInterval(timer)` as its cleanup; import `useState` and `useEffect` from React if not already imported. Verify T006 tests now **pass**.

**Checkpoint**: User Story 2 is functional. The app re-evaluates overdue status every 60 s; the interval is cleaned up on unmount.

---

## Phase 5: User Story 3 — Overdue Status in Todo Detail / Edit View (Priority: P3)

**Goal**: When a user opens a todo in the `TodoForm` detail/edit view (standalone form, not the inline card editor), the same warning-colored "Overdue" badge is displayed at the top of the form if the todo is overdue.

**Independent Test**: Open an overdue todo in `TodoForm` → badge renders with `aria-label="Overdue"`. Open a non-overdue todo → no badge. Completed todo with past due date → no badge.

### Tests for User Story 3

> **NOTE: Write these tests FIRST and confirm they FAIL before updating TodoForm.js**

- [X] T008 [P] [US3] Extend `packages/frontend/src/components/__tests__/TodoForm.test.js` with overdue badge scenarios per the TodoCard.contract.md: past due + incomplete → badge renders with `className="overdue-badge"` and `aria-label="Overdue"` at the top of the form; due today + incomplete → no badge; completed + past due → no badge; no dueDate → no badge

### Implementation for User Story 3

- [X] T009 [US3] Update `packages/frontend/src/components/TodoForm.js`: import `isOverdue` from `../utils/overdueUtils`; render `<span className="overdue-badge" aria-label="Overdue" style={{color: 'var(--warning-color)', fontSize: '12px', fontWeight: 600}}>Overdue</span>` at the top of the form's root element (before the title input) when `isOverdue(todo)` is true. Verify T008 tests now **pass**.

**Checkpoint**: All three user stories are complete and independently testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, accessibility verification, and cleanup across all stories.

- [X] T010 [P] Verify WCAG 2.1 AA compliance: confirm `--warning-color` values (`#b45309` on white, `#f59e0b` on `#2d2d2d`) are applied correctly in both themes by toggling dark mode in the running app and visually inspecting the "Overdue" badge on a past-due todo card
- [X] T011 Run the full test suite (`npm test` from repo root) and confirm all tests pass with ≥ 80% coverage; fix any regressions
- [X] T012 Execute the manual verification steps from `specs/001-overdue-todo-items/quickstart.md` (create past-due todo, verify badge; toggle completion, verify badge disappears; edit due date to past, verify badge appears immediately; verify dark mode badge visibility)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001) — **BLOCKS all user stories** (T002/T003 need CSS token in place)
- **User Story phases (3–5)**: All depend on Phase 2 completion (T003 must be done)
  - US1 (Phase 3), US2 (Phase 4), and US3 (Phase 5) can proceed in parallel once Phase 2 is complete
- **Polish (Phase 6)**: Depends on all desired user story phases being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2 only — no dependency on US2 or US3
- **US2 (P2)**: Depends on Phase 2 only — no dependency on US1 or US3
- **US3 (P3)**: Depends on Phase 2 only — no dependency on US1 or US2

### Within Each User Story

- Tests (T004, T006, T008) MUST be written and confirmed **failing** before implementation (T005, T007, T009)
- Tests are marked [P] within their story because they can be written concurrently with tests from other stories

### Parallel Opportunities (within Phase 2)

- T002 (overdueUtils tests) can be written in parallel with T001 (theme.css) since they are in different files

### Parallel Opportunities (across stories — Phase 3, 4, 5)

Once T003 is done, the following can proceed simultaneously:

```
T004 [US1 tests]  ──►  T005 [US1 impl]
T006 [US2 tests]  ──►  T007 [US2 impl]
T008 [US3 tests]  ──►  T009 [US3 impl]
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002 → T003)
3. Complete Phase 3: User Story 1 (T004 → T005)
4. **STOP and VALIDATE**: Run `cd packages/frontend && npm test -- --testPathPattern="overdueUtils|TodoCard"` and perform manual verification per quickstart.md
5. Proceed to Phase 4 (US2) and Phase 5 (US3) in priority order

### Full Delivery

Complete all phases in order (or parallelize Phases 3–5 with team capacity), then run Phase 6 polish tasks.
