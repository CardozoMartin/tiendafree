import { configModer } from './templateModer/config';
import { config as configPink } from './templatePink/config';
import type { TemplateConfig } from './types';

export const TEMPLATES: Record<string, TemplateConfig> = {
  plantilla_comun: configModer,
  plantilla_pink: configPink,
};

const TEMPLATE_ALIASES: Record<string, string> = {
  '1': 'plantilla_comun',
  '2': 'plantilla_pink',
  moderna: 'plantilla_comun',
  moder: 'plantilla_comun',
  comun: 'plantilla_comun',
  common: 'plantilla_comun',
  plantilla_moderna: 'plantilla_comun',
  plantilla_moder: 'plantilla_comun',
  pink: 'plantilla_pink',
  rosada: 'plantilla_pink',
  plantilla_rosa: 'plantilla_pink',
};

export const normalizeTemplateId = (value: unknown): string | null => {
  if (typeof value === 'number') {
    const alias = TEMPLATE_ALIASES[String(value)];
    return alias ?? null;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return null;
    return TEMPLATES[normalized] ? normalized : (TEMPLATE_ALIASES[normalized] ?? null);
  }

  return null;
};

type TiendaWithTemplate = {
  plantilla?: unknown;
  plantillaId?: unknown;
  plantilla_id?: unknown;
  template?: unknown;
  templateId?: unknown;
  template_id?: unknown;
  temaConfig?: {
    plantilla?: unknown;
    plantillaId?: unknown;
    plantilla_id?: unknown;
    template?: unknown;
    templateId?: unknown;
    template_id?: unknown;
  };
  tema_config?: {
    plantilla?: unknown;
    plantillaId?: unknown;
    plantilla_id?: unknown;
    template?: unknown;
    templateId?: unknown;
    template_id?: unknown;
  };
  datos?: {
    plantilla?: unknown;
    plantillaId?: unknown;
    plantilla_id?: unknown;
    template?: unknown;
    templateId?: unknown;
    template_id?: unknown;
    temaConfig?: {
      plantilla?: unknown;
      plantillaId?: unknown;
      plantilla_id?: unknown;
      template?: unknown;
      templateId?: unknown;
      template_id?: unknown;
    };
    tema_config?: {
      plantilla?: unknown;
      plantillaId?: unknown;
      plantilla_id?: unknown;
      template?: unknown;
      templateId?: unknown;
      template_id?: unknown;
    };
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const resolveTemplateIdFromShop = (
  tienda: TiendaWithTemplate | null | undefined,
  fallback = 'plantilla_comun'
): string => {
  const plantilla = isRecord(tienda?.plantilla) ? tienda?.plantilla : undefined;
  const datos = isRecord(tienda?.datos) ? tienda?.datos : undefined;
  const plantillaDatos = isRecord(datos?.plantilla) ? datos?.plantilla : undefined;
  const temaConfig = isRecord(tienda?.temaConfig) ? tienda?.temaConfig : undefined;
  const temaConfigSnake = isRecord(tienda?.tema_config) ? tienda?.tema_config : undefined;
  const datosTemaConfig = isRecord(datos?.temaConfig) ? datos?.temaConfig : undefined;
  const datosTemaConfigSnake = isRecord(datos?.tema_config) ? datos?.tema_config : undefined;

  const plantillaTemaConfig = isRecord(temaConfig?.plantilla) ? temaConfig?.plantilla : undefined;
  const plantillaTemaConfigSnake = isRecord(temaConfigSnake?.plantilla)
    ? temaConfigSnake?.plantilla
    : undefined;
  const plantillaDatosTemaConfig = isRecord(datosTemaConfig?.plantilla)
    ? datosTemaConfig?.plantilla
    : undefined;
  const plantillaDatosTemaConfigSnake = isRecord(datosTemaConfigSnake?.plantilla)
    ? datosTemaConfigSnake?.plantilla
    : undefined;

  // Prioridad: los valores más directos y específicos primero.
  // Los objetos anidados (como plantilla={id,nombre,...}) no se resuelven
  // porque normalizeTemplateId sólo acepta string y number.
  // Por eso ponemos plantilla?.nombre y los id/plantillaId antes.
  const candidates = [
    // ── Nivel raíz: plantilla anidada ──────────────────────────────────────
    plantilla?.nombre,       // "plantilla_pink" ← más directo posible
    plantilla?.id,           // 2
    tienda?.plantillaId,     // 2
    tienda?.plantilla_id,
    tienda?.templateId,
    tienda?.template_id,
    tienda?.template,
    tienda?.plantilla,       // puede ser string en algunos casos
    // ── Nivel datos ────────────────────────────────────────────────────────
    plantillaDatos?.nombre,
    plantillaDatos?.id,
    datos?.plantillaId,
    datos?.plantilla_id,
    datos?.templateId,
    datos?.template_id,
    datos?.template,
    datos?.plantilla,
    // ── temaConfig ─────────────────────────────────────────────────────────
    plantillaTemaConfig?.nombre,
    plantillaTemaConfig?.id,
    temaConfig?.plantillaId,
    temaConfig?.plantilla_id,
    temaConfig?.templateId,
    temaConfig?.template_id,
    temaConfig?.template,
    temaConfig?.plantilla,
    plantillaTemaConfigSnake?.nombre,
    plantillaTemaConfigSnake?.id,
    temaConfigSnake?.plantillaId,
    temaConfigSnake?.plantilla_id,
    temaConfigSnake?.templateId,
    temaConfigSnake?.template_id,
    temaConfigSnake?.template,
    temaConfigSnake?.plantilla,
    // ── datos.temaConfig ───────────────────────────────────────────────────
    plantillaDatosTemaConfig?.nombre,
    plantillaDatosTemaConfig?.id,
    datosTemaConfig?.plantillaId,
    datosTemaConfig?.plantilla_id,
    datosTemaConfig?.templateId,
    datosTemaConfig?.template_id,
    datosTemaConfig?.template,
    datosTemaConfig?.plantilla,
    plantillaDatosTemaConfigSnake?.nombre,
    plantillaDatosTemaConfigSnake?.id,
    datosTemaConfigSnake?.plantillaId,
    datosTemaConfigSnake?.plantilla_id,
    datosTemaConfigSnake?.templateId,
    datosTemaConfigSnake?.template_id,
    datosTemaConfigSnake?.template,
    datosTemaConfigSnake?.plantilla,
  ];

  for (const candidate of candidates) {
    const resolved = normalizeTemplateId(candidate);
    if (resolved) return resolved;
  }

  return fallback;
};

export const getTemplateConfig = (plantillaId: string): TemplateConfig | null => {
  const normalized = normalizeTemplateId(plantillaId);
  if (!normalized) return null;
  return TEMPLATES[normalized] ?? null;
};

export const getTemplateSecciones = (plantillaId: string) => {
  const normalized = normalizeTemplateId(plantillaId);
  if (!normalized) return [];
  return TEMPLATES[normalized]?.secciones ?? [];
};
