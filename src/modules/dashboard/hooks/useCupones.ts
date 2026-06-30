import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getCuponesFn, postCuponFn, putCuponFn, deleteCuponFn, type CuponPayload } from '../api/cupones.api';

const KEY = 'cupones';

export const useCupones = () =>
  useQuery({ queryKey: [KEY], queryFn: getCuponesFn });

export const useCrearCupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CuponPayload) => postCuponFn(payload),
    onSuccess: () => { toast.success('Cupón creado'); qc.invalidateQueries({ queryKey: [KEY] }); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Error al crear el cupón'),
  });
};

export const useActualizarCupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CuponPayload> }) => putCuponFn(id, payload),
    onSuccess: () => { toast.success('Cupón actualizado'); qc.invalidateQueries({ queryKey: [KEY] }); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Error al actualizar el cupón'),
  });
};

export const useEliminarCupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCuponFn(id),
    onSuccess: () => { toast.success('Cupón eliminado'); qc.invalidateQueries({ queryKey: [KEY] }); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Error al eliminar el cupón'),
  });
};
