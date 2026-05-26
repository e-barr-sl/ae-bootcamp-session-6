import { isOverdue } from '../overdueUtils';

describe('isOverdue', () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const todayStr = today.toISOString().split('T')[0];

  it('should return false when dueDate is null', () => {
    const todo = { completed: false, dueDate: null };
    expect(isOverdue(todo)).toBe(false);
  });

  it('should return false when dueDate is today', () => {
    const todo = { completed: false, dueDate: todayStr };
    expect(isOverdue(todo)).toBe(false);
  });

  it('should return true when dueDate is in the past and todo is incomplete', () => {
    const todo = { completed: false, dueDate: yesterdayStr };
    expect(isOverdue(todo)).toBe(true);
  });

  it('should return false when dueDate is in the past but todo is completed', () => {
    const todo = { completed: true, dueDate: yesterdayStr };
    expect(isOverdue(todo)).toBe(false);
  });
});
