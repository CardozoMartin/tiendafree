import { create } from 'zustand';

interface SessionStore {
  cliente: any | null;
  login: (data: any) => void;
  logout: () => void;
}

export const useAuthSessionStore = create<SessionStore>((set) => ({
  cliente: null,
  login: (data) => set({ cliente: data }),
  logout: () => set({ cliente: null }),
}));
