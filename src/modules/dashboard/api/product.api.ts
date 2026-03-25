import { api } from '../../../api/ApiBase';
import type { ISuccessResponse } from '../../../types/api.type';
import type {
  ICreateProductDto,
  IUpdateProductDto,
  IProductFilters,
  IProduct,
  ICategory,
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
  
  if (payload.descripcion) formData.append('descripcion', payload.descripcion);
  if (payload.precioOferta !== undefined && payload.precioOferta !== null) {
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
  // Vamos a intentar enviar JSON en lugar de FormData, ya que muchos backends ignoran
  // multipart/form-data en verbos PUT o si carecen de interceptores configurados para updates.
  const jsonPayload: Record<string, any> = { ...payload };

  // Removemos el objeto File ya que no se puede enviar por JSON
  delete jsonPayload.imagenPrincipal;

  // En NestJS/class-validator, si una propiedad es @IsOptional(), enviar `null` o string vacío
  // puede fallar las validaciones estrictas (ej: @IsNumber).
  // Es más seguro enviar nulos u omitirlos.
  if (
    jsonPayload.precioOferta === null ||
    jsonPayload.precioOferta === '' ||
    Number.isNaN(jsonPayload.precioOferta)
  ) {
    delete jsonPayload.precioOferta;
  }
  
  if (
    jsonPayload.categoriaId === null ||
    jsonPayload.categoriaId === '' ||
    Number.isNaN(jsonPayload.categoriaId)
  ) {
    delete jsonPayload.categoriaId;
  }

  // Eliminar cualquier otro undefined explicito para asegurar un JSON limpio
  Object.keys(jsonPayload).forEach(key => {
    if (jsonPayload[key] === undefined) {
      delete jsonPayload[key];
    }
  });

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
  formData.append('file', file);
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
