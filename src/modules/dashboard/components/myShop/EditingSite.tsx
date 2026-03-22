import { useState } from 'react';
import { getTemplateConfig, resolveTemplateIdFromShop } from '../../../templates/registry';
import type { TiendaData } from '../../../templates/types';
import RuntimeTemplatePink from '../../../templates/templatePink/TemplatePink';
import type { EditorConfig } from '../../../templates/templatePink/TemplatePink';
import TemplateModern from '../../../templates/TemplateModer';

interface EditingSiteProps {
  tienda?: any;
}

const EditingSite = ({ tienda }: EditingSiteProps) => {
  const plantillaId = resolveTemplateIdFromShop(tienda);
  const templateConfig = getTemplateConfig(plantillaId);

  // Sección actualmente en modo "edición inline" (solo puede haber una)
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Datos locales de edición (se sincronizan con la tienda)
  const [data, setData] = useState<TiendaData>({
    titulo: tienda?.titulo ?? '',
    descripcion: tienda?.descripcion ?? '',
    carrusel: tienda?.carrusel ?? [],
  });

  const handleChange = (patch: Partial<TiendaData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    console.log(`[EditingSite] Guardando sección "${editingSection}":`, data);
    setEditingSection(null);
  };

  const handleCancel = () => {
    // Revertir a los datos de la tienda original
    setData({
      titulo: tienda?.titulo ?? '',
      descripcion: tienda?.descripcion ?? '',
      carrusel: tienda?.carrusel ?? [],
    });
    setEditingSection(null);
  };

  if (!templateConfig) {
    return (
      <div className="p-8 text-center text-sm text-gray-400">
        <p>⚠️ Plantilla "{plantillaId}" no encontrada.</p>
      </div>
    );
  }

  // Configuración de edición pasada a las plantillas
  const editorConfig: EditorConfig = {
    enabled: true,
    activeSectionId: editingSection,
    onChange: handleChange,
    data,
    sections: templateConfig.secciones.map((s) => ({
      sectionId: s.id,
      label: s.label,
      onEdit: () => {
        // Al interactuar con el botón "Editar", activamos el modo edición de esa sección
        setEditingSection(s.id);
      },
    })),
  };

  // Construir los props simulando los datos en tiempo real
  const tiendaConEdicion = {
    ...tienda,
    titulo: data.titulo,
    descripcion: data.descripcion,
    carrusel: data.carrusel,
  };

  const tema = tienda?.temaConfig ?? {};
  const personalizacion = {
    temaConfig: {
      color_primario: tema?.colorPrimario,
      hero_titulo: data.titulo,
      hero_subtitulo: data.descripcion,
    },
    sections: Object.entries(tema?.seccionesVisibles ?? {}).map(([key, enabled], i) => ({
      id: i + 1,
      key,
      enabled,
    })),
  };

  return (
    <div className="relative w-full h-screen overflow-y-auto bg-white">
      {/* ── Plantilla real (Renderizada a pantalla completa) ── */}
      {plantillaId === 'plantilla_pink' ? (
        <RuntimeTemplatePink
          tienda={tiendaConEdicion}
          tema={tema}
          accent={tema?.colorPrimario ?? '#f43f5e'}
          personalizacion={personalizacion}
          editorConfig={editorConfig}
        />
      ) : (
        <TemplateModern
          tienda={tiendaConEdicion}
          tema={tema}
          accent={tema?.colorPrimario ?? '#6344ee'}
          personalizacion={personalizacion}
          editorConfig={editorConfig}
        />
      )}

      {/* ── Barra flotante de guardado ── */}
      {editingSection && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-[slideUp_0.3s_ease-out] w-[90vw] md:w-auto max-w-lg">
          <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center gap-3 md:gap-6">
            <div className="flex flex-col text-center md:text-left w-full">
              <span className="text-white font-semibold text-sm">
                Editando sección: <span className="text-rose-400 capitalize">{editingSection}</span>
              </span>
              <span className="text-slate-400 text-xs hidden md:block mt-0.5">
                Modifica los textos e imágenes directamente
              </span>
            </div>
            <div className="flex items-center justify-between w-full gap-3 md:ml-4 md:border-l md:border-slate-700 md:pl-6 pt-3 border-t border-slate-700 md:pt-0 md:border-t-0 md:w-auto md:justify-start">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors w-full md:w-auto"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-rose-500/25 transition-all w-full md:w-auto whitespace-nowrap"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditingSite;
