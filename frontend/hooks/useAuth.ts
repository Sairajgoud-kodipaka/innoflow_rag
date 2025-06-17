import { create } from 'zustand';
import { authService } from '@/lib/api/auth';
import { userService } from '@/lib/api/users';
import type { User } from '@/lib/api/users';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  login: async (username: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const response = await authService.login({ username, password });
      if (response.access) {
        const userData = await userService.getCurrentUser();
        set({ user: userData, isAuthenticated: true, loading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Login failed', 
        loading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      await authService.logout();
      set({ user: null, isAuthenticated: false, loading: false });
    } catch (error) {
      set({ 
        error: 'Logout failed', 
        loading: false 
      });
      throw error;
    }
  },

  signup: async (username: string, email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      await authService.signup({ username, email, password });
      const response = await authService.login({ username, password });
      if (response.access) {
        const userData = await userService.getCurrentUser();
        set({ user: userData, isAuthenticated: true, loading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.detail || 'Signup failed', 
        loading: false 
      });
      throw error;
    }
  }
})); 