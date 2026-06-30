import { useCallback, useState } from 'react';

export interface CarritoItem {
  id: number;
  productoId: number;
  cantidad: number;
  precioUnit: number | string;
  producto: any;
  varianteId?: number | null;
}

export interface Carrito {
  items: CarritoItem[];
  total: number;
  cantidad: number;
  sessionId?: string | null;
}

/**
 * Hook para manejar el carrito de compras
 * NOTA: Esta es una implementación local mientras se implementa el backend
 */
export const useCarrito = (tiendaId: number) => {
  const [carrito, setCarrito] = useState<Carrito>({ items: [], total: 0, cantidad: 0 });
  const [isLoading] = useState(false);
  const [isAgregando, setIsAgregando] = useState(false);
  const [isActualizando, setIsActualizando] = useState(false);
  const [isEliminando, setIsEliminando] = useState(false);
  const [isVaciando, setIsVaciando] = useState(false);
  const [sessionId] = useState<string>(() => `session-${tiendaId}-${Date.now()}`);

  // Agregar al carrito
  const agregarAlCarrito = useCallback(
    async (data: {
      productoId: number;
      cantidad: number;
      varianteId?: number | null;
      precioUnit?: number | string;
      producto?: any;
    }) => {
      if (!tiendaId) return;

      setIsAgregando(true);

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 300));

      setCarrito((prev) => {
        const existingItemIndex = prev.items.findIndex(
          (item) => item.productoId === data.productoId && item.varianteId === data.varianteId
        );

        let newItems;
        if (existingItemIndex >= 0) {
          // Actualizar cantidad si ya existe
          newItems = prev.items.map((item, idx) =>
            idx === existingItemIndex ? { ...item, cantidad: item.cantidad + data.cantidad } : item
          );
        } else {
          // Agregar nuevo item
          newItems = [
            ...prev.items,
            {
              id: Date.now(), // ID temporal
              productoId: data.productoId,
              cantidad: data.cantidad,
              precioUnit: data.precioUnit ?? 0,
              producto: data.producto,
              varianteId: data.varianteId,
            } as CarritoItem,
          ];
        }

        const total = newItems.reduce(
          (sum, item) => sum + Number(item.precioUnit) * item.cantidad,
          0
        );
        const cantidad = newItems.reduce((sum, item) => sum + item.cantidad, 0);

        return { items: newItems, total, cantidad, sessionId: prev.sessionId };
      });

      setIsAgregando(false);
      return { datos: { sessionId } };
    },
    [tiendaId, sessionId]
  );

  // Actualizar cantidad
  const actualizarCantidad = useCallback(async (data: { itemId: number; cantidad: number }) => {
    setIsActualizando(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    setCarrito((prev) => {
      if (data.cantidad <= 0) {
        // Eliminar si la cantidad es 0 o menor
        const newItems = prev.items.filter((item) => item.id !== data.itemId);
        const total = newItems.reduce(
          (sum, item) => sum + Number(item.precioUnit) * item.cantidad,
          0
        );
        const cantidad = newItems.reduce((sum, item) => sum + item.cantidad, 0);
        return { items: newItems, total, cantidad, sessionId: prev.sessionId };
      }

      const newItems = prev.items.map((item) =>
        item.id === data.itemId ? { ...item, cantidad: data.cantidad } : item
      );
      const total = newItems.reduce(
        (sum, item) => sum + Number(item.precioUnit) * item.cantidad,
        0
      );
      const cantidad = newItems.reduce((sum, item) => sum + item.cantidad, 0);

      return { items: newItems, total, cantidad, sessionId: prev.sessionId };
    });

    setIsActualizando(false);
  }, []);

  // Eliminar item
  const eliminarItem = useCallback(async (itemId: number) => {
    setIsEliminando(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    setCarrito((prev) => {
      const newItems = prev.items.filter((item) => item.id !== itemId);
      const total = newItems.reduce(
        (sum, item) => sum + Number(item.precioUnit) * item.cantidad,
        0
      );
      const cantidad = newItems.reduce((sum, item) => sum + item.cantidad, 0);
      return { items: newItems, total, cantidad, sessionId: prev.sessionId };
    });

    setIsEliminando(false);
  }, []);

  // Vaciar carrito
  const vaciarCarrito = useCallback(async () => {
    setIsVaciando(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    setCarrito({ items: [], total: 0, cantidad: 0, sessionId });
    setIsVaciando(false);
  }, [sessionId]);

  // Obtener carrito (no-op en implementación local)
  const getCarrito = useCallback(async () => {
    // No-op en implementación local
  }, []);

  return {
    carrito,
    isLoading,
    sessionId,
    agregarAlCarrito,
    isAgregando,
    actualizarCantidad,
    isActualizando,
    eliminarItem,
    isEliminando,
    vaciarCarrito,
    isVaciando,
    getCarrito,
  };
};
