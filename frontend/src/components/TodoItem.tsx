'use client';

import { useState } from 'react';
import { Todo } from '@/types';
import { todoAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (todoId: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const result = await todoAPI.updateTodo(todo.id, { completed: !todo.completed });
      onUpdate(result.todo);
      toast.success('Todo updated successfully!');
    } catch (error: any) {
      console.error('Error updating todo:', error);
      toast.error(error.response?.data?.error || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editTitle.trim()) {
      toast.error('Title cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const result = await todoAPI.updateTodo(todo.id, {
        title: editTitle,
        description: editDescription,
      });
      onUpdate(result.todo);
      setIsEditing(false);
      toast.success('Todo updated successfully!');
    } catch (error: any) {
      console.error('Error updating todo:', error);
      toast.error(error.response?.data?.error || 'Failed to update todo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    setLoading(true);
    try {
      await todoAPI.deleteTodo(todo.id);
      onDelete(todo.id);
      toast.success('Todo deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting todo:', error);
      toast.error(error.response?.data?.error || 'Failed to delete todo');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
      todo.completed ? 'border-green-500 bg-green-50' : 'border-blue-500'
    }`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Todo title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Todo description (optional)"
            rows={3}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditTitle(todo.title);
                setEditDescription(todo.description);
              }}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={handleToggleComplete}
                disabled={loading}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`mt-1 text-sm ${
                    todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
                  }`}>
                    {todo.description}
                  </p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  <p>Created: {formatDate(todo.created_at)}</p>
                  {todo.updated_at !== todo.created_at && (
                    <p>Updated: {formatDate(todo.updated_at)}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
