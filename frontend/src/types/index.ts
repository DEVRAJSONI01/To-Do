export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface ApiResponse<T> {
  message?: string;
  error?: string;
  data?: T;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
}
