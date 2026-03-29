import { create } from 'zustand';

interface TiendaStore {
  tiendaId: number | null;
  setTiendaId: (id: number) => void;
}

export const useTiendaIDStore = create<TiendaStore>((set) => ({
  tiendaId: null,
  setTiendaId: (id) => set({ tiendaId: id }),
}));
