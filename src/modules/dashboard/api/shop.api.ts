import { api } from '../../../api/ApiBase';
import type { IShopData } from '../types/shop.type';

//funcion para crear una nueva tienda
export const postCreateShopFn = async (data: IShopData) => {
  const response = await api.post('/tiendas/', data);
  return response.data;
};

//funcion para obtener los datos de la tienda solo si el usuarios es dueño y OWNER
export const getMyShopFn = async () => {
  const response = await api.get('/tiendas/mi-tienda/');
  // La respuesta viene con estructura: { ok, mensaje, datos: {...} }
  return response.data.datos || response.data;
};

//funcion para ver el sitio web de la tienda
export const getPublicShopFn = async (slug: string) => {
  const { data } = await api.get(`/tiendas/${slug}/`);
  return data.datos;
};

//funcion para actualizar los datos de la tienda
export const putUpdateShopFn = async (data: Partial<IShopData>) => {
  const response = await api.put('/tiendas/mi-tienda/', data);
  return response.data;
}

//funcion para actualizar los datos visuales de la tienda (colores, fuentes, etc)
export const putUpdateShopVisualFn = async (data: Partial<IShopData>) => {
  const response = await api.put('/tiendas/mi-tienda/tema/', data);
  return response.data;
}

// ── Catálogo de métodos ──

export const getMetodosPagoCatalogoFn = async () => {
  const response = await api.get('/tiendas/metodos-pago');
  return response.data.datos;
};

export const getMetodosEntregaCatalogoFn = async () => {
  const response = await api.get('/tiendas/metodos-entrega');
  return response.data.datos;
};

// ── Métodos de la tienda ──

export const postAgregarMetodoPagoFn = async (data: { metodoPagoId: number; detalle?: string }) => {
  const response = await api.post('/tiendas/mi-tienda/metodos-pago', data);
  return response.data;
};

export const deleteEliminarMetodoPagoFn = async (id: number) => {
  const response = await api.delete(`/tiendas/mi-tienda/metodos-pago/${id}`);
  return response.data;
};

export const postAgregarMetodoEntregaFn = async (data: { metodoEntregaId: number; zonaCobertura?: string; detalle?: string }) => {
  const response = await api.post('/tiendas/mi-tienda/metodos-entrega', data);
  return response.data;
};

export const deleteEliminarMetodoEntregaFn = async (id: number) => {
  const response = await api.delete(`/tiendas/mi-tienda/metodos-entrega/${id}`);
  return response.data;
};
// ── About Us ──

export const getAboutUsFn = async () => {
  const response = await api.get('/tiendas/mi-tienda/about-us');
  return response.data.datos;
};

export const putUpdateAboutUsFn = async (data: { titulo?: string; descripcion?: string; direccion?: string }) => {
  const response = await api.put('/tiendas/mi-tienda/about-us', data);
  return response.data;
};

export const postUploadAboutUsImageFn = async (file: File) => {
  const formData = new FormData();
  formData.append('imagen', file);
  const response = await api.post('/tiendas/mi-tienda/about-us/imagen', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ── Marquee ──

export const getMarqueeFn = async () => {
  const response = await api.get('/tiendas/mi-tienda/marquee');
  return response.data.datos;
};

export const putUpdateMarqueeFn = async (items: Array<{ texto: string; orden: number }>) => {
  const response = await api.put('/tiendas/mi-tienda/marquee', { items });
  return response.data;
};
