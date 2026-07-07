import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { IErrorResponse } from '../../../types/api.type';
import {
  getRevocacionesFn,
  putRevocacionFn,
  type EstadoRevocacion,
} from '../api/revocaciones.api';

const QUERY_KEY = 'revocaciones';

const getErrorMessage = (e: AxiosError<IErrorResponse>) =>
  e.response?.data?.errores?.join(' · ') ?? e.response?.data?.mensaje ?? 'Error inesperado';

export const useRevocaciones = () =>
  useQuery({ queryKey: [QUERY_KEY], queryFn: getRevocacionesFn });

export const useActualizarRevocacion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { estado?: EstadoRevocacion; respuestaOwner?: string };
    }) => putRevocacionFn(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success('Solicitud actualizada');
    },
    onError: (e: AxiosError<IErrorResponse>) => toast.error(getErrorMessage(e)),
  });
};
