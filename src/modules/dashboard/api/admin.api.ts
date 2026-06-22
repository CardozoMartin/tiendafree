import { api } from '../../../api/ApiBase';

const BASE = '/admin';

// ── Dashboard ──
export const getAdminDashboardFn = async () => {
  const res = await api.get(`${BASE}/dashboard`);
  return res.data.datos;
};

// ── Categorías ──
export const getCategoriasAdminFn = async () => {
  const res = await api.get(`${BASE}/categorias`);
  return res.data.datos as any[];
};
export const postCategoriaFn = async (body: { nombre: string; activa?: boolean }) => {
  const res = await api.post(`${BASE}/categorias`, body);
  return res.data;
};
export const putCategoriaFn = async ({ id, body }: { id: number; body: { nombre?: string; activa?: boolean } }) => {
  const res = await api.put(`${BASE}/categorias/${id}`, body);
  return res.data;
};
export const deleteCategoriaFn = async (id: number) => {
  const res = await api.delete(`${BASE}/categorias/${id}`);
  return res.data;
};

// ── Tags ──
export const getTagsAdminFn = async () => {
  const res = await api.get(`${BASE}/tags`);
  return res.data.datos as any[];
};
export const postTagFn = async (body: { nombre: string }) => {
  const res = await api.post(`${BASE}/tags`, body);
  return res.data;
};
export const putTagFn = async ({ id, body }: { id: number; body: { nombre: string } }) => {
  const res = await api.put(`${BASE}/tags/${id}`, body);
  return res.data;
};
export const deleteTagFn = async (id: number) => {
  const res = await api.delete(`${BASE}/tags/${id}`);
  return res.data;
};

// ── Métodos de Pago ──
export const getMetodosPagoAdminFn = async () => {
  const res = await api.get(`${BASE}/metodos-pago`);
  return res.data.datos as any[];
};
export const postMetodoPagoFn = async (body: { nombre: string; icono?: string; descripcion?: string; activo?: boolean; orden?: number }) => {
  const res = await api.post(`${BASE}/metodos-pago`, body);
  return res.data;
};
export const putMetodoPagoFn = async ({ id, body }: { id: number; body: any }) => {
  const res = await api.put(`${BASE}/metodos-pago/${id}`, body);
  return res.data;
};
export const deleteMetodoPagoFn = async (id: number) => {
  const res = await api.delete(`${BASE}/metodos-pago/${id}`);
  return res.data;
};

// ── Métodos de Entrega ──
export const getMetodosEntregaAdminFn = async () => {
  const res = await api.get(`${BASE}/metodos-entrega`);
  return res.data.datos as any[];
};
export const postMetodoEntregaFn = async (body: { nombre: string; icono?: string; descripcion?: string; permiteZona?: boolean; activo?: boolean; orden?: number }) => {
  const res = await api.post(`${BASE}/metodos-entrega`, body);
  return res.data;
};
export const putMetodoEntregaFn = async ({ id, body }: { id: number; body: any }) => {
  const res = await api.put(`${BASE}/metodos-entrega/${id}`, body);
  return res.data;
};
export const deleteMetodoEntregaFn = async (id: number) => {
  const res = await api.delete(`${BASE}/metodos-entrega/${id}`);
  return res.data;
};

// ── Plantillas ──
export const getPlantillasAdminFn = async () => {
  const res = await api.get(`${BASE}/plantillas`);
  return res.data.datos as any[];
};
export const postPlantillaFn = async (body: { nombre: string; descripcion?: string; previewUrl?: string; sortOrder?: number; activo?: boolean }) => {
  const res = await api.post(`${BASE}/plantillas`, body);
  return res.data;
};
export const putPlantillaFn = async ({ id, body }: { id: number; body: any }) => {
  const res = await api.put(`${BASE}/plantillas/${id}`, body);
  return res.data;
};
export const deletePlantillaFn = async (id: number) => {
  const res = await api.delete(`${BASE}/plantillas/${id}`);
  return res.data;
};

// ── Usuarios ──
export const getUsuariosAdminFn = async (pagina = 1, limite = 20) => {
  const res = await api.get(`${BASE}/usuarios`, { params: { pagina, limite } });
  return res.data as { ok: boolean; datos: any[]; total: number };
};
export const patchUsuarioRolFn = async ({ id, rol }: { id: number; rol: string }) => {
  const res = await api.patch(`${BASE}/usuarios/${id}/rol`, { rol });
  return res.data;
};
export const patchUsuarioActivoFn = async ({ id, activo }: { id: number; activo: boolean }) => {
  const res = await api.patch(`${BASE}/usuarios/${id}/activo`, { activo });
  return res.data;
};
