import { useState } from 'react';

export const useCarrito = (_tiendaId: number) => {
  const [carrito] = useState({ items: [], total: 0, cantidad: 0 });

  return {
    carrito,
    isLoading: false,
    sessionId: 'mock-session-id',
    agregarAlCarrito: async (_data?: any) => {},
    isAgregando: false,
    actualizarCantidad: async (_data?: any) => {},
    isActualizando: false,
    eliminarItem: async (_id?: any) => {},
    isEliminando: false,
    vaciarCarrito: async () => {},
    isVaciando: false,
  };
};
