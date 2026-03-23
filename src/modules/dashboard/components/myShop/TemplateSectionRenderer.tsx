import { useState } from 'react';
import { getTemplateSectionEditor } from '../../../templates/editorRegistry';
import { resolveTemplateIdFromShop } from '../../../templates/registry';
import type { TemplateConfig, TiendaData } from '../../../templates/types';

interface TemplateSectionRendererProps {
  config: TemplateConfig | undefined;
  tienda: any;
  tiendaData: TiendaData;
  onUpdate: (sectionId: string, data: any) => void;
}

/**
 * Renderiza dinámicamente los editores de secciones según la plantilla.
 * Usa editorRegistry para escalar automáticamente a nuevas plantillas y secciones
 * sin necesidad de modificar este componente.
 */
export const TemplateSectionRenderer = ({
  config,
  tienda,
  tiendaData,
  onUpdate,
}: TemplateSectionRendererProps) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Resolver el id de la plantilla desde el objeto tienda
  const plantillaId = resolveTemplateIdFromShop(tienda);

  const [data, setData] = useState<TiendaData>(tiendaData);

  const handleChange = (patch: Partial<TiendaData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  if (!config || !config.secciones) {
    return (
      <div className="text-center p-8 text-slate-500">
        <p>No hay secciones configuradas para esta plantilla</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {config.secciones.map((seccion) => {
        const Editor = getTemplateSectionEditor(plantillaId, seccion.id);
        const isEditing = editingSection === seccion.id;

        return (
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
              {Editor && (
                <button
                  onClick={() => setEditingSection(isEditing ? null : seccion.id)}
                  className={`ml-4 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    isEditing
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  {isEditing ? '✕ Cerrar' : '✎ Editar'}
                </button>
              )}
            </div>

            {/* Editor activo */}
            {isEditing && Editor && (
              <div className="p-6">
                <Editor
                  templateId={plantillaId}
                  sectionId={seccion.id}
                  tienda={tienda}
                  data={data}
                  editMode={true}
                  onChange={handleChange}
                  onSave={() => {
                    onUpdate(seccion.id, data);
                    setEditingSection(null);
                  }}
                  onCancel={() => setEditingSection(null)}
                />
              </div>
            )}

            {/* Placeholder cuando no hay editor para esta sección */}
            {!Editor && (
              <div className="px-6 py-4 bg-slate-50/50 text-xs text-slate-400 text-center">
                🚧 Editor para "{seccion.label}" próximamente
              </div>
            )}

            {/* Mensaje cuando hay editor pero no está abierto */}
            {Editor && !isEditing && (
              <div className="px-6 py-4 bg-slate-50/50 text-xs text-slate-500">
                📋 Haz clic en "Editar" para modificar esta sección
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TemplateSectionRenderer;
