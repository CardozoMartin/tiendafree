import { api } from '../../../api/ApiBase';

export const getOrdersFn = async (params: { tiendaId?: number; estado?: string; pagina?: number; limite?: number }) => {
  const response = await api.get('/pedidos', { params });
  return response.data;
};

export const getOrderByIdFn = async (id: number) => {
  const response = await api.get(`/pedidos/${id}`);
  return response.data.datos;
};

export const patchUpdateOrderStatusFn = async (
  id: number,
  data: { estado: string; notasOwner?: string; nroSeguimiento?: string; urlSeguimiento?: string }
) => {
  const response = await api.patch(`/pedidos/${id}/estado`, data);
  return response.data;
};
