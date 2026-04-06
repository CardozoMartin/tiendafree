import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { IErrorResponse, ISuccessResponse } from '../../../types/api.type';
import {
  deleteEliminarImagenFn,
  deleteEliminarProductoFn,
  deleteEliminarVarianteFn,
  getExportarProductosFn,
  getMiProductoFn,
  getMisProductosFn,
  postAgregarImagenFn,
  postCrearProductoFn,
  postCrearVarianteFn,
  postImportarProductosFn,
  postSubirImagenVarianteFn,
  putActualizarProductoFn,
  putActualizarVarianteFn,
} from '../api/product.api';
import type { IProduct, IProductFilters, IProductPaginatedResponse } from '../types/product.type';

// ─── Helper para extraer el mensaje de error ──────────────────────────────────
const getErrorMessage = (error: AxiosError<IErrorResponse>): string => {
  const data = error.response?.data;
  return data?.errores?.join(' · ') ?? data?.mensaje ?? 'Error inesperado';
};

const QUERY_KEY = 'misProductos';



//Hook para obtener la lista de productos del owner autenticado, con paginación y filtros opcionales
export const useMisProductos = (filtros?: IProductFilters) => {
  return useQuery<IProductPaginatedResponse, AxiosError<IErrorResponse>>({
    queryKey: ['misProductos', filtros?.pagina, filtros?.limite, filtros?.busqueda, filtros?.disponible, filtros?.destacado, filtros?.categoriaId, filtros?.orden, filtros?.direccion],
    queryFn: () => getMisProductosFn(filtros),
  });
};

// Hook para obtener un producto del owner por ID
export const useMiProducto = (productoId: number | null) => {
  return useQuery<IProduct, AxiosError<IErrorResponse>>({
    queryKey: ['misProducto', productoId],
    queryFn: () => getMiProductoFn(productoId!),
    enabled: !!productoId,
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

//Hook para crear un nuevo producto para el owner autenticado
export const useCrearProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCrearProductoFn,
    onSuccess: (data: ISuccessResponse<IProduct>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['misProductos'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};


//Hook para actualizar un producto del owner autenticado
export const useActualizarProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putActualizarProductoFn,
    onSuccess: (data: ISuccessResponse<IProduct>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['misProductos'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//Hook para eliminar un producto del owner autenticado
export const useEliminarProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEliminarProductoFn,
    onSuccess: (data: ISuccessResponse<null>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['misProductos'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//Hook para agregar una imagen a un producto del owner autenticado
export const useAgregarImagen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postAgregarImagenFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['misProductos'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//Hook para eliminar una imagen de un producto del owner autenticado
export const useEliminarImagen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { productoId: number; imagenId: number }) => {
      return deleteEliminarImagenFn(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['misProductos'] });
      queryClient.invalidateQueries({ queryKey: ['producto', variables.productoId] });
      toast.success('Imagen eliminada');
    },
    onError: () => toast.error('Error al eliminar imagen'),
  });
};

// ── VARIANTE HOOKS ──

//Hook para crear una variante de un producto del owner autenticado
export const useCrearVariante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { productoId: number; payload: Record<string, unknown> }) => {
      return postCrearVarianteFn(data.productoId, data.payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['misProductos'] });
      queryClient.invalidateQueries({ queryKey: ['producto', variables.productoId] });
      toast.success('Variante agregada');
    },
    onError: () => toast.error('Error al agregar variante'),
  });
};

//Hook para actualizar una variante de un producto del owner autenticado
export const useActualizarVariante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { productoId: number; varianteId: number; payload: Record<string, unknown> }) => {
      return putActualizarVarianteFn(data.productoId, data.varianteId, data.payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['misProductos'] });
      queryClient.invalidateQueries({ queryKey: ['producto', variables.productoId] });
      toast.success('Variante actualizada');
    },
    onError: () => toast.error('Error al actualizar variante'),
  });
};

//Hook para eliminar una variante de un producto del owner autenticado
export const useEliminarVariante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { productoId: number; varianteId: number }) => {
      return deleteEliminarVarianteFn(data.productoId, data.varianteId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['misProductos'] });
      queryClient.invalidateQueries({ queryKey: ['producto', variables.productoId] });
      toast.success('Variante eliminada');
    },
    onError: () => toast.error('Error al eliminar variante'),
  });
};

//Hook para subir una imagen a una variante de un producto del owner autenticado
export const useSubirImagenVariante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { productoId: number; varianteId: number; file: File }) => {
      return postSubirImagenVarianteFn(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['misProductos'] });
      queryClient.invalidateQueries({ queryKey: ['producto', variables.productoId] });
      toast.success('Imagen de variante subida con éxito');
    },
    onError: () => toast.error('Error al subir la imagen de variante'),
  });
};

// ── Exportar/Importar ──

//Hook para exportar los productos del owner autenticado a un archivo Excel
export const useExportarProductos = () => {
  return useMutation({
    mutationFn: getExportarProductosFn,
    onSuccess: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'productos.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Excel generado correctamente');
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//Hook para importar productos del owner autenticado desde un archivo Excel
export const useImportarProductos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      console.debug('[Products] Importar Excel - inicio', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
      return postImportarProductosFn(file);
    },
    onSuccess: (response: ISuccessResponse<{ creados: number; actualizados: number }>) => {
      const { creados, actualizados } = response.datos;
      console.debug('[Products] Importar Excel - éxito', { creados, actualizados });
      toast.success(`Importación completa: ${creados} creados, ${actualizados} actualizados.`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      console.error('[Products] Importar Excel - error', error);
      const errorDetails = error.response?.data?.errores?.length
        ? error.response?.data?.errores.join(' · ')
        : (error.response?.data?.mensaje ?? error?.message ?? 'Error inesperado');
      toast.error(`Fallo al importar Excel: ${errorDetails}`);
    },
  });
};
