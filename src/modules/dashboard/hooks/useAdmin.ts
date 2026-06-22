import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAdminDashboardFn,
  getCategoriasAdminFn, postCategoriaFn, putCategoriaFn, deleteCategoriaFn,
  getTagsAdminFn, postTagFn, putTagFn, deleteTagFn,
  getMetodosPagoAdminFn, postMetodoPagoFn, putMetodoPagoFn, deleteMetodoPagoFn,
  getMetodosEntregaAdminFn, postMetodoEntregaFn, putMetodoEntregaFn, deleteMetodoEntregaFn,
  getPlantillasAdminFn, postPlantillaFn, putPlantillaFn, deletePlantillaFn,
  getUsuariosAdminFn, patchUsuarioRolFn, patchUsuarioActivoFn,
} from '../api/admin.api';

const ok = (msg: string) => toast.success(msg);
const err = (e: any) => toast.error(e?.response?.data?.mensaje ?? 'Error inesperado');

// ── Dashboard ──
export const useAdminDashboard = () =>
  useQuery({ queryKey: ['adminDashboard'], queryFn: getAdminDashboardFn });

// ── Categorías ──
export const useCategorias = () =>
  useQuery({ queryKey: ['adminCategorias'], queryFn: getCategoriasAdminFn });

export const useCrearCategoria = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postCategoriaFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Categoría creada'); qc.invalidateQueries({ queryKey: ['adminCategorias'] }); },
    onError: err,
  });
};
export const useActualizarCategoria = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: putCategoriaFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Categoría actualizada'); qc.invalidateQueries({ queryKey: ['adminCategorias'] }); },
    onError: err,
  });
};
export const useEliminarCategoria = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCategoriaFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Categoría eliminada'); qc.invalidateQueries({ queryKey: ['adminCategorias'] }); },
    onError: err,
  });
};

// ── Tags ──
export const useTags = () =>
  useQuery({ queryKey: ['adminTags'], queryFn: getTagsAdminFn });

export const useCrearTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postTagFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Tag creado'); qc.invalidateQueries({ queryKey: ['adminTags'] }); },
    onError: err,
  });
};
export const useActualizarTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: putTagFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Tag actualizado'); qc.invalidateQueries({ queryKey: ['adminTags'] }); },
    onError: err,
  });
};
export const useEliminarTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTagFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Tag eliminado'); qc.invalidateQueries({ queryKey: ['adminTags'] }); },
    onError: err,
  });
};

// ── Métodos de Pago ──
export const useMetodosPagoAdmin = () =>
  useQuery({ queryKey: ['adminMetodosPago'], queryFn: getMetodosPagoAdminFn });

export const useCrearMetodoPago = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postMetodoPagoFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Creado'); qc.invalidateQueries({ queryKey: ['adminMetodosPago'] }); },
    onError: err,
  });
};
export const useActualizarMetodoPago = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: putMetodoPagoFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Actualizado'); qc.invalidateQueries({ queryKey: ['adminMetodosPago'] }); },
    onError: err,
  });
};
export const useEliminarMetodoPago = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMetodoPagoFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Eliminado'); qc.invalidateQueries({ queryKey: ['adminMetodosPago'] }); },
    onError: err,
  });
};

// ── Métodos de Entrega ──
export const useMetodosEntregaAdmin = () =>
  useQuery({ queryKey: ['adminMetodosEntrega'], queryFn: getMetodosEntregaAdminFn });

export const useCrearMetodoEntrega = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postMetodoEntregaFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Creado'); qc.invalidateQueries({ queryKey: ['adminMetodosEntrega'] }); },
    onError: err,
  });
};
export const useActualizarMetodoEntrega = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: putMetodoEntregaFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Actualizado'); qc.invalidateQueries({ queryKey: ['adminMetodosEntrega'] }); },
    onError: err,
  });
};
export const useEliminarMetodoEntrega = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMetodoEntregaFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Eliminado'); qc.invalidateQueries({ queryKey: ['adminMetodosEntrega'] }); },
    onError: err,
  });
};

// ── Plantillas ──
export const usePlantillasAdmin = () =>
  useQuery({ queryKey: ['adminPlantillas'], queryFn: getPlantillasAdminFn });

export const useCrearPlantilla = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postPlantillaFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Plantilla creada'); qc.invalidateQueries({ queryKey: ['adminPlantillas'] }); },
    onError: err,
  });
};
export const useActualizarPlantilla = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: putPlantillaFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Plantilla actualizada'); qc.invalidateQueries({ queryKey: ['adminPlantillas'] }); },
    onError: err,
  });
};
export const useEliminarPlantilla = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePlantillaFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Plantilla eliminada'); qc.invalidateQueries({ queryKey: ['adminPlantillas'] }); },
    onError: err,
  });
};

// ── Usuarios ──
export const useUsuariosAdmin = (pagina = 1, limite = 20) =>
  useQuery({ queryKey: ['adminUsuarios', pagina, limite], queryFn: () => getUsuariosAdminFn(pagina, limite) });

export const useCambiarRolUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchUsuarioRolFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Rol actualizado'); qc.invalidateQueries({ queryKey: ['adminUsuarios'] }); },
    onError: err,
  });
};
export const useCambiarActivoUsuario = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: patchUsuarioActivoFn,
    onSuccess: (d) => { ok(d.mensaje ?? 'Estado actualizado'); qc.invalidateQueries({ queryKey: ['adminUsuarios'] }); },
    onError: err,
  });
};
