import { api } from '../../../api/ApiBase';

export type TipoDescuento = 'PORCENTAJE' | 'MONTO_FIJO';

// Producto dentro de una promo, con su descuento propio opcional.
export interface PromocionProducto {
  productoId: number;
  tipoDescuento?: TipoDescuento | null;
  valor?: number | null;
  // Solo presente al listar (viene del include del backend).
  producto?: { id: number; nombre: string; precio: number; imagenPrincipalUrl?: string | null };
}

export interface Promocion {
  id: number;
  nombre: string;
  slug: string;
  tipoDescuento?: TipoDescuento | null;
  valor?: number | null;
  validoDesde?: string | null;
  validoHasta?: string | null;
  activa: boolean;
  bannerTitulo?: string | null;
  bannerImagenUrl?: string | null;
  creadoEn: string;
  productos: PromocionProducto[];
}

export interface PromocionPayload {
  nombre: string;
  tipoDescuento?: TipoDescuento | null;
  valor?: number | null;
  validoDesde?: string | null;
  validoHasta?: string | null;
  activa?: boolean;
  bannerTitulo?: string | null;
  bannerImagenUrl?: string | null;
  productos: { productoId: number; tipoDescuento?: TipoDescuento | null; valor?: number | null }[];
}

export const getPromocionesFn = async (): Promise<Promocion[]> => {
  const { data } = await api.get('/promociones');
  return data.datos ?? [];
};

export const postPromocionFn = async (payload: PromocionPayload): Promise<Promocion> => {
  const { data } = await api.post('/promociones', payload);
  return data.datos;
};

export const putPromocionFn = async (id: number, payload: Partial<PromocionPayload>): Promise<Promocion> => {
  const { data } = await api.put(`/promociones/${id}`, payload);
  return data.datos;
};

export const deletePromocionFn = async (id: number): Promise<void> => {
  await api.delete(`/promociones/${id}`);
};
