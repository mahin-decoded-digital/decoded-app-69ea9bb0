import { create } from 'zustand';
import { apiUrl } from '@/lib/api';
import { FlaggedItem } from '../types';

interface ModerationState {
  flags: FlaggedItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  fetchFlags: () => Promise<void>;
  addFlag: (contentId: string, reason: string, reportedBy?: string) => Promise<void>;
  updateFlagStatus: (id: string, status: FlaggedItem['status']) => Promise<void>;
}

export const useModerationStore = create<ModerationState>((set, get) => ({
  flags: [],
  loading: false,
  loaded: false,
  error: null,
  fetchFlags: async () => {
    if (get().loading || get().loaded) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch(apiUrl('/api/moderation'));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const flags = await res.json();
      set({ flags, loading: false, loaded: true });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'Failed to load' });
    }
  },
  addFlag: async (contentId, reason, reportedBy) => {
    try {
      const res = await fetch(apiUrl('/api/moderation'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, reason, reportedBy })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const created = await res.json();
      set(s => ({ flags: [created, ...s.flags] }));
    } catch (err) {
      console.error(err);
    }
  },
  updateFlagStatus: async (id, status) => {
    try {
      const res = await fetch(apiUrl(`/api/moderation/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      set(s => ({ flags: s.flags.map(f => f.id === id ? updated : f) }));
    } catch (err) {
      console.error(err);
    }
  }
}));