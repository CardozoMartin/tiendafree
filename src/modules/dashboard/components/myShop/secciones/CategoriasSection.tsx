import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateShopVisual } from '../../../hooks/useShop';
import {
  useCategoriasDestacadas,
  useAgregarCategoriaDestacada,
  useActualizarCategoriaDestacada,
  useEliminarCategoriaDestacada,
} from '../../../hooks/useCategoriasDestacadas';
import { comprimirImagen } from '../../../utils/comprimirImagen';

type Posicion = 'ANTES' | 'DESPUES';

interface Props {
  tienda?: any;
  onVolver: () => void;
}

export default function CategoriasSection({ tienda, onVolver }: Props) {
  // Config de la sección (activa + posición) — se guarda en el tema
  const { watch, setValue, handleSubmit } = useForm<{
    categoriasDestacadasActivas: boolean;
    categoriasDestacadasPosicion: Posicion;
  }>({
    defaultValues: {
      categoriasDestacadasActivas: tienda?.temaConfig?.categoriasDestacadasActivas ?? false,
      categoriasDestacadasPosicion: tienda?.temaConfig?.categoriasDestacadasPosicion ?? 'ANTES',
    },
  });
  const activas = watch('categoriasDestacadasActivas');
  const posicion = watch('categoriasDestacadasPosicion');

  const updateShopVisual = useUpdateShopVisual();
  const isSavingConfig = updateShopVisual.isPending;

  const handleSaveConfig = async (data: {
    categoriasDestacadasActivas: boolean;
    categoriasDestacadasPosicion: Posicion;
  }) => {
    await updateShopVisual.mutateAsync(data);
  };

  // CRUD de tarjetas
  const { data: categorias = [], isLoading } = useCategoriasDestacadas();
  const agregar = useAgregarCategoriaDestacada();
  const actualizar = useActualizarCategoriaDestacada();
  const eliminar = useEliminarCategoriaDestacada();

  // Form de nueva tarjeta
  const fileRef = useRef<HTMLInputElement>(null);
  const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const comprimido = await comprimirImagen(file, { maxAncho: 1000, maxAlto: 1000 });
    setNuevaImagen(comprimido);
  };

  const resetForm = () => {
    setNuevaImagen(null);
    setPreview(null);
    setTitulo('');
    setLinkUrl('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleAgregar = async () => {
    if (!nuevaImagen || !titulo.trim() || !linkUrl.trim()) return;
    const fd = new FormData();
    fd.append('photo', nuevaImagen);
    fd.append('titulo', titulo.trim());
    fd.append('linkUrl', linkUrl.trim());
    fd.append('orden', String(categorias.length));
    await agregar.mutateAsync(fd);
    resetForm();
  };

  const puedeAgregar = !!nuevaImagen && titulo.trim().length > 0 && linkUrl.trim().length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onVolver}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Secciones
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="text-lg font-black text-slate-900">Categorías destacadas</h1>
        </div>
        <button
          onClick={handleSubmit(handleSaveConfig)}
          disabled={isSavingConfig}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-all shadow-sm"
        >
          {isSavingConfig ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando…
            </>
          ) : 'Guardar'}
        </button>
      </div>

      <div className="space-y-6 pb-20">
        {/* Config: mostrar + posición */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">Mostrar sección</p>
              <p className="text-xs text-gray-400 mt-0.5">Activá para que las categorías se vean en tu tienda.</p>
            </div>
            <button
              type="button"
              onClick={() => setValue('categoriasDestacadasActivas', !activas)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${activas ? 'bg-gray-900' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${activas ? 'left-8' : 'left-1'}`} />
            </button>
          </div>

          <div>
            <p className="text-sm font-bold text-gray-800 mb-1">Ubicación</p>
            <p className="text-xs text-gray-400 mb-3">Dónde aparece respecto a los productos destacados.</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'ANTES', label: 'Antes de destacados', desc: 'Justo después de la portada.' },
                { value: 'DESPUES', label: 'Después de destacados', desc: 'Más abajo en la página.' },
              ] as const).map((op) => {
                const activo = posicion === op.value;
                return (
                  <button
                    key={op.value}
                    type="button"
                    onClick={() => setValue('categoriasDestacadasPosicion', op.value)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      activo ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-semibold text-gray-800">{op.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">{op.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tarjetas existentes */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <p className="text-sm font-bold text-gray-800 mb-1">Tus categorías</p>
          <p className="text-xs text-gray-400 mb-4">Cada tarjeta tiene una imagen, un título y un link a donde llevar al cliente.</p>

          {isLoading ? (
            <p className="text-sm text-gray-400 py-4 text-center">Cargando…</p>
          ) : categorias.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">Todavía no agregaste categorías.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              {categorias.map((c) => (
                <div key={c.id} className="relative rounded-xl overflow-hidden border border-gray-100 group">
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                    <img src={c.imagenUrl} alt={c.titulo} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <span className="text-white font-black text-lg drop-shadow">{c.titulo}</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 bg-white">
                    <span className="text-xs text-gray-400 truncate max-w-[70%]">{c.linkUrl}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => actualizar.mutate({ id: c.id, formData: buildActivaFD(!c.activa) })}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.activa ? 'text-emerald-600 bg-emerald-50' : 'text-gray-400 bg-gray-100'}`}
                        title={c.activa ? 'Visible — clic para ocultar' : 'Oculta — clic para mostrar'}
                      >
                        {c.activa ? 'visible' : 'oculta'}
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminar.mutate(c.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agregar nueva */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <p className="text-sm font-bold text-gray-800 mb-4">Agregar categoría</p>
          <div className="space-y-3">
            {/* Imagen */}
            <div
              onClick={() => fileRef.current?.click()}
              className="relative aspect-[16/9] max-w-xs rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-400 bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden transition-colors"
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-gray-400">
                  <svg className="w-7 h-7 mx-auto" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M12 3v9m0 0l-2.25-2.25M12 12l2.25-2.25" />
                  </svg>
                  <p className="text-xs mt-1">Subir imagen</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Camperas"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Ej. /productos?categoria=camperas o https://…"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900 text-gray-800"
              />
            </div>

            <button
              type="button"
              onClick={handleAgregar}
              disabled={!puedeAgregar || agregar.isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-bold rounded-xl transition-all"
            >
              {agregar.isPending ? 'Agregando…' : 'Agregar categoría'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper: FormData para actualizar solo el campo "activa" (el PUT espera multipart).
function buildActivaFD(activa: boolean): FormData {
  const fd = new FormData();
  fd.append('activa', String(activa));
  return fd;
}
