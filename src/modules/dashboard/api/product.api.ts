import { api } from '../../../api/ApiBase';
import type { ISuccessResponse } from '../../../types/api.type';
import type {
  ICategory,
  ICreateProductDto,
  IProduct,
  IProductFilters,
  IUpdateProductDto,
} from '../types/product.type';

// Re-aliasing for convenience if needed, but I'll use ISuccessResponse directly
type IApiResponse<T> = ISuccessResponse<T>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convierte el objeto de filtros en query params, omitiendo valores undefined */
const toParams = (filtros?: IProductFilters): Record<string, string> => {
  if (!filtros) return {};
  return Object.fromEntries(
    Object.entries(filtros)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => [k, String(v)])
  );
};

// ─── Owner API ────────────────────────────────────────────────────────────────

/** Lista los productos del owner autenticado con paginación y filtros.
 * Respuesta: { ok, mensaje, datos: IProduct[], paginacion: { total, pagina, limite, totalPaginas } }
 */
export const getMisProductosFn = async (filtros?: IProductFilters) => {
  const { data } = await api.get('/mis-productos', { params: toParams(filtros) });
  // responderPaginado pone: data.datos (array) y data.paginacion (metadata)
  return { datos: data.datos as any[], paginacion: data.paginacion };
};

/** Obtiene un producto del owner por ID */
export const getMiProductoFn = async (productoId: number) => {
  const { data } = await api.get(`/mis-productos/${productoId}`);
  return data.datos;
};

/** Obtiene las categorías globales (activas) */
export const getCategoriasFn = async () => {
  const { data } = await api.get<IApiResponse<ICategory[]>>('/mis-productos/categorias');
  return data.datos;
};

/** Crea un nuevo producto */
export const postCrearProductoFn = async (payload: ICreateProductDto) => {
  const formData = new FormData();
  formData.append('nombre', payload.nombre);
  formData.append('precio', payload.precio.toString());
  formData.append('moneda', payload.moneda);
  formData.append('disponible', payload.disponible ? 'true' : 'false');
  formData.append('destacado', payload.destacado ? 'true' : 'false');
  formData.append('stock', (payload.stock ?? 0).toString());

  if (payload.descripcion) formData.append('descripcion', payload.descripcion);
  if (payload.precioOferta !== undefined && payload.precioOferta !== null && Number(payload.precioOferta) > 0) {
    formData.append('precioOferta', payload.precioOferta.toString());
  }
  if (payload.categoriaId) {
    formData.append('categoriaId', payload.categoriaId.toString());
  }

  // Tags como string separado por comas
  if (payload.tags && payload.tags.length > 0) {
    formData.append('tags', payload.tags.join(','));
  }

  // Variantes como JSON string
  if (payload.variantes && payload.variantes.length > 0) {
    formData.append('variantes', JSON.stringify(payload.variantes));
  }

  // Imagen principal (archivo)
  if (payload.imagenPrincipal) {
    formData.append('photo', payload.imagenPrincipal);
  } else if (payload.imagenPrincipalUrl) {
    formData.append('imagenPrincipalUrl', payload.imagenPrincipalUrl);
  }

  const { data } = await api.post<IApiResponse<IProduct>>('/mis-productos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const putActualizarProductoFn = async ({
  id,
  payload,
}: {
  id: number;
  payload: IUpdateProductDto;
}) => {
  const { imagenPrincipal: _drop, ...rest } = payload as any;

  const jsonPayload: Record<string, any> = {};

  for (const [key, value] of Object.entries(rest)) {
    if (value === undefined) continue;
    if (key === 'precioOferta') {
      // String vacío, NaN, 0 o negativo → null para borrar el precio de oferta
      const num = value === '' || value === null ? NaN : Number(value);
      jsonPayload[key] = Number.isNaN(num) || num <= 0 ? null : num;
      continue;
    }
    if (key === 'categoriaId') {
      const num = Number(value);
      if (!Number.isNaN(num) && num > 0) jsonPayload[key] = num;
      continue;
    }
    jsonPayload[key] = value;
  }

  const { data } = await api.put<IApiResponse<IProduct>>(`/mis-productos/${id}`, jsonPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
};

/** Exportar productos a Excel */
export const getExportarProductosFn = async () => {
  const { data } = await api.get('/mis-productos/exportar', {
    responseType: 'blob',
  });
  return data;
};

/** Importar productos desde Excel */
export const postImportarProductosFn = async (file: File) => {
  const formData = new FormData();
  // El backend espera que el archivo venga en el campo 'photo', no 'file'.
  formData.append('photo', file);
  const { data } = await api.post<IApiResponse<{ creados: number; actualizados: number }>>(
    '/mis-productos/importar',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};

/** Elimina un producto por ID */
export const deleteEliminarProductoFn = async (productoId: number) => {
  const { data } = await api.delete(`/mis-productos/${productoId}`);
  return data;
};

// ─── Imágenes ─────────────────────────────────────────────────────────────────

export const postAgregarImagenFn = async ({
  productoId,
  file,
  orden = 0,
}: {
  productoId: number;
  file: File;
  orden?: number;
}) => {
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('orden', String(orden));

  const { data } = await api.post(`/mis-productos/${productoId}/imagenes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteEliminarImagenFn = async ({
  productoId,
  imagenId,
}: {
  productoId: number;
  imagenId: number;
}) => {
  const { data } = await api.delete(`/mis-productos/${productoId}/imagenes/${imagenId}`);
  return data;
};

// ── VARIANTES ──

export const postCrearVarianteFn = async (productoId: number, payload: any): Promise<any> => {
  const { data } = await api.post(`/mis-productos/${productoId}/variantes`, payload);
  return data;
};

export const putActualizarVarianteFn = async (
  productoId: number,
  varianteId: number,
  payload: any
): Promise<any> => {
  const { data } = await api.put(`/mis-productos/${productoId}/variantes/${varianteId}`, payload);
  return data;
};

export const deleteEliminarVarianteFn = async (
  productoId: number,
  varianteId: number
): Promise<any> => {
  const { data } = await api.delete(`/mis-productos/${productoId}/variantes/${varianteId}`);
  return data;
};

export const postSubirImagenVarianteFn = async ({
  productoId,
  varianteId,
  file,
}: {
  productoId: number;
  varianteId: number;
  file: File;
}): Promise<any> => {
  const formData = new FormData();
  formData.append('photo', file);
  const { data } = await api.post(
    `/mis-productos/${productoId}/variantes/${varianteId}/imagen`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return data;
};
