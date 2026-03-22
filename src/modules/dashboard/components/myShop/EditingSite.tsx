import { useEffect, useState } from 'react';
import { getTemplateSectionEditor } from '../../../templates/editorRegistry';
import { getTemplateConfig, resolveTemplateIdFromShop } from '../../../templates/registry';
import type { TiendaData } from '../../../templates/types';
import { usePublicShop } from '../../hooks/useShop';

interface EditingSiteProps {
  tienda?: any;
}

// ─── COMPONENTE ──────────────────────────────────────────────────────────────

const EditingSite = ({ tienda }: EditingSiteProps) => {
  const tiendaSlug = tienda?.slug ?? tienda?.datos?.slug;
  const { data: publicShop } = usePublicShop(tiendaSlug ?? '');

  const plantillaId = resolveTemplateIdFromShop(publicShop ?? tienda);
  const templateConfig = getTemplateConfig(plantillaId);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [data, setData] = useState<TiendaData>({
    titulo: tienda?.titulo ?? 'Sin título',
    descripcion: tienda?.descripcion ?? '',
    carrusel: tienda?.carrusel ?? [],
  });

  useEffect(() => {
    if (tienda) {
      setData({
        titulo: tienda?.titulo ?? 'Sin título',
        descripcion: tienda?.descripcion ?? '',
        carrusel: tienda?.carrusel ?? [],
      });
    }
  }, [tienda]);

  const handleChange = (patch: Partial<TiendaData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = (sectionId: string) => {
    console.log(`Guardando sección "${sectionId}":`, data);
    setEditingSection(null);
  };

  if (!templateConfig) {
    return (
      <div className="p-6 text-sm text-gray-400">
        Plantilla "{plantillaId}" no encontrada en el registro.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {templateConfig.secciones.map((seccion) => {
        const Editor = getTemplateSectionEditor(plantillaId, seccion.id);
        const isEditing = editingSection === seccion.id;

        return (
          <div key={seccion.id} className="relative group/section">
            {Editor ? (
              <Editor
                templateId={plantillaId}
                sectionId={seccion.id}
                tienda={tienda}
                data={data}
                editMode={isEditing}
                onChange={handleChange}
                onSave={() => handleSave(seccion.id)}
                onCancel={() => setEditingSection(null)}
              />
            ) : (
              <div className="px-6 md:px-16 py-10 border-b border-dashed border-gray-100">
                <p className="text-sm text-gray-300 text-center">
                  {seccion.label} - editor próximamente
                </p>
              </div>
            )}

            {!isEditing && Editor && (
              <button
                onClick={() => setEditingSection(seccion.id)}
                className="
                  absolute top-3 right-3 z-10
                  opacity-0 group-hover/section:opacity-100
                  transition-opacity duration-150
                  flex items-center gap-1.5 px-3 py-1.5
                  bg-white border border-gray-200 rounded-lg shadow-sm
                  text-xs font-medium text-gray-600
                  hover:border-indigo-400 hover:text-indigo-500
                "
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar {seccion.label}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EditingSite;
