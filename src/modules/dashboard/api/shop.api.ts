import { api } from '../../../api/ApiBase';
import type { IShopData } from '../types/shop.type';

//funcion para crear una nueva tienda
export const postCreateShopFn = async (data: IShopData) => {
  const response = await api.post('/tiendas/', data);
  return response.data;
};

//funcion para obtener los datos de la tienda solo si el usuarios es dueño y OWNER
export const getMyShopFn = async () => {
  const response = await api.get('/tiendas/mi-tienda/');
  // La respuesta viene con estructura: { ok, mensaje, datos: {...} }
  return response.data.datos || response.data;
};

//funcion para ver el sitio web de la tienda
export const getPublicShopFn = async (slug: string) => {
  const { data } = await api.get(`/tiendas/${slug}/`);
  return data.datos;
};

//funcion para actualizar los datos de la tienda
export const putUpdateShopFn = async (data: Partial<IShopData>) => {
  const response = await api.put('/tiendas/mi-tienda/', data);
  return response.data;
}

// ---- Dominio personalizado ----

interface RegistroDns {
  tipo: string;
  host: string;
  valor: string;
  ayuda?: string;
}

export interface EstadoDominio {
  dominio: string | null;
  verificado: boolean;
  instruccionDns: RegistroDns | null;      // TXT: para verificar la propiedad
  instruccionApuntado?: RegistroDns | null; // CNAME: para que el dominio cargue la tienda
}

// Obtiene el estado actual del dominio de la tienda (para mostrar en el panel).
export const getEstadoDominioFn = async (): Promise<EstadoDominio> => {
  const { data } = await api.get('/tiendas/mi-tienda/dominio');
  return data.datos;
};

// Guarda/cambia el dominio. Devuelve la instrucción del registro TXT a configurar.
export const guardarDominioFn = async (dominio: string): Promise<EstadoDominio> => {
  const { data } = await api.patch('/tiendas/mi-tienda/dominio', { dominio });
  return data.datos;
};

// Pide al backend que verifique (consultando el DNS) que el TXT esté publicado.
export const verificarDominioFn = async (): Promise<{ verificado: boolean; mensaje: string }> => {
  const { data } = await api.post('/tiendas/mi-tienda/dominio/verificar');
  return data.datos;
};

// ---- Config de email marketing (proveedor propio del dueño) ----

export type ProveedorEmail = 'brevo' | 'gmail' | 'smtp';

// Estado de la config para el panel. La credencial NUNCA viaja al front:
// solo sabemos si hay una cargada (tieneCredencial).
export interface EstadoConfigEmail {
  proveedor: ProveedorEmail | null;
  remitente: string | null;
  remitenteNombre: string | null;
  host: string | null;
  port: number | null;
  usuario: string | null;
  tieneCredencial: boolean;
  verificado: boolean;
  listoParaEnviar: boolean;
}

// Datos que el dueño manda al guardar. credencial es opcional al editar:
// si no la mandás, se conserva la ya guardada.
export interface GuardarConfigEmailInput {
  proveedor: ProveedorEmail;
  remitente: string;
  remitenteNombre?: string;
  credencial?: string;
  host?: string;
  port?: number;
  usuario?: string;
}

export const getConfigEmailFn = async (): Promise<EstadoConfigEmail> => {
  const { data } = await api.get('/tiendas/mi-tienda/email-config');
  return data.datos;
};

export const guardarConfigEmailFn = async (
  input: GuardarConfigEmailInput
): Promise<EstadoConfigEmail> => {
  const { data } = await api.put('/tiendas/mi-tienda/email-config', input);
  return data.datos;
};

export const verificarConfigEmailFn = async (): Promise<{ verificado: boolean; mensaje: string }> => {
  const { data } = await api.post('/tiendas/mi-tienda/email-config/verificar');
  return data.datos;
};

//funcion para actualizar los datos visuales de la tienda (colores, fuentes, etc)
export const putUpdateShopVisualFn = async (data: Partial<IShopData>) => {
  const response = await api.put('/tiendas/mi-tienda/tema/', data);
  return response.data;
}

// Sube la imagen del banner promocional y devuelve la URL
export const postBannerPromoImagenFn = async (file: File): Promise<{ bannerPromoImagenUrl: string }> => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await api.post('/tiendas/mi-tienda/banner-promo/imagen', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.datos;
}

// ── Catálogo de métodos ──

export const getMetodosPagoCatalogoFn = async () => {
  const response = await api.get('/tiendas/metodos-pago');
  return response.data.datos;
};

export const getMetodosEntregaCatalogoFn = async () => {
  const response = await api.get('/tiendas/metodos-entrega');
  return response.data.datos;
};

// ── Métodos de la tienda ──

export interface ConfigExtraPago {
  mpAccessToken?: string;
  mpPublicKey?: string;
  cbu?: string;
  alias?: string;
  banco?: string;
  titular?: string;
}

export interface ConfigExtraEntrega {
  zonaCobertura?: string;
  detalle?: string;
  costo?: number | null;
  costoGratis?: number | null;
  tiempoEstimado?: string;
}

export const postAgregarMetodoPagoFn = async (data: { metodoPagoId: number; detalle?: string; configExtra?: ConfigExtraPago }) => {
  const response = await api.post('/tiendas/mi-tienda/metodos-pago', data);
  return response.data;
};

export const putActualizarMetodoPagoFn = async (id: number, data: { detalle?: string; configExtra?: ConfigExtraPago }) => {
  const response = await api.put(`/tiendas/mi-tienda/metodos-pago/${id}`, data);
  return response.data;
};

