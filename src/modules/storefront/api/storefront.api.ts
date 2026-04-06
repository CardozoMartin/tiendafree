import { api } from '../../../api/ApiBase';
import type { ISuccessResponse } from '../../../types/api.type';
import type { IProductFilters, IProduct, ICategory } from '../../dashboard/types/product.type';

/**
 * Obtiene los productos destacados de una tienda de forma pública.
 */
export const getStorefrontDestacadosFn = async (tiendaId: number, filtros?: IProductFilters) => {
  const { data } = await api.get<ISuccessResponse<IProduct[]>>(`/tiendas/${tiendaId}/productos/destacados`, {
    params: filtros,
  });
  return data.datos;
};

/**
 * Obtiene los productos normales de una tienda de forma pública.
 */
export const getStorefrontNormalesFn = async (tiendaId: number, filtros?: IProductFilters) => {
  const { data } = await api.get<ISuccessResponse<IProduct[]>>(`/tiendas/${tiendaId}/productos/normales`, {
    params: filtros,
  });
  return data.datos;
};

/**
 * Obtiene todos los productos públicos de una tienda.
 */
export const getStorefrontProductosFn = async (tiendaId: number, filtros?: IProductFilters) => {
  const { data } = await api.get<ISuccessResponse<IProduct[]>>(`/tiendas/${tiendaId}/productos`, {
    params: filtros,
  });
  return data.datos;
};

/**
 * Obtiene las categorías públicas (que poseen productos activos) de la tienda.
 */
export const getStorefrontCategoriasFn = async (tiendaId: number) => {
  const { data } = await api.get<ISuccessResponse<ICategory[]>>(`/tiendas/${tiendaId}/productos/categorias`);
  return data.datos;
};
