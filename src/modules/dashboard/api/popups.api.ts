import { api } from '../../../api/ApiBase';

export type TipoPopup = 'OFERTA' | 'NEWSLETTER' | 'INFO' | 'IMAGEN_CTA';
export type FrecuenciaPopup = 'SIEMPRE' | 'UNA_VEZ_SESION' | 'UNA_VEZ_DIA';

export interface Popup {
  id: number;
  tiendaId: number;
  tipo: TipoPopup;
  activo: boolean;
  titulo: string;
  mensaje?: string;
  imagenUrl?: string;
  ctaTexto?: string;
  ctaUrl?: string;
  colorFondo?: string;
  delay: number;
  frecuencia: FrecuenciaPopup;
  codigoDesc?: string;
  porcentajeDesc?: number;
  creadoEn: string;
}

export interface CrearPopupDto {
  tipo: TipoPopup;
  activo?: boolean;
  titulo: string;
  mensaje?: string;
  ctaTexto?: string;
  ctaUrl?: string;
  colorFondo?: string;
  delay?: number;
  frecuencia?: FrecuenciaPopup;
  codigoDesc?: string;
  porcentajeDesc?: number;
}

export const getPopupsFn = async (): Promise<Popup[]> => {
  const { data } = await api.get('/mi-tienda/popups');
  return data.datos;
};

export const postCrearPopupFn = async (payload: CrearPopupDto): Promise<Popup> => {
  const { data } = await api.post('/mi-tienda/popups', payload);
  return data.datos;
};

export const putActualizarPopupFn = async (id: number, payload: Partial<CrearPopupDto>): Promise<Popup> => {
  const { data } = await api.put(`/mi-tienda/popups/${id}`, payload);
  return data.datos;
};

export const postSubirImagenPopupFn = async (id: number, file: File): Promise<Popup> => {
  const formData = new FormData();
  formData.append('photo', file);
  const { data } = await api.post(`/mi-tienda/popups/${id}/imagen`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.datos;
};

export const deletePopupFn = async (id: number): Promise<void> => {
  await api.delete(`/mi-tienda/popups/${id}`);
};
