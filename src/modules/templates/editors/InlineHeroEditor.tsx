import { useRef } from 'react';
import type { TiendaData } from '../types';

interface CarruselItem {
  url: string;
  titulo?: string | null;
  subtitulo?: string | null;
}

interface InlineHeroEditorProps {
  data: TiendaData;
  onChange: (patch: Partial<TiendaData>) => void;
  /** Paleta de colores de la plantilla */
  palette?: {
    primary: string;      // color del botón, borde focus
    bg: string;           // fondo del hero
    text: string;         // color del texto
    badge: string;        // color de la etiqueta superior
  };
}

const DEFAULT_PALETTE = {
  primary: '#6366f1',
  bg: '#f8fafc',
  text: '#1e293b',
  badge: '#6366f1',
};

/**
 * Editor inline compartido para la sección Hero de cualquier plantilla.
 * Muestra el layout real del hero con:
 *  - Título y descripción como inputs editables inline
 *  - Carrusel: cada imagen con botón X para eliminar
 *  - Botón "Agregar imagen" via URL
 */
const InlineHeroEditor = ({ data, onChange, palette = DEFAULT_PALETTE }: InlineHeroEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const carrusel: CarruselItem[] = (data.carrusel ?? []).map((item) =>
    typeof item === 'string' ? { url: item } : item
  );

  const handleRemoveImage = (idx: number) => {
    const updated = carrusel.filter((_, i) => i !== idx);
    onChange({ carrusel: updated });
  };

  const handleAddImageByUrl = () => {
    const url = window.prompt('Pegá la URL de la imagen:');
    if (url?.trim()) {
      onChange({ carrusel: [...carrusel, { url: url.trim() }] });
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
      style={{ background: palette.bg, fontFamily: 'inherit' }}
    >
      {/* ── Layout hero: texto izquierda / imágenes derecha ── */}
      <div className="grid md:grid-cols-2 gap-8 p-8 items-start">
        {/* Lado izquierdo: textos editables */}
        <div className="flex flex-col gap-4">
          {/* Badge etiqueta */}
          <span
            className="inline-block w-fit text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
            style={{ color: palette.badge, background: `${palette.badge}18` }}
          >
            Tu tienda
          </span>

          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
              Título principal
            </label>
            <input
              value={data.titulo ?? ''}
              onChange={(e) => onChange({ titulo: e.target.value })}
              placeholder="Escribe el título de tu tienda..."
              className="w-full text-2xl md:text-3xl font-black bg-transparent border-0 border-b-2 outline-none pb-1 transition-colors"
              style={{
                color: palette.text,
                borderColor: `${palette.primary}40`,
                caretColor: palette.primary,
              }}
              onFocus={(e) => (e.target.style.borderColor = palette.primary)}
              onBlur={(e) => (e.target.style.borderColor = `${palette.primary}40`)}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
              Descripción / Subtítulo
            </label>
            <textarea
              value={data.descripcion ?? ''}
              onChange={(e) => onChange({ descripcion: e.target.value })}
              placeholder="Contale a tus clientes de qué trata tu tienda..."
              rows={3}
              className="w-full text-sm bg-white border rounded-xl outline-none p-3 resize-none transition-colors"
              style={{
                color: palette.text,
                borderColor: `${palette.primary}30`,
              }}
              onFocus={(e) => (e.target.style.borderColor = palette.primary)}
              onBlur={(e) => (e.target.style.borderColor = `${palette.primary}30`)}
            />
          </div>

          {/* Tip */}
          <p className="text-xs text-gray-400 italic">
            💡 Los cambios se guardan al hacer clic en "Guardar sección"
          </p>
        </div>

        {/* Lado derecho: grilla de imágenes del carrusel */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
            Imágenes ({carrusel.length})
          </label>

          {carrusel.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed gap-3"
              style={{ borderColor: `${palette.primary}40`, background: `${palette.primary}08` }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={palette.primary} strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="text-sm" style={{ color: palette.primary }}>
                Sin imágenes. Agregá la primera 👇
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {carrusel.map((item, idx) => (
                <div key={idx} className="relative group/img rounded-xl overflow-hidden aspect-square bg-gray-100">
                  <img
                    src={item.url}
                    alt={`imagen-${idx}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f1f5f9" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12" fill="%2394a3b8">Error</text></svg>';
                    }}
                  />
                  {/* Overlay con botón X */}
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-all duration-200 flex items-center justify-center">
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="opacity-0 group-hover/img:opacity-100 transition-all duration-200 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg scale-90 group-hover/img:scale-100"
                      title="Eliminar imagen"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  {/* Número de orden */}
                  <span className="absolute bottom-1 left-1 text-[10px] font-bold text-white bg-black/40 rounded px-1">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Botón agregar imagen */}
          <button
            onClick={handleAddImageByUrl}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed text-sm font-semibold transition-all hover:scale-[1.01]"
            style={{
              borderColor: `${palette.primary}50`,
              color: palette.primary,
              background: `${palette.primary}08`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar imagen por URL
          </button>

          {/* Input para subir archivo (futuro) */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
        </div>
      </div>
    </div>
  );
};

export default InlineHeroEditor;
