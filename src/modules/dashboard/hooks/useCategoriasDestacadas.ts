import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { IErrorResponse, ISuccessResponse } from '../../../types/api.type';
import type { AxiosError } from 'axios';
import {
  getCategoriasDestacadasFn,
  postCategoriaDestacadaFn,
  putCategoriaDestacadaFn,
  deleteCategoriaDestacadaFn,
  putReordenarCategoriasDestacadasFn,
} from '../api/categoriasDestacadas.api';
import { toast } from 'sonner';

const getErrorMessage = (error: AxiosError<IErrorResponse>): string => {
  const data = error.response?.data;
  return data?.errores?.join(' · ') ?? data?.mensaje ?? 'Error inesperado';
};

export const useCategoriasDestacadas = () => {
  return useQuery({
    queryKey: ['categoriasDestacadas'],
    queryFn: getCategoriasDestacadasFn,
  });
};

export const useAgregarCategoriaDestacada = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCategoriaDestacadaFn,
    onSuccess: (data: ISuccessResponse<unknown>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['categoriasDestacadas'] });
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useActualizarCategoriaDestacada = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putCategoriaDestacadaFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoriasDestacadas'] });
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useEliminarCategoriaDestacada = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoriaDestacadaFn,
    onSuccess: (data: ISuccessResponse<unknown>) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['categoriasDestacadas'] });
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export const useReordenarCategoriasDestacadas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putReordenarCategoriasDestacadasFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categoriasDestacadas'] });
    },
    onError: (error: AxiosError<IErrorResponse>) => {
      toast.error(getErrorMessage(error));
    },
  });
};
