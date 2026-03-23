import type { AxiosError } from 'axios';
import type { IErrorResponse, ISuccessResponse } from '../../../types/api.type';
import { getMyShopFn, getPublicShopFn, postCreateShopFn,
  putUpdateShopFn,
  putUpdateShopVisualFn,
  getMetodosPagoCatalogoFn,
  getMetodosEntregaCatalogoFn,
  postAgregarMetodoPagoFn,
  deleteEliminarMetodoPagoFn,
  postAgregarMetodoEntregaFn,
  deleteEliminarMetodoEntregaFn,
} from '../api/shop.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { IShopData } from '../types/shop.type';

// ─── Helper para extraer el mensaje de error ─────────────────────────────────
const getErrorMessage = (error: AxiosError<IErrorResponse>): string => {
  const data = error.response?.data;
  return data?.errores?.join(' · ') ?? data?.mensaje ?? 'Error inesperado';
};

//hook para crear una nueva tienda
export const useCreateShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCreateShopFn,
    onSuccess: (data: ISuccessResponse<IShopData>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//hook para obtener los datos de la tienda solo si el usuarios es dueño y OWNER
export const useMyShop = () => {
  return useQuery({
    queryKey: ['myShop'],
    queryFn: getMyShopFn,
    enabled: true
  });
};

//Hooks para obtener los datos de la tienda publica por slug, para mostrar en el sitio publico
export const usePublicShop = (slug: string) => {
  return useQuery({
    queryKey: ['publicShop', slug],
    queryFn: () => getPublicShopFn(slug),
    enabled: !!slug
  });
}

//hook para actualizar los datos de la tienda
export const useUpdateShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putUpdateShopFn,
    onSuccess: (data: ISuccessResponse<IShopData>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

//hook para actualizar los datos visuales de la tienda (colores, fuentes, etc)
export const useUpdateShopVisual = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putUpdateShopVisualFn,
    onSuccess: (data: ISuccessResponse<IShopData>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// ── Catálogo ──

export const useMetodosPagoCatalogo = () => {
  return useQuery({
    queryKey: ['metodosPagoCatalogo'],
    queryFn: getMetodosPagoCatalogoFn,
  });
};

export const useMetodosEntregaCatalogo = () => {
  return useQuery({
    queryKey: ['metodosEntregaCatalogo'],
    queryFn: getMetodosEntregaCatalogoFn,
  });
};

// ── Mutaciones ──

export const useAgregarMetodoPago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postAgregarMetodoPagoFn,
    onSuccess: (data: ISuccessResponse<any>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useEliminarMetodoPago = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEliminarMetodoPagoFn,
    onSuccess: (data: ISuccessResponse<any>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useAgregarMetodoEntrega = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postAgregarMetodoEntregaFn,
    onSuccess: (data: ISuccessResponse<any>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useEliminarMetodoEntrega = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEliminarMetodoEntregaFn,
    onSuccess: (data: ISuccessResponse<any>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};
