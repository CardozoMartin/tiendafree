import type { TemplateConfig } from './types';

type TemplateIdValue = string | number;

type TemplateObject = {
  id?: TemplateIdValue;
  nombre?: TemplateIdValue;
};

type TemplateReference = {
  plantilla?: TemplateIdValue | TemplateObject;
  plantillaId?: TemplateIdValue;
  plantilla_id?: TemplateIdValue;
  template?: TemplateIdValue;
  templateId?: TemplateIdValue;
  template_id?: TemplateIdValue;
};

type TiendaWithTemplate = TemplateReference & {
  datos?: TiendaWithTemplate;
  temaConfig?: TiendaWithTemplate;
  tema_config?: TiendaWithTemplate;
};

export const TEMPLATES: Record<string, TemplateConfig> = {
  plantilla_accesorios: {
    id: 'plantilla_accesorios',
    nombre: 'Accesorios',
    descripcion: 'Joyería y accesorios artesanales',
    secciones: [],
  },
  plantilla_gorras: {
    id: 'plantilla_gorras',
    nombre: 'Gorras',
    descripcion: 'Gorras y streetwear',
    secciones: [],
  },
  plantilla_ropa: {
    id: 'plantilla_ropa',
    nombre: 'Ropa',
    descripcion: 'Moda y ropa de autor',
    secciones: [],
  },
  plantilla_urban: {
    id: 'plantilla_urban',
    nombre: 'Urban Tiendzi',
    descripcion: 'Estilo urbano dark / streetwear',
    secciones: [],
  },
};

const TEMPLATE_ALIASES: Record<string, string> = {
  '1': 'plantilla_ropa',
  '2': 'plantilla_gorras',
  '3': 'plantilla_accesorios',
  '4': 'plantilla_urban',
  accesorios: 'plantilla_accesorios',
  joyeria: 'plantilla_accesorios',
  gorras: 'plantilla_gorras',
  caps: 'plantilla_gorras',
  ropa: 'plantilla_ropa',
  moda: 'plantilla_ropa',
  veste: 'plantilla_ropa',
  urban: 'plantilla_urban',
  urbano: 'plantilla_urban',
};

export const normalizeTemplateId = (value: unknown): string | null => {
  if (typeof value === 'number') {
    return TEMPLATE_ALIASES[String(value)] ?? null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  return TEMPLATES[normalized] ? normalized : TEMPLATE_ALIASES[normalized] ?? null;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getTemplateCandidates = (
  source?: TiendaWithTemplate,
  plantillaObject?: TemplateObject
): unknown[] => [
  plantillaObject?.nombre,
  plantillaObject?.id,
  source?.plantillaId,
  source?.plantilla_id,
  source?.templateId,
  source?.template_id,
  source?.template,
  source?.plantilla,
];

const resolveTemplateIdFromSource = (source?: TiendaWithTemplate): string | null => {
  if (!source) return null;
  const plantillaObject = isObject(source.plantilla) ? source.plantilla : undefined;

  for (const candidate of getTemplateCandidates(source, plantillaObject)) {
    const resolved = normalizeTemplateId(candidate);
    if (resolved) return resolved;
  }

  return null;
};

export const resolveTemplateIdFromShop = (
  tienda: TiendaWithTemplate | null | undefined,
  fallback = 'plantilla_accesorios'
): string => {
  const root = isObject(tienda) ? tienda : undefined;
  const datos = isObject(root?.datos) ? root.datos : undefined;
  const temaConfig = isObject(root?.temaConfig)
    ? root.temaConfig
    : isObject(root?.tema_config)
    ? root.tema_config
    : undefined;
  const datosTemaConfig = isObject(datos?.temaConfig)
    ? datos.temaConfig
    : isObject(datos?.tema_config)
    ? datos?.tema_config
    : undefined;

  return (
    resolveTemplateIdFromSource(root) ||
    resolveTemplateIdFromSource(datos) ||
    resolveTemplateIdFromSource(temaConfig) ||
    resolveTemplateIdFromSource(datosTemaConfig) ||
    fallback
  );
};

export const getTemplateConfig = (plantillaId: string): TemplateConfig | null => {
  const normalized = normalizeTemplateId(plantillaId);
  return normalized ? TEMPLATES[normalized] ?? null : null;
};

export const getTemplateSecciones = (plantillaId: string) =>
  getTemplateConfig(plantillaId)?.secciones ?? [];
