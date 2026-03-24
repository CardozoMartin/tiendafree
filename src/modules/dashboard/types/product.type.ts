// ─── Tipos del módulo de productos ───────────────────────────────────────────

export interface IProductTag {
  id: number;
  nombre: string;
}

export interface IProductImage {
  id: number;
  url: string;
  orden: number;
}

export interface IProductVariant {
  id: number;
  nombre: string;
  sku?: string;
  precioExtra: number;
  imagenUrl?: string;
  disponible: boolean;
}

export interface ICategory {
  id: number;
  nombre: string;
  slug: string;
  padreId?: number;
}

export interface IProduct {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioOferta?: number;
  moneda: string;
  imagenPrincipalUrl?: string;
  categoriaId?: number;
  categoria?: { id: number; nombre: string };
  disponible: boolean;
  destacado: boolean;
  vistas: number;
  creadoEn: string;
  actualizadoEn: string;
  // relations
  tags: IProductTag[];
  imagenes: IProductImage[];
  variantes: IProductVariant[];
  _count?: { resenas: number };
}

// ─── DTOs / payloads ─────────────────────────────────────────────────────────

export interface ICreateProductDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  precioOferta?: number | '';
  moneda: string;
  imagenPrincipalUrl?: string;
  imagenPrincipal?: File; // Para Multer (FormData)
  categoriaId?: number | '';
  disponible: boolean;
  destacado: boolean;
  tags: string[];
  variantes: Omit<IProductVariant, 'id'>[];
}

export interface IUpdateProductDto extends Partial<Omit<ICreateProductDto, 'variantes' | 'tags'>> {
  categoriaId?: number | '';
  tags?: string[];
}

// ─── Filtros de listado ───────────────────────────────────────────────────────

export interface IProductFilters {
  pagina?: number;
  limite?: number;
  busqueda?: string;
  disponible?: boolean;
  destacado?: boolean;
  categoriaId?: number;
  orden?: 'nombre' | 'precio' | 'vistas' | 'creadoEn' | 'destacado';
  direccion?: 'asc' | 'desc';
}

// ─── Respuesta paginada del backend ──────────────────────────────────────────
// `responderPaginado` usa: { ok, mensaje, datos: T[], paginacion: { total, pagina, limite, totalPaginas } }

export interface IProductPaginacion {
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

export interface IProductPaginatedResponse {
  datos: IProduct[];
  paginacion: IProductPaginacion;
}
