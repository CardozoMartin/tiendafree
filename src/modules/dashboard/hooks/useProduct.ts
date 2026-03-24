import type { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { IErrorResponse, ISuccessResponse } from '../../../types/api.type';
import type { IProductFilters, IProduct } from '../types/product.type';
import {
  getMisProductosFn,
  getMiProductoFn,
  postCrearProductoFn,
  putActualizarProductoFn,
  deleteEliminarProductoFn,
  postAgregarImagenFn,
  deleteEliminarImagenFn,
  getExportarProductosFn,
  postImportarProductosFn,
} from '../api/product.api';

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
    mutationFn: deleteEliminarImagenFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
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
    mutationFn: (file: File) => postImportarProductosFn(file),
    onSuccess: (response: ISuccessResponse<{ creados: number; actualizados: number }>) => {
      const { creados, actualizados } = response.datos;
      toast.success(`Importación completa: ${creados} creados, ${actualizados} actualizados.`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};
