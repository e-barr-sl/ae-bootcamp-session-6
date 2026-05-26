import React, { useState } from 'react';
import { isOverdue } from '../utils/overdueUtils';

function TodoForm({ onSubmit, isLoading, todo }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Todo title cannot be empty');
      return;
    }

    if (title.length > 255) {
      setError('Todo title cannot exceed 255 characters');
      return;
    }

    try {
      setError(null);
      await onSubmit(title.trim(), dueDate || null);
      setTitle('');
      setDueDate('');
    } catch (err) {
      setError(err.message || 'Failed to create todo');
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (error) {
      setError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      {todo && isOverdue(todo) && (
        <span className="overdue-badge" aria-label="Overdue" style={{ color: 'var(--warning-color)', fontSize: '12px', fontWeight: 600 }}>Overdue</span>
      )}
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Add a new todo..."
          maxLength={255}
          disabled={isLoading}
          className="form-input"
          aria-label="Todo title"
        />
        <span className="char-count">{title.length}/255</span>
      </div>

      <div className="form-row">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isLoading}
          className="form-input"
          aria-label="Due date"
        />
        <button type="submit" disabled={isLoading} className="btn btn-primary">
          {isLoading ? 'Adding...' : 'Add Todo'}
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}
    </form>
  );
}

export default TodoForm;
