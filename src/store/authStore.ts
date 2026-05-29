import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/api/client';
import { AUTH_ENDPOINTS } from '@/api/endpoints';
import { STORAGE_KEYS } from '@/config/constants';
import type { User, LoginCredentials, AuthResponse } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
          
          const { token, user } = response;
          
          // Store token in localStorage
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Reset state
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
        if (user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        } else {
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      },

      setToken: (token: string | null) => {
        set({ token, isAuthenticated: !!token });
        if (token) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        } else {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        set({ isLoading: true });
        
        try {
          const user = await api.get<User>(AUTH_ENDPOINTS.ME);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          // Token is invalid, clear auth state
          get().logout();
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Made with Bob
