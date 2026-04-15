import type { ComponentType } from 'react';
import HeroSectionEditor from './editors/HeroSectionEditor';
import PinkHeroSectionEditor from './editors/PinkHeroSectionEditor';
import type { TiendaData } from './types';

export interface TemplateSectionEditorProps {
  templateId: string;
  sectionId: string;
  tienda?: unknown;
  data: TiendaData;
  editMode: boolean;
  onChange: (patch: Partial<TiendaData>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export type TemplateSectionEditor = ComponentType<TemplateSectionEditorProps>;

const DEFAULT_SECTION_EDITORS: Record<string, TemplateSectionEditor | null> = {
  hero: HeroSectionEditor,
  marcas: null,
  nuevos: null,
  productos: null,
  galeria: null,
};

const TEMPLATE_SECTION_EDITORS: Record<string, Record<string, TemplateSectionEditor | null>> = {
  plantilla_comun: {
    hero: HeroSectionEditor,
    marcas: null,
    nuevos: null,
    productos: null,
  },
  plantilla_pink: {
    hero: PinkHeroSectionEditor,
    galeria: null,
    productos: null,
  },
};

export const getTemplateSectionEditor = (
  templateId: string,
  sectionId: string
): TemplateSectionEditor | null => {
  const templateEditor = TEMPLATE_SECTION_EDITORS[templateId]?.[sectionId];
  if (typeof templateEditor !== 'undefined') {
    return templateEditor;
  }

  return DEFAULT_SECTION_EDITORS[sectionId] ?? null;
};
