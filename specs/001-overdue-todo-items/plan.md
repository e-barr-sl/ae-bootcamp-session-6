# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todo-items` | **Date**: 2026-05-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-overdue-todo-items/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Add a visual "Overdue" text label to incomplete todo items whose due date is strictly before today's local date. Overdue status is a purely derived, frontend-only computation (`!completed && dueDate < today`); no backend changes are required. The indicator re-evaluates on a 60-second `setInterval` and immediately on any state change (toggle completion, edit due date). Both list view (`TodoCard`) and detail/edit view (`TodoForm`) must display the label using a new `--warning-color` CSS token that satisfies WCAG 2.1 AA (≥ 4.5:1 contrast).

## Technical Context

**Language/Version**: JavaScript (ES2022) — React 18.2 (frontend), Node.js + Express (backend)

**Primary Dependencies**: React 18.2, react-scripts 5.0.1, Jest 27, @testing-library/react 14

**Storage**: No storage changes — overdue is a derived state computed from existing `dueDate` and `completed` fields; no backend or schema modifications required

**Testing**: Jest + @testing-library/react (frontend unit/component tests), Jest (backend); target ≥ 80% coverage per constitution

**Target Platform**: Web browser, desktop-focused (Chrome/Firefox/Safari latest)

**Project Type**: Web application — npm workspaces monorepo (`packages/frontend` + `packages/backend`)

**Performance Goals**: Overdue indicator visible within 1 second of page load (SC-001); completion toggle updates indicator in < 500 ms (SC-003)

**Constraints**: No new runtime npm dependencies without documented justification; no backend changes; `setInterval` polling at 60 s; WCAG 2.1 AA contrast (≥ 4.5:1) for warning color

**Scale/Scope**: Single-user app; ~dozens of todos; change affects `TodoCard`, `TodoForm`, and `App` components plus a new `isOverdue` utility

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-First Architecture | ✅ PASS | `isOverdue` extracted as a pure utility; `TodoCard` and `TodoForm` remain single-responsibility; no new god components |
| II. Test-Driven Development | ✅ PASS | New unit tests required for `isOverdue` utility and updated component tests for `TodoCard`/`TodoForm`; 80%+ coverage target maintained |
| III. Code Quality & Simplicity | ✅ PASS | Overdue is derived state (KISS); no duplication — single `isOverdue(todo)` helper used by all views (DRY) |
| IV. Consistent Code Style | ✅ PASS | Follow existing ESLint config, camelCase, 2-space indent, ≤ 100 char lines |
| V. UI Design System Compliance | ⚠️ CONDITIONAL PASS | Must add `--warning-color` token to `theme.css` (light and dark values) following the existing CSS custom property pattern — no ad-hoc inline colors |

**Post-design re-check**: ✅ All gates pass. The `--warning-color` addition is a minimal, in-system extension: it follows the same pattern as `--success-color` and `--danger-color`, using separate light/dark values in `theme.css`.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── TodoCard.contract.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js          # MODIFY: add isOverdue indicator render
│   │   ├── TodoForm.js          # MODIFY: add isOverdue indicator render
│   │   └── __tests__/
│   │       ├── TodoCard.test.js # MODIFY: add overdue scenario tests
│   │       └── TodoForm.test.js # MODIFY: add overdue scenario tests
│   ├── utils/
│   │   ├── overdueUtils.js      # NEW: isOverdue(todo) pure function
│   │   └── __tests__/
│   │       └── overdueUtils.test.js  # NEW: unit tests
│   ├── App.js                   # MODIFY: add 60s setInterval for date refresh
│   └── styles/
│       └── theme.css            # MODIFY: add --warning-color token (light + dark)
└── ...

packages/backend/
└── (no changes)
```

**Structure Decision**: Option 2 (web application, monorepo). All changes are frontend-only. A new `utils/` directory is introduced under `packages/frontend/src/` for the pure `isOverdue` helper, following the existing `services/` pattern for non-component modules.
