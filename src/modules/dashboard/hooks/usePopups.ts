import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPopupsFn,
  postCrearPopupFn,
  putActualizarPopupFn,
  postSubirImagenPopupFn,
  deletePopupFn,
  type CrearPopupDto,
} from '../api/popups.api';

const KEY = 'popups';

export const usePopups = () =>
  useQuery({ queryKey: [KEY], queryFn: getPopupsFn });

export const useCrearPopup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CrearPopupDto) => postCrearPopupFn(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useActualizarPopup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CrearPopupDto> }) =>
      putActualizarPopupFn(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useSubirImagenPopup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => postSubirImagenPopupFn(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
};

export const useEliminarPopup = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deletePopupFn(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
};
