import { api } from "../../../api/ApiBase";

export interface CategoriaDestacada {
  id: number;
  imagenUrl: string;
  titulo: string;
  linkUrl: string;
  orden: number;
  activa: boolean;
}

export interface ActualizarCategoriaDestacadaDto {
  titulo?: string;
  linkUrl?: string;
  activa?: boolean;
}

export const getCategoriasDestacadasFn = async (): Promise<CategoriaDestacada[]> => {
  const response = await api.get('/tiendas/mi-tienda/categorias-destacadas/');
  return response.data.datos;
};

export const postCategoriaDestacadaFn = async (formData: FormData) => {
  const response = await api.post('/tiendas/mi-tienda/categorias-destacadas/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const putCategoriaDestacadaFn = async ({
  id,
  formData,
}: {
  id: number;
  formData: FormData;
}) => {
  const response = await api.put(`/tiendas/mi-tienda/categorias-destacadas/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteCategoriaDestacadaFn = async (id: number) => {
  const response = await api.delete(`/tiendas/mi-tienda/categorias-destacadas/${id}/`);
  return response.data;
};

export const putReordenarCategoriasDestacadasFn = async (orden: { id: number; orden: number }[]) => {
  const response = await api.put('/tiendas/mi-tienda/categorias-destacadas/reordenar/', { orden });
  return response.data;
};
