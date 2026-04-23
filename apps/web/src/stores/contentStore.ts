import { create } from 'zustand';
import { apiUrl } from '@/lib/api';
import { ContentItem, ContentStatus, EmojiRating } from '../types';

interface ContentState {
  items: ContentItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'reads' | 'timeOnPage' | 'ratings' | 'complianceChecked'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<ContentItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  updateStatus: (id: string, status: ContentStatus) => Promise<void>;
  addRating: (id: string, emoji: keyof EmojiRating) => Promise<void>;
  incrementRead: (id: string, timeSpent: number) => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
  items: [],
  loading: false,
  loaded: false,
  error: null,
  fetchItems: async () => {
    if (get().loading || get().loaded) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch(apiUrl('/api/content'));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const items = await res.json();
      set({ items, loading: false, loaded: true });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'Failed to load' });
    }
  },
  addItem: async (item) => {
    try {
      const res = await fetch(apiUrl('/api/content'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const created = await res.json();
      set(s => ({ items: [created, ...s.items] }));
    } catch (err) {
      console.error(err);
    }
  },
  updateItem: async (id, updates) => {
    try {
      const res = await fetch(apiUrl(`/api/content/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      set(s => ({ items: s.items.map(i => i.id === id ? updated : i) }));
    } catch (err) {
      console.error(err);
    }
  },
  deleteItem: async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/content/${id}`), { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      set(s => ({ items: s.items.filter(i => i.id !== id) }));
    } catch (err) {
      console.error(err);
    }
  },
  updateStatus: async (id, status) => {
    try {
      const res = await fetch(apiUrl(`/api/content/${id}/status`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      set(s => ({ items: s.items.map(i => i.id === id ? updated : i) }));
    } catch (err) {
      console.error(err);
    }
  },
  addRating: async (id, emoji) => {
    try {
      const res = await fetch(apiUrl(`/api/content/${id}/rating`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      set(s => ({ items: s.items.map(i => i.id === id ? updated : i) }));
    } catch (err) {
      console.error(err);
    }
  },
  incrementRead: async (id, timeSpent) => {
    try {
      const res = await fetch(apiUrl(`/api/content/${id}/read`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeSpent })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      set(s => ({ items: s.items.map(i => i.id === id ? updated : i) }));
    } catch (err) {
      console.error(err);
    }
  }
}));