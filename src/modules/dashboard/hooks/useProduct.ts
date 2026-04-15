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
import type { IProduct, IProductFilters } from '../types/product.type';

// ─── Helper para extraer el mensaje de error ──────────────────────────────────
const getErrorMessage = (error: AxiosError<IErrorResponse>): string => {
  const data = error.response?.data;
  return data?.errores?.join(' · ') ?? data?.mensaje ?? 'Error inesperado';
};

const QUERY_KEY = 'misProductos';

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Lista paginada de mis productos con filtros */
export const useMisProductos = (filtros?: IProductFilters) => {
  return useQuery({
    queryKey: [QUERY_KEY, filtros],
    queryFn: () => getMisProductosFn(filtros),
  });
};

/** Obtener un producto por ID (para edición) */
export const useMiProducto = (productoId: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEY, productoId],
    queryFn: () => getMiProductoFn(productoId!),
    enabled: !!productoId,
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Crear un producto nuevo */
export const useCrearProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCrearProductoFn,
    onSuccess: (data: ISuccessResponse<IProduct>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

/** Actualizar datos de un producto */
export const useActualizarProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putActualizarProductoFn,
    onSuccess: (data: ISuccessResponse<IProduct>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

/** Eliminar un producto */
export const useEliminarProducto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEliminarProductoFn,
    onSuccess: (data: ISuccessResponse<null>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

/** Agregar imagen a un producto */
export const useAgregarImagen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postAgregarImagenFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

/** Eliminar imagen de un producto */
export const useEliminarImagen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { productoId: number; imagenId: number }) => {
      return deleteEliminarImagenFn(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['producto', variables.productoId] });
      toast.success('Imagen eliminada');
    },
    onError: () => toast.error('Error al eliminar imagen'),
  });
};

// ── VARIANTE HOOKS ──

export const useCrearVariante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { productoId: number; payload: any }) => {
      return postCrearVarianteFn(data.productoId, data.payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['producto', variables.productoId] });
      toast.success('Variante agregada');
    },
    onError: () => toast.error('Error al agregar variante'),
  });
};

export const useActualizarVariante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { productoId: number; varianteId: number; payload: any }) => {
      return putActualizarVarianteFn(data.productoId, data.varianteId, data.payload);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['producto', variables.productoId] });
      toast.success('Variante actualizada');
    },
    onError: () => toast.error('Error al actualizar variante'),
  });
};

export const useEliminarVariante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { productoId: number; varianteId: number }) => {
      return deleteEliminarVarianteFn(data.productoId, data.varianteId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['producto', variables.productoId] });
      toast.success('Variante eliminada');
    },
    onError: () => toast.error('Error al eliminar variante'),
  });
};

export const useSubirImagenVariante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { productoId: number; varianteId: number; file: File }) => {
      return postSubirImagenVarianteFn(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['producto', variables.productoId] });
      toast.success('Imagen de variante subida con éxito');
    },
    onError: () => toast.error('Error al subir la imagen de variante'),
  });
};

/** Exportar productos a Excel */
export const useExportarProductos = () => {
  return useMutation({
    mutationFn: getExportarProductosFn,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob as any]));
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

/** Importar productos desde Excel */
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
