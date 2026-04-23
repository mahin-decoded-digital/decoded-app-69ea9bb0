import { create } from 'zustand';
import { apiUrl } from '@/lib/api';
import { PayoutRecord } from '../types';

interface CompensationState {
  payouts: PayoutRecord[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  fetchPayouts: () => Promise<void>;
  generatePayouts: (period: string, authors: { id: string, baseRate: number, model: string }[], contentMetrics: { authorId: string, reads: number, emojis: number }[]) => Promise<void>;
  markPaid: (id: string) => Promise<void>;
}

export const useCompensationStore = create<CompensationState>((set, get) => ({
  payouts: [],
  loading: false,
  loaded: false,
  error: null,
  fetchPayouts: async () => {
    if (get().loading || get().loaded) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch(apiUrl('/api/compensation'));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payouts = await res.json();
      set({ payouts, loading: false, loaded: true });
    } catch (err) {
      set({ loading: false, error: err instanceof Error ? err.message : 'Failed to load' });
    }
  },
  generatePayouts: async (period, authors, contentMetrics) => {
    try {
      const res = await fetch(apiUrl('/api/compensation/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period, authors, contentMetrics })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const newPayouts = await res.json();
      set(s => ({ payouts: [...newPayouts, ...s.payouts] }));
    } catch (err) {
      console.error(err);
    }
  },
  markPaid: async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/compensation/${id}/markPaid`), { method: 'PUT' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      set(s => ({ payouts: s.payouts.map(p => p.id === id ? updated : p) }));
    } catch (err) {
      console.error(err);
    }
  }
}));