export const deleteEliminarMetodoPagoFn = async (id: number) => {
  const response = await api.delete(`/tiendas/mi-tienda/metodos-pago/${id}`);
  return response.data;
};

export const postAgregarMetodoEntregaFn = async (data: { metodoEntregaId: number } & ConfigExtraEntrega) => {
  const response = await api.post('/tiendas/mi-tienda/metodos-entrega', data);
  return response.data;
};

export const putActualizarMetodoEntregaFn = async (id: number, data: ConfigExtraEntrega) => {
  const response = await api.put(`/tiendas/mi-tienda/metodos-entrega/${id}`, data);
  return response.data;
};

export const deleteEliminarMetodoEntregaFn = async (id: number) => {
  const response = await api.delete(`/tiendas/mi-tienda/metodos-entrega/${id}`);
  return response.data;
};
// ── Mercado Pago ──

export interface MpResumen {
  configurado: boolean;
  estado?: 'pendiente' | 'activo' | 'error';
  mpUser?: string | null;
  ultimoTest?: string | null;
  ultimoError?: string | null;
  tienePublicKey?: boolean;
}

export const getMpResumenFn = async (): Promise<MpResumen> => {
  const response = await api.get('/tiendas/mi-tienda/mp/estado');
  return response.data.datos;
};

export const postTestMpFn = async (): Promise<{ ok: boolean; estado: string; mpUser?: string; error?: string }> => {
  const response = await api.post('/tiendas/mi-tienda/mp/test');
  return response.data.datos;
};

export const deleteMpFn = async (): Promise<{ ok: boolean }> => {
  const response = await api.delete('/tiendas/mi-tienda/mp');
  return response.data.datos;
};

// ── About Us ──

export const getAboutUsFn = async () => {
  const response = await api.get('/tiendas/mi-tienda/about-us');
  return response.data.datos;
};

export const putUpdateAboutUsFn = async (data: { titulo?: string; descripcion?: string; direccion?: string }) => {
  const response = await api.put('/tiendas/mi-tienda/about-us', data);
  return response.data;
};

export const postUploadAboutUsImageFn = async (file: File) => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await api.post('/tiendas/mi-tienda/about-us/imagen', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// ── Marquee ──

export const getMarqueeFn = async () => {
  const response = await api.get('/tiendas/mi-tienda/marquee');
  return response.data.datos;
};

export const putUpdateMarqueeFn = async (items: Array<{ texto: string; orden: number }>) => {
  const response = await api.put('/tiendas/mi-tienda/marquee', { items });
  return response.data;
};

// ── Logo ──

export const postUploadLogoFn = async (file: File) => {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await api.post('/tiendas/mi-tienda/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteLogoFn = async () => {
  const response = await api.delete('/tiendas/mi-tienda/logo');
  return response.data;
};

// ── Slug ──

export const patchCambiarSlugFn = async (slug: string) => {
  const response = await api.patch('/tiendas/mi-tienda/slug', { slug });
  return response.data;
};

export const getVerificarSlugFn = async (slug: string) => {
  const response = await api.get('/tiendas/mi-tienda/slug/verificar', { params: { slug } });
  return response.data.datos as { slug: string; disponible: boolean };
};

// ── Analytics ──

export interface AnalyticsResumen {
  totales: {
    visitasTotales: number;
    visitasPeriodo: number;
    pedidos: number;
    ingresos: number;
    productos: number;
  };
  visitasPorDia: { fecha: string; cantidad: number }[];
  ventasSemana: { periodo: string; ingresos: number; pedidos: number }[];
  ventasMes: { periodo: string; ingresos: number; pedidos: number }[];
  productosMasVistos: { id: number; nombre: string; vistas: number; imagenPrincipalUrl: string | null }[];
}

export const getAnalyticsResumenFn = async (dias = 30) => {
  const response = await api.get('/analytics/resumen', { params: { dias } });
  return response.data.datos as AnalyticsResumen;
};

// ── Campañas de email ──

export type SegmentoCampana = 'CLIENTES_REGISTRADOS' | 'COMPRADORES' | 'AMBOS';
export type EstadoCampana = 'BORRADOR' | 'ENCOLADA' | 'ENVIANDO' | 'ENVIADA' | 'FALLIDA';

export interface Campana {
  id: number;
  asunto: string;
  cuerpoHtml: string;
  imagenUrl: string | null;
  segmento: SegmentoCampana;
  estado: EstadoCampana;
  totalDestinatarios: number;
  enviados: number;
  fallidos: number;
  creadoEn: string;
  encoladaEn: string | null;
  finalizadaEn: string | null;
}

export interface CrearCampanaInput {
  asunto: string;
  cuerpoHtml: string;
  imagenUrl?: string;
  segmento: SegmentoCampana;
}

// Conteo de destinatarios por segmento (para el compositor).
export const getDestinatariosCampanaFn = async (): Promise<Record<SegmentoCampana, number>> => {
  const { data } = await api.get('/campanas/destinatarios');
  return data.datos;
};

export const listarCampanasFn = async (): Promise<Campana[]> => {
  const { data } = await api.get('/campanas');
  return data.datos;
};

export const crearCampanaFn = async (input: CrearCampanaInput): Promise<Campana> => {
  const { data } = await api.post('/campanas', input);
  return data.datos;
};

export const enviarCampanaFn = async (
  id: number
): Promise<{ encolada: boolean; totalDestinatarios: number; mensaje: string }> => {
  const { data } = await api.post(`/campanas/${id}/enviar`);
  return data.datos;
};
