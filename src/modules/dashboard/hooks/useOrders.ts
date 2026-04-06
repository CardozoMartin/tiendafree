import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { getOrdersFn, getOrderByIdFn, patchUpdateOrderStatusFn } from '../api/orders.api';
import type { IErrorResponse } from '../../../types/api.type';
import type { IOrder, IOrderPaginatedResponse } from '../types/order.type';

interface OrderFilters {
  tiendaId?: number;
  estado?: string;
  pagina?: number;
  limite?: number;
}

//hook para obtener la lista de pedidos para el dueño de la tienda, con filtros opcionales por estado y paginación
export const useOrders = (filtros: OrderFilters) => {
  const hasTienda = typeof filtros.tiendaId === 'number' && filtros.tiendaId > 0;

  return useQuery<IOrderPaginatedResponse, AxiosError<IErrorResponse>>({
    queryKey: ['pedidos', filtros.tiendaId, filtros.estado, filtros.pagina, filtros.limite],
    queryFn: () => getOrdersFn(filtros),
    enabled: hasTienda,
  });
};

// Hook para obtener los detalles de un pedido específico por su ID
export const useOrder = (id: number | null) => {
  return useQuery<IOrder, AxiosError<IErrorResponse>>({
    queryKey: ['pedido', id],
    queryFn: () => getOrderByIdFn(id!),
    enabled: typeof id === 'number' && id > 0,
  });
};


// Hook para actualizar el estado del pedido, agregar notas para el dueño, y opcionalmente agregar información de seguimiento si el pedido ha sido enviado.
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      id: number;
      estado: string;
      notasOwner?: string;
      nroSeguimiento?: string;
      urlSeguimiento?: string;
    }) =>
      patchUpdateOrderStatusFn(data.id, {
        estado: data.estado,
        notasOwner: data.notasOwner,
        nroSeguimiento: data.nroSeguimiento,
        urlSeguimiento: data.urlSeguimiento,
      }),
    onSuccess: () => {
      toast.success('Estado del pedido actualizado');
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
    onError: () => {
      toast.error('Error al actualizar el estado');
    },
  });
};
