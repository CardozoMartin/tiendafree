import { api } from '../../../api/ApiBase';

export interface Cupon {
  id: number;
  codigo: string;
  tipoDescuento: 'PORCENTAJE' | 'MONTO_FIJO';
  valor: number;
  minCompra?: number | null;
  validoDesde?: string | null;
  validoHasta?: string | null;
  usoMaximo?: number | null;
  usoActual: number;
  activo: boolean;
  creadoEn: string;
}

export interface CuponPayload {
  codigo: string;
  tipoDescuento: 'PORCENTAJE' | 'MONTO_FIJO';
  valor: number;
  minCompra?: number | null;
  validoDesde?: string | null;
  validoHasta?: string | null;
  usoMaximo?: number | null;
  activo?: boolean;
}

export const getCuponesFn = async (): Promise<Cupon[]> => {
  const { data } = await api.get('/cupones');
  return data.datos ?? [];
};

export const postCuponFn = async (payload: CuponPayload): Promise<Cupon> => {
  const { data } = await api.post('/cupones', payload);
  return data.datos;
};

export const putCuponFn = async (id: number, payload: Partial<CuponPayload>): Promise<Cupon> => {
  const { data } = await api.put(`/cupones/${id}`, payload);
  return data.datos;
};

export const deleteCuponFn = async (id: number): Promise<void> => {
  await api.delete(`/cupones/${id}`);
};
