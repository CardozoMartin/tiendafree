import { api } from '../../../api/ApiBase';

// Obtener la lista de pedidos para el dueño de la tienda, con filtros opcionales por estado y paginación
export const getOrdersFn = async (params: { tiendaId?: number; estado?: string; pagina?: number; limite?: number }) => {
  const response = await api.get('/pedidos', { params });
  return response.data;
};

// Obtener los detalles de un pedido específico por su ID
export const getOrderByIdFn = async (id: number) => {
  const response = await api.get(`/pedidos/${id}`);
  return response.data.datos;
};


//Actualizar el estado del pedido, agregar notas para el dueño, y opcionalmente agregar información de seguimiento si el pedido ha sido enviado.
export const patchUpdateOrderStatusFn = async (
  id: number,
  data: { estado: string; notasOwner?: string; nroSeguimiento?: string; urlSeguimiento?: string }
) => {
  const response = await api.patch(`/pedidos/${id}/estado`, data);
  return response.data;
};
