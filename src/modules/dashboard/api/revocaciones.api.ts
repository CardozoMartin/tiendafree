import { api } from '../../../api/ApiBase';
import type { ISuccessResponse } from '../../../types/api.type';

export type EstadoRevocacion = 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTA' | 'RECHAZADA';

export interface IRevocacion {
  id: number;
  codigo: string;
  pedidoId: number | null;
  nroPedidoTexto: string | null;
  nombre: string;
  email: string;
  telefono: string | null;
  motivo: string | null;
  estado: EstadoRevocacion;
  respuestaOwner: string | null;
  creadoEn: string;
}

export const getRevocacionesFn = async (): Promise<IRevocacion[]> => {
  const { data } = await api.get<ISuccessResponse<IRevocacion[]>>('/revocaciones');
  return data.datos;
};

export const putRevocacionFn = async (
  id: number,
  payload: { estado?: EstadoRevocacion; respuestaOwner?: string }
): Promise<IRevocacion> => {
  const { data } = await api.put<ISuccessResponse<IRevocacion>>(`/revocaciones/${id}`, payload);
  return data.datos;
};
