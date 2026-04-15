import { Plus, Upload, X } from 'lucide-react';
import { useRef } from 'react';

interface CarruselItem {
  id?: number;
  url: string;
  src?: string;
  titulo?: string | null;
  subtitulo?: string | null;
  linkUrl?: string | null;
  orden?: number;
  activa?: boolean;
}

export interface HeroGalleryProps {
  titulo: string;
  descripcion?: string;
  carrusel?: CarruselItem[];
  editMode?: boolean;
  onChange?: (patch: { titulo?: string; descripcion?: string; carrusel?: CarruselItem[] }) => void;
  onSave?: () => void;
  onCancel?: () => void;
  heroLayout?: string;
}

const nextId = (items: CarruselItem[]) =>
  items.length > 0 ? Math.max(...items.map((i) => i.id ?? 0)) + 1 : 1;

export const HeroGallery = ({
  titulo,
  descripcion,
  carrusel = [],
  editMode = false,
  onChange,
  onSave,
  onCancel,
  heroLayout = 'split',
}: HeroGalleryProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleTitulo = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange?.({ titulo: e.target.value });

  const handleDescripcion = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    onChange?.({ descripcion: e.target.value });

  const handleRemoveImg = (index: number) =>
    onChange?.({ carrusel: carrusel.filter((_, i) => i !== index) });

  const handleAddUrl = () => {
    const url = prompt('Pegá la URL de la imagen:');
    if (!url?.trim()) return;
    onChange?.({
      carrusel: [
        ...carrusel,
        {
          id: nextId(carrusel),
          url: url.trim(),
          titulo: null,
          orden: carrusel.length,
          activa: true,
        },
      ],
    });
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const nuevas: CarruselItem[] = files.map((f, i) => ({
      id: nextId(carrusel) + i,
      url: URL.createObjectURL(f),
      titulo: null,
      orden: carrusel.length + i,
      activa: true,
    }));
    onChange?.({ carrusel: [...carrusel, ...nuevas] });
    e.target.value = '';
  };

  return (
    <section
      className="px-6 md:px-16 lg:px-24 xl:px-32 py-12 relative transition-colors duration-500"
      style={{ backgroundColor: 'var(--hero-bg)' }}
    >
      {/* ── Título ── */}
      {editMode ? (
        <input
          value={titulo}
          onChange={handleTitulo}
          placeholder="Título de tu tienda..."
          className="w-full text-3xl font-semibold text-center bg-transparent border-b-2 border-indigo-400 outline-none pb-1 text-gray-900 placeholder-gray-300 focus:border-indigo-500 transition"
        />
      ) : (
        <h1 className="text-3xl font-semibold text-center mx-auto">{titulo}</h1>
      )}

      {/* ── Descripción ── */}
      {editMode ? (
        <textarea
          value={descripcion ?? ''}
          onChange={handleDescripcion}
          rows={2}
          placeholder="Descripción breve de tu tienda..."
          className={`w-full text-sm text-slate-500 mt-3 max-w-lg mx-auto block bg-transparent border-b border-dashed border-gray-300 outline-none resize-none focus:border-indigo-400 transition placeholder-gray-300 ${
            heroLayout === 'centered' ? 'text-center' : 'text-left md:ml-0'
          }`}
        />
      ) : (
        <p
          className={`text-sm text-slate-500 mt-2 max-w-lg mx-auto ${heroLayout === 'centered' ? 'text-center' : 'text-left md:ml-0'}`}
        >
          {descripcion || 'Bienvenido a nuestra tienda online.'}
        </p>
      )}

      {/* ── Galería desktop (Paridad Exacta con Ejemplo) ── */}
      <div className="hidden md:flex items-center gap-2 h-[400px] w-full max-w-4xl mt-10 mx-auto">
        {carrusel.length === 0 && !editMode && (
          <p className="text-slate-400 text-sm mx-auto">No hay imágenes cargadas</p>
        )}

        {carrusel.map((img, i) => (
          <div
            key={img.id ?? i}
            className={`relative group flex-grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 cursor-pointer ${
              editMode ? 'hover:w-80' : 'hover:w-full'
            }`}
          >
            <img
              className="h-full w-full object-cover object-center"
              src={img.url || img.src}
              alt={`gallery-${i}`}
            />
            {editMode && (
              <button
                onClick={() => handleRemoveImg(i)}
                className="absolute top-2 right-2 z-10 w-7 h-7 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        {/* Slot agregar — solo en editMode */}
        {editMode && (
          <div
            className="flex-shrink-0 w-[72px] h-[400px] rounded-lg border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer bg-gray-50/50 group"
            onClick={() => fileRef.current?.click()}
          >
            <div className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <span className="text-[11px] text-gray-400 group-hover:text-indigo-500 text-center px-2 transition-colors">
              Agregar imagen
            </span>
          </div>
        )}
      </div>

      {/* ── Galería mobile ── */}
      <div className="md:hidden mt-8">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 scroll-smooth [scrollbar-width:none]">
          {carrusel.map((img, i) => (
            <div
              key={img.id ?? i}
              className="snap-center flex-shrink-0 w-[75vw] h-64 rounded-2xl overflow-hidden relative"
            >
              <img
                className="w-full h-full object-cover object-center"
                src={img.url || img.src}
                alt={`gallery-${i}`}
              />
              {editMode && (
                <button
                  onClick={() => handleRemoveImg(i)}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          {editMode && (
            <div
              className="snap-center flex-shrink-0 w-[40vw] h-64 rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-400 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-50"
              onClick={() => fileRef.current?.click()}
            >
              <Plus className="w-6 h-6 text-gray-300" />
              <span className="text-[11px] text-gray-400 text-center px-3">Agregar</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Botones agregar por URL + upload ── */}
      {editMode && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
          >
            <Upload className="w-4 h-4" />
            Subir desde dispositivo
          </button>
          <button
            onClick={handleAddUrl}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all"
          >
            <Plus className="w-4 h-4" />
            Agregar por URL
          </button>
        </div>
      )}

      {/* ── Acciones guardar/cancelar ── */}
      {editMode && (
        <div className="flex items-center justify-center gap-3 mt-6">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          )}
          {onSave && (
            <button
              onClick={onSave}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Guardar sección
            </button>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
    </section>
  );
};

export default HeroGallery;
