<!--
SYNC IMPACT REPORT
==================
Version change: (unversioned template) → 1.0.0
Added sections:
  - Core Principles (5 principles derived from docs/)
  - Technical Constraints
  - Development Workflow
  - Governance
Removed sections: all placeholder tokens replaced; no tokens left
Modified principles: N/A (initial ratification)
Templates reviewed:
  - .specify/templates/plan-template.md ✅ compatible (Constitution Check section is generic)
  - .specify/templates/spec-template.md ✅ compatible
  - .specify/templates/tasks-template.md ✅ compatible
Follow-up TODOs: none — all fields resolved from existing docs
-->

# Copilot Bootcamp Todo App Constitution

## Core Principles

### I. Component-First Architecture

Every React component MUST have a single, well-defined responsibility and be independently
testable. Components MUST be named in PascalCase with file names matching the component name
(e.g., `TodoCard.js`, `TodoList.js`). Components MUST be reusable; common UI patterns MUST be
extracted into shared components rather than duplicated. Each component file MUST follow the
declaration order: imports → constants → main component → helper functions → exports.

**Rationale**: A component-first approach keeps the UI layer modular, testable, and maintainable
as the feature set grows. Single responsibility prevents "god components" and makes debugging
straightforward.

### II. Test-Driven Development (NON-NEGOTIABLE)

Tests MUST be written as part of the development process, describing expected behavior before or
alongside implementation. The target code coverage is 80%+ across all packages (frontend and
backend). Each test MUST be fully isolated: no shared mutable state between tests; all external
dependencies (API calls, timers) MUST be mocked. Tests are stored in `__tests__/` directories
colocated with their source files and named `{filename}.test.js`. Test names MUST clearly describe
the behavior under test in plain language.

**Rationale**: Reliable tests are the primary safety net for refactoring and feature additions.
Co-location keeps tests discoverable; isolation prevents flaky test suites.

### III. Code Quality & Simplicity (DRY · KISS · SOLID)

- **DRY**: Identical logic appearing in more than one place MUST be extracted into a shared
  function, utility module, or component.
- **KISS**: Simple, readable implementations are preferred over clever or over-engineered ones.
  Optimize only when a concrete performance requirement demands it.
- **Single Responsibility**: Every function, module, and component MUST have exactly one reason to
  change. Complex logic MUST be broken into smaller, named units.
- No unused variables, no circular imports, no console statements in production code.

**Rationale**: These principles collectively reduce defect density and lower the cognitive load
for future maintainers and AI coding assistants.

### IV. Consistent Code Style

All code MUST conform to the following conventions enforced by ESLint:

- **Indentation**: 2 spaces (JS, JSON, CSS, Markdown)
- **Naming**: `camelCase` for variables/functions; `UPPER_SNAKE_CASE` for constants;
  `PascalCase` for classes and React components
- **Imports**: ordered external → internal → styles, each group separated by a blank line; named
  imports for multi-exports, default imports for single exports; relative paths for internal modules
- **Line length**: ≤ 100 characters
- **Trailing whitespace**: MUST be removed; LF line endings required

All ESLint errors and warnings MUST be resolved before opening a pull request.

**Rationale**: Consistent style eliminates style-related review noise and keeps AI-generated code
predictable and reviewable.

### V. UI Design System Compliance

All UI work MUST follow the Material Design-inspired Halloween-themed design system documented in
`docs/ui-guidelines.md`:

- **Color tokens**: Use the defined light/dark mode palette; do not introduce ad-hoc colors.
- **Spacing**: MUST use the 8px grid system (xs=8px, sm=16px, md=24px, lg=32px, xl=48px).
- **Typography**: MUST use system fonts and the defined size/weight scale.
- **Layout**: Single-column, max-width 600px, desktop-focused; both light and dark modes MUST
  be supported via CSS custom properties.
- **Components**: Cards MUST use 8px border-radius and subtle shadow; interactive states MUST
  be instant (no animation delays unless specified).

**Rationale**: A unified design system ensures visual consistency and makes dark-mode support
predictable without per-component overrides.

## Technical Constraints

This project is a **single-user, full-stack JavaScript todo application** organized as an npm
workspaces monorepo:

- **Frontend**: React (`packages/frontend/`) communicating with the backend via REST API
- **Backend**: Node.js + Express.js (`packages/backend/`) serving as the persistence layer
- **Testing**: Jest for both frontend and backend; `@testing-library/react` for UI tests
- **Scope**: Single-user application — no authentication, no multi-user isolation, no priority
  levels, no filtering/search, no mobile-specific optimization
- No database schema changes beyond basic todo storage (title, due date, completion status)
- No new runtime dependencies may be introduced without documented justification

## Development Workflow

- Install all dependencies: `npm install` at the repository root
- Start full-stack dev environment: `npm run start` (starts both frontend and backend)
- Run all tests: `npm test` at the repository root
- Lint check: `npm run lint` — MUST pass before opening a PR
- Feature branches MUST be created from `main`; PRs require at least one review before merge
- All linting errors, test failures, and constitution principle violations MUST be resolved
  before a PR is approved

## Governance

This constitution supersedes all other informal practices. The `docs/` directory is the
authoritative source for project guidelines (`coding-guidelines.md`, `testing-guidelines.md`,
`ui-guidelines.md`, `functional-requirements.md`). Any amendment to this constitution MUST:

1. Be documented with a rationale
2. Increment the version number according to semantic versioning (MAJOR: principle
   removal/redefinition; MINOR: new principle or section; PATCH: wording/clarity fix)
3. Update `LAST_AMENDED_DATE`
4. Be propagated to affected template files if the change impacts plan/spec/tasks conventions

All PRs and code reviews MUST verify compliance with the five Core Principles above.

**Version**: 1.0.0 | **Ratified**: 2026-05-26 | **Last Amended**: 2026-05-26
