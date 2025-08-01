'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { todoAPI } from '@/lib/api';
import { Todo } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import CreateTodoForm from '@/components/CreateTodoForm';
import TodoItem from '@/components/TodoItem';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoAPI.getTodos();
      setTodos(response.todos);
    } catch (error: any) {
      console.error('Error fetching todos:', error);
      toast.error('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleTodoCreated = (newTodo: Todo) => {
    setTodos(prev => [newTodo, ...prev]);
  };

  const handleTodoUpdated = (updatedTodo: Todo) => {
    setTodos(prev => prev.map(todo => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    ));
  };

  const handleTodoDeleted = (todoId: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your todos and stay organized
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  📋
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Todos</p>
                  <p className="text-2xl font-semibold text-gray-900">{todos.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  ⏳
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-semibold text-gray-900">{activeCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  ✅
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">{completedCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Todo Form */}
          <CreateTodoForm onTodoCreated={handleTodoCreated} />

          {/* Filter Buttons */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md font-medium ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All ({todos.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-md font-medium ${
                  filter === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-md font-medium ${
                  filter === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>

          {/* Todos List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No todos yet' : `No ${filter} todos`}
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Create your first todo to get started!' 
                  : `You don't have any ${filter} todos.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleTodoUpdated}
                  onDelete={handleTodoDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
