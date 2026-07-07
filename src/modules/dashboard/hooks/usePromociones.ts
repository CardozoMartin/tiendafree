import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getPromocionesFn,
  postPromocionFn,
  putPromocionFn,
  deletePromocionFn,
  type PromocionPayload,
} from '../api/promociones.api';

const KEY = 'promociones';

export const usePromociones = () => useQuery({ queryKey: [KEY], queryFn: getPromocionesFn });

export const useCrearPromocion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PromocionPayload) => postPromocionFn(payload),
    onSuccess: () => { toast.success('Oferta creada'); qc.invalidateQueries({ queryKey: [KEY] }); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Error al crear la oferta'),
  });
};

export const useActualizarPromocion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<PromocionPayload> }) => putPromocionFn(id, payload),
    onSuccess: () => { toast.success('Oferta actualizada'); qc.invalidateQueries({ queryKey: [KEY] }); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Error al actualizar la oferta'),
  });
};

export const useEliminarPromocion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePromocionFn(id),
    onSuccess: () => { toast.success('Oferta eliminada'); qc.invalidateQueries({ queryKey: [KEY] }); },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Error al eliminar la oferta'),
  });
};
