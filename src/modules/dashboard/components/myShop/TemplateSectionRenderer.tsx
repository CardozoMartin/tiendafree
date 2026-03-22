import { useState } from 'react';
import type { TemplateConfig } from '../../../templates/types';
import HeroGallery from '../../../templates/templateModer/HeroGallery';

interface TemplateSectionRendererProps {
  config: TemplateConfig | undefined;
  tienda: any;
  tiendaData: any;
  onUpdate: (sectionId: string, data: any) => void;
}

/**
 * Renderiza dinámicamente los editores de secciones según la plantilla
 * Escala automáticamente a nuevas plantillas y secciones
 */
export const TemplateSectionRenderer = ({
  config,
  tienda,
  tiendaData,
  onUpdate,
}: TemplateSectionRendererProps) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  if (!config || !config.secciones) {
    return (
      <div className="text-center p-8 text-slate-500">
        <p>No hay secciones configuradas para esta plantilla</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {config.secciones.map((seccion) => (
        <div
          key={seccion.id}
          className="border border-slate-200 rounded-lg bg-white overflow-hidden hover:border-slate-300 transition-colors"
        >
          {/* Header de la sección */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{seccion.label}</h3>
              <p className="text-xs text-slate-500 mt-1">{seccion.descripcion}</p>
              {seccion.campos.length > 0 && (
                <p className="text-xs text-slate-400 mt-2">
                  Campos: <span className="font-mono">{seccion.campos.join(', ')}</span>
                </p>
              )}
            </div>
            <button
              onClick={() =>
                setEditingSection(
                  editingSection === seccion.id ? null : seccion.id
                )
              }
              className={`ml-4 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                editingSection === seccion.id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {editingSection === seccion.id ? '✕ Cerrar' : '✎ Editar'}
            </button>
          </div>

          {/* Contenido de la sección */}
          {editingSection === seccion.id && (
            <div className="p-6">
              {renderEditorForSection(seccion, tienda, tiendaData, onUpdate)}
            </div>
          )}

          {/* Preview cuando NO está en edición */}
          {editingSection !== seccion.id && (
            <div className="px-6 py-4 bg-slate-50/50 text-xs text-slate-500">
              📋 Haz clic en "Editar" para modificar esta sección
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Renderiza el editor específico según el tipo de sección
 * Extensible: agregar más secciones aquí
 */
function renderEditorForSection(
  seccion: any,
  tienda: any,
  tiendaData: any,
  onUpdate: (sectionId: string, data: any) => void
) {
  switch (seccion.id) {
    case 'hero':
      return (
        <HeroGallery
          titulo={tiendaData.titulo}
          descripcion={tiendaData.descripcion}
          carrusel={tiendaData.carrusel}
          editMode={true}
          onChange={(patch) => {
            onUpdate('hero', patch);
          }}
          onSave={() => {
            console.log('✅ Hero guardado');
            // Aquí iría la API call
          }}
          onCancel={() => {
            console.log('❌ Hero cancelado');
          }}
        />
      );

    case 'marcas':
      return (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          🚧 Editor de Marcas (próximamente)
        </div>
      );

    case 'nuevos':
      return (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded text-sm text-purple-700">
          🚧 Editor de Nuevos Ingresos (próximamente)
        </div>
      );

    case 'productos':
      return (
        <div className="p-4 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          🚧 Editor de Productos (próximamente)
        </div>
      );

    default:
      return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
          ❓ Tipo de sección desconocido: {seccion.id}
        </div>
      );
  }
}

export default TemplateSectionRenderer;
