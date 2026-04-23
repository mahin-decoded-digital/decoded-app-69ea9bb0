import { create } from 'zustand';
import { apiUrl } from '@/lib/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  loaded: boolean;
  fetchMe: () => Promise<void>;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  loaded: false,
  fetchMe: async () => {
    if (get().loading || get().loaded) return;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      set({ loaded: true });
      return;
    }
    set({ loading: true });
    try {
      const res = await fetch(apiUrl('/api/auth/me'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Not auth');
      const data = await res.json();
      set({ user: data.user, loading: false, loaded: true });
    } catch {
      localStorage.removeItem('auth_token');
      set({ user: null, loading: false, loaded: true });
    }
  },
  login: async (user) => {
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (!res.ok) throw new Error('Failed to login');
      const data = await res.json();
      localStorage.setItem('auth_token', data.token);
      set({ user: data.user });
    } catch (err) {
      console.error(err);
    }
  },
  logout: async () => {
    localStorage.removeItem('auth_token');
    set({ user: null });
  }
}));