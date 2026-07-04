import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import type { IErrorResponse } from '../../../types/api.type';
import { getPaginaLegalFn, putPaginaLegalFn, type TipoLegal } from '../api/legal.api';

const getErrorMessage = (e: AxiosError<IErrorResponse>) =>
  e.response?.data?.errores?.join(' · ') ?? e.response?.data?.mensaje ?? 'Error inesperado';

export const usePaginaLegal = (tipo: TipoLegal) =>
  useQuery({ queryKey: ['legal', tipo], queryFn: () => getPaginaLegalFn(tipo) });

export const useGuardarPaginaLegal = (tipo: TipoLegal) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { titulo: string; contenido: string; activa: boolean }) =>
      putPaginaLegalFn(tipo, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['legal', tipo] });
      toast.success('Página legal guardada');
    },
    onError: (e: AxiosError<IErrorResponse>) => toast.error(getErrorMessage(e)),
  });
};
