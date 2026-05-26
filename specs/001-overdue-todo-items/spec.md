# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`

**Created**: 2026-05-26

**Status**: Draft

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identification of Overdue Items (Priority: P1)

A user opens the todo list and immediately sees which incomplete items are past their due date, without needing to compare dates manually.

**Why this priority**: This is the core value of the feature. Without visual identification, users cannot benefit from overdue awareness at all.

**Independent Test**: Can be fully tested by creating a todo with a past due date, leaving it incomplete, then viewing the list — the item should be clearly distinguishable from non-overdue items and delivers immediate overdue awareness.

**Acceptance Scenarios**:

1. **Given** a todo with a due date in the past and status incomplete, **When** the user views the todo list, **Then** the todo card displays a warning-colored "Overdue" text label.
2. **Given** a todo with a due date in the past and status complete, **When** the user views the todo list, **Then** the todo is NOT marked as overdue (completed items cannot be overdue).
3. **Given** a todo with a due date today (current date) and status incomplete, **When** the user views the todo list, **Then** the todo is NOT marked as overdue (due today is not yet overdue).
4. **Given** a todo with no due date set, **When** the user views the todo list, **Then** the todo is NOT marked as overdue.

---

### User Story 2 - Overdue Status Updates Dynamically (Priority: P2)

A user who leaves the application open across midnight sees previously on-time todos automatically become overdue when their due date passes.

**Why this priority**: Ensures the overdue indicator reflects the current state without requiring a page reload, making the feature reliable for active users.

**Dynamic Update Mechanism**: The frontend polls for date changes every 60 seconds (`setInterval` of 60,000 ms); no page reload is required.

**Independent Test**: Can be tested by observing a todo due "today" transition to overdue status as the date changes, or by simulating a date change.

**Acceptance Scenarios**:

1. **Given** a todo with a due date of today (not yet overdue), **When** the date advances past the due date, **Then** the todo is displayed as overdue without the user needing to refresh the page.
2. **Given** a previously overdue todo that is now marked complete, **When** the user views the list, **Then** the overdue indicator is immediately removed.

---

### User Story 3 - Overdue Items Accessible in Todo Detail View (Priority: P3)

A user editing or reviewing a specific todo can see whether that item is currently overdue.

**Why this priority**: Provides contextual awareness when viewing a single item's details, helping users understand urgency at the time of editing.

**Independent Test**: Can be tested by opening an overdue todo in detail/edit mode and confirming overdue status is visible.

**Acceptance Scenarios**:

1. **Given** an overdue todo, **When** the user opens it to view or edit details, **Then** the same warning-colored "Overdue" text label is displayed at the top of the form/detail view.
2. **Given** a non-overdue todo, **When** the user opens it, **Then** no overdue indicator is shown.

---

### Edge Cases

- What happens when a todo has a due date set to exactly midnight today — is it overdue or current?
- How is overdue status determined if the user's device clock is incorrect?
- What happens when a completed todo's completion status is toggled back to incomplete and the due date is in the past — does it immediately show as overdue?
- What happens when a todo with no due date has a due date added that is in the past? → Resolved by FR-009: the overdue indicator appears immediately upon saving the edit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display a visual overdue indicator on any incomplete todo whose due date is strictly before the current date (today is not overdue).
- **FR-002**: The system MUST NOT display an overdue indicator on completed todos, regardless of their due date.
- **FR-003**: The system MUST NOT display an overdue indicator on todos with no due date set.
- **FR-004**: The overdue indicator MUST be a warning-colored "Overdue" text label rendered on the todo card, so it is perceivable without relying solely on color.
- **FR-005**: The overdue determination MUST be based on the user's local date at the time of display.
- **FR-006**: When a user marks an overdue todo as complete, the overdue indicator MUST be removed immediately without a page reload.
- **FR-007**: When a user marks a completed todo back to incomplete and its due date is in the past, the overdue indicator MUST appear immediately.
- **FR-008**: The todo list view MUST show the overdue indicator alongside existing due date and completion status information.
- **FR-009**: When a user saves an edit to a todo's due date that results in a past date (and the todo is incomplete), the overdue indicator MUST appear immediately without a page reload.

### Key Entities

- **Todo Item**: Existing entity with title, optional due date, and completion status. Overdue is a derived state (not stored), calculated as: `!completed && dueDate < today`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all overdue todos at a glance without reading any date values — overdue items are visually differentiated within 1 second of page load.
- **SC-002**: 100% of incomplete todos with due dates before today display the overdue indicator; 0% of completed todos display the indicator.
- **SC-003**: Toggling a todo's completion status updates the overdue indicator in under 500ms with no page reload required.
- **SC-004**: The "Overdue" text label meets WCAG 2.1 Level AA — warning color has a contrast ratio ≥ 4.5:1 against its background, and the label is accessible to screen readers.

## Assumptions

- Overdue status is a derived/computed property — it is not stored in the backend; the frontend calculates it from the existing due date and completion fields.
- The existing todo data model already includes a due date field; no schema changes to the backend are required.
- The application is single-user and single-timezone; overdue calculation is based on the user's local device date.
- "Overdue" means the due date is strictly before today's date (i.e., yesterday or earlier); a todo due today is not yet overdue.
- No new filtering or sorting by overdue status is required in this feature (that would be a separate feature).
- The visual treatment for overdue items will follow the existing design system and color palette defined in the UI guidelines.
- The frontend re-evaluates overdue status on a 60-second polling interval (`setInterval` of 60,000 ms); this is sufficient since overdue transitions occur at day boundaries.

## Clarifications

### Session 2026-05-26

- Q: How frequently should the app re-check whether todos have become overdue for dynamic updates? → A: Poll every 60 seconds (setInterval of 60,000 ms)
- Q: What specific visual treatment should the overdue indicator use? → A: Warning-colored "Overdue" text label on the todo card
- Q: When a todo's due date is edited to a past value, when should the overdue indicator appear? → A: Immediately on save (no page reload)
- Q: What WCAG level should the overdue indicator meet? → A: WCAG 2.1 Level AA (contrast ratio ≥ 4.5:1, screen-reader compatible)
- Q: How should overdue status appear in the detail/form view (US-3)? → A: Same warning-colored "Overdue" text label at the top of the form
