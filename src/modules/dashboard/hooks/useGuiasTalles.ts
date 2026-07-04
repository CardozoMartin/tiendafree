import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { IErrorResponse } from '../../../types/api.type';
import {
  deleteGuiaTallesFn,
  getGuiasTallesFn,
  postGuiaTallesFn,
  putGuiaTallesFn,
  type IGuiaTallesInput,
} from '../api/guiaTalles.api';

const QUERY_KEY = 'guiasTalles';

const getErrorMessage = (error: AxiosError<IErrorResponse>): string => {
  const data = error.response?.data;
  return data?.errores?.join(' · ') ?? data?.mensaje ?? 'Error inesperado';
};

export const useGuiasTalles = () =>
  useQuery({ queryKey: [QUERY_KEY], queryFn: getGuiasTallesFn });

export const useCrearGuiaTalles = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: IGuiaTallesInput) => postGuiaTallesFn(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Tabla de talles creada');
    },
    onError: (e: AxiosError<IErrorResponse>) => toast.error(getErrorMessage(e)),
  });
};

export const useActualizarGuiaTalles = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<IGuiaTallesInput> }) =>
      putGuiaTallesFn(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Tabla de talles guardada');
    },
    onError: (e: AxiosError<IErrorResponse>) => toast.error(getErrorMessage(e)),
  });
};

export const useEliminarGuiaTalles = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteGuiaTallesFn(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Tabla de talles eliminada');
    },
    onError: (e: AxiosError<IErrorResponse>) => toast.error(getErrorMessage(e)),
  });
};
