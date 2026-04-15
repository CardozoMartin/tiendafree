import { useQuery } from '@tanstack/react-query';
import {
  getStorefrontDestacadosFn,
  getStorefrontNormalesFn,
  getStorefrontProductosFn,
  getStorefrontCategoriasFn,
} from '../api/storefront.api';
import type { IProductFilters } from '../../dashboard/types/product.type';

const STOREFRONT_KEY = 'storefrontProducts';

/**
 * Hook para obtener productos destacados.
 */
export const useStorefrontDestacados = (tiendaId: number, filtros?: IProductFilters) => {
  return useQuery({
    queryKey: [STOREFRONT_KEY, 'destacados', tiendaId, filtros],
    queryFn: () => getStorefrontDestacadosFn(tiendaId, filtros),
    enabled: !!tiendaId,
  });
};

/**
 * Hook para obtener productos normales (no destacados).
 */
export const useStorefrontNormales = (tiendaId: number, filtros?: IProductFilters) => {
  return useQuery({
    queryKey: [STOREFRONT_KEY, 'normales', tiendaId, filtros],
    queryFn: () => getStorefrontNormalesFn(tiendaId, filtros),
    enabled: !!tiendaId,
  });
};

/**
 * Hook para obtener todos los productos públicos.
 */
export const useStorefrontProductos = (tiendaId: number, filtros?: IProductFilters) => {
  return useQuery({
    queryKey: [STOREFRONT_KEY, 'todos', tiendaId, filtros],
    queryFn: () => getStorefrontProductosFn(tiendaId, filtros),
    enabled: !!tiendaId,
  });
};

/**
 * Hook para obtener las categorías públicas de la tienda.
 */
export const useStorefrontCategorias = (tiendaId: number) => {
  return useQuery({
    queryKey: [STOREFRONT_KEY, 'categorias', tiendaId],
    queryFn: () => getStorefrontCategoriasFn(tiendaId),
    enabled: !!tiendaId,
  });
};
