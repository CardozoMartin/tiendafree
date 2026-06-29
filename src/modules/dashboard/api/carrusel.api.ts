import { api } from "../../../api/ApiBase";

export type TipoSeccionHero = 'CARRUSEL' | 'BANNER' | 'HERO_FIJO' | 'VIDEO';

export interface CarruselSeccion {
  id: number;
  url: string;
  titulo?: string | null;
  subtitulo?: string | null;
  linkUrl?: string | null;
  orden: number;
  activa: boolean;
  tipo: TipoSeccionHero;
  etiqueta?: string | null;
  fechaDesde?: string | null;
  fechaHasta?: string | null;
}

export interface ActualizarSeccionDto {
  titulo?: string;
  subtitulo?: string;
  linkUrl?: string;
  orden?: number;
  activa?: boolean;
  tipo?: TipoSeccionHero;
  etiqueta?: string;
  fechaDesde?: string | null;
  fechaHasta?: string | null;
}

export const getCarruselAdminFn = async (): Promise<CarruselSeccion[]> => {
  const response = await api.get('/tiendas/mi-tienda/carrusel/');
  return response.data.datos;
};

export const deleteShopCarouselImageFn = async (imageId: number) => {
  const response = await api.delete(`/tiendas/mi-tienda/carrusel/${imageId}/`);
  return response.data;
};

export const postAddShopCarouselImageFn = async (formData: FormData) => {
  const response = await api.post('/tiendas/mi-tienda/carrusel/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const putActualizarSeccionFn = async ({
  id,
  datos,
}: {
  id: number;
  datos: ActualizarSeccionDto;
}) => {
  const response = await api.put(`/tiendas/mi-tienda/carrusel/${id}/`, datos);
  return response.data;
};

export const putReordenarCarruselFn = async (orden: { id: number; orden: number }[]) => {
  const response = await api.put('/tiendas/mi-tienda/carrusel/reordenar/', orden);
  return response.data;
};
