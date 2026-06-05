import { create } from 'zustand';

export type UserRole = 'worshipper' | 'responder' | 'admin';

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthStore {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  setToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token: string, user: AuthUser) => {
    set({
      token,
      user,
      isAuthenticated: true,
    });
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  },

  clearAuth: () => {
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },

  setToken: (token: string) => {
    set({ token });
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  setUser: (user: AuthUser) => {
    set({ user });
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(user));
    }
  },
}));

// Initialize auth from localStorage on client
export const initializeAuth = () => {
  if (typeof window === 'undefined') return;

  const token = localStorage.getItem('auth_token');
  const userJson = localStorage.getItem('auth_user');

  if (token && userJson) {
    try {
      const user = JSON.parse(userJson) as AuthUser;
      useAuthStore.setState({
        token,
        user,
        isAuthenticated: true,
      });
    } catch (e) {
      console.error('Failed to parse auth user:', e);
      useAuthStore.getState().clearAuth();
    }
  }
};
