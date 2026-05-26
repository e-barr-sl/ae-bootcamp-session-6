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
