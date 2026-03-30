import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getOrdersFn, getOrderByIdFn, patchUpdateOrderStatusFn } from '../api/orders.api';

const QUERY_KEY = 'pedidos';

export const useOrders = (filtros: { tiendaId?: number; estado?: string; pagina?: number; limite?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEY, filtros],
    queryFn: () => getOrdersFn(filtros),
    enabled: !!filtros.tiendaId,
  });
};

export const useOrder = (id: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getOrderByIdFn(id!),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; estado: string; notasOwner?: string }) => 
      patchUpdateOrderStatusFn(data.id, { estado: data.estado, notasOwner: data.notasOwner }),
    onSuccess: () => {
      toast.success('Estado del pedido actualizado');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => {
      toast.error('Error al actualizar el estado');
    },
  });
};
