import { create } from 'zustand';

let nextId = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  push: (message, type = 'info', durationMs = 4000) => {
    const id = ++nextId;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    if (durationMs > 0) {
      setTimeout(() => {
        if (get().toasts.some((t) => t.id === id)) {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }
      }, durationMs);
    }
    return id;
  },
}));

export const toast = {
  success: (message) => useToastStore.getState().push(message, 'success'),
  error: (message) => useToastStore.getState().push(message, 'error', 5000),
  info: (message) => useToastStore.getState().push(message, 'info'),
};
