import { useConfirm } from '@components/ConfirmDialog/useConfirm';
import { useRef, useState, useEffect } from 'react';
import {
  useAddShopCarouselImage,
  useActualizarSeccion,
  useDeleteShopCarouselImage,
  useCarruselAdmin,
} from '../../hooks/useCarrusel';
import type { CarruselSeccion, TipoSeccionHero } from '../../api/carrusel.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putUpdateShopVisualFn } from '../../api/shop.api';
import { toast } from 'sonner';

// ── Helpers ──────────────────────────────────────────────────────────────────

const TIPOS: { value: TipoSeccionHero; label: string; icon: string }[] = [
  { value: 'CARRUSEL', label: 'Carrusel', icon: '🎠' },
  { value: 'BANNER', label: 'Banner estático', icon: '🖼️' },
  { value: 'HERO_FIJO', label: 'Hero pantalla completa', icon: '✨' },
  { value: 'VIDEO', label: 'Video', icon: '▶️' },
];

function estadoSeccion(s: CarruselSeccion): { label: string; color: string } {
  const ahora = new Date();
  if (!s.activa) return { label: 'Pausada', color: 'bg-gray-100 text-gray-500' };
  const desde = s.fechaDesde ? new Date(s.fechaDesde) : null;
  const hasta = s.fechaHasta ? new Date(s.fechaHasta) : null;
  if (desde && ahora < desde) return { label: 'Programada', color: 'bg-blue-50 text-blue-600' };
  if (hasta && ahora > hasta) return { label: 'Vencida', color: 'bg-red-50 text-red-500' };
  return { label: 'Activa', color: 'bg-green-50 text-green-600' };
}

function toInputDate(iso?: string | null) {
  if (!iso) return '';
  return iso.slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

// ── Componente de edición inline de una sección ───────────────────────────────

function SeccionEditForm({
  seccion,
  onClose,
}: {
  seccion: CarruselSeccion;
  onClose: () => void;
}) {
  const { mutate: actualizar, isPending } = useActualizarSeccion();
  const [form, setForm] = useState({
    titulo: seccion.titulo ?? '',
    subtitulo: seccion.subtitulo ?? '',
    linkUrl: seccion.linkUrl ?? '',
    etiqueta: seccion.etiqueta ?? '',
    tipo: seccion.tipo,
    fechaDesde: toInputDate(seccion.fechaDesde),
    fechaHasta: toInputDate(seccion.fechaHasta),
  });

  const handleSave = () => {
    actualizar(
      {
        id: seccion.id,
        datos: {
          ...form,
          fechaDesde: form.fechaDesde ? new Date(form.fechaDesde).toISOString() : null,
          fechaHasta: form.fechaHasta ? new Date(form.fechaHasta).toISOString() : null,
        },
      },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="px-5 py-4 bg-gray-50/60 border-t border-gray-100 space-y-4">
      {/* Etiqueta interna */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Etiqueta interna (ej: "Promo Día del Padre")
        </label>
        <input
          type="text"
          placeholder="Nombre para identificarla en el panel"
          className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-800 transition-colors"
          value={form.etiqueta}
          onChange={(e) => setForm({ ...form, etiqueta: e.target.value })}
        />
      </div>

      {/* Tipo de visualización */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Tipo de visualización
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TIPOS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm({ ...form, tipo: t.value })}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                form.tipo === t.value
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Título y subtítulo */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Título
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-800 transition-colors"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Subtítulo
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-800 transition-colors"
            value={form.subtitulo}
            onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
          />
        </div>
      </div>

      {/* Link */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
          URL de destino (opcional)
        </label>
        <input
          type="url"
          placeholder="https://..."
          className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-800 transition-colors"
          value={form.linkUrl}
          onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
        />
      </div>

      {/* Fechas programadas */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Mostrar desde
          </label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-800 transition-colors"
            value={form.fechaDesde}
            onChange={(e) => setForm({ ...form, fechaDesde: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Ocultar desde
          </label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-800 transition-colors"
            value={form.fechaHasta}
            onChange={(e) => setForm({ ...form, fechaHasta: e.target.value })}
          />
        </div>
      </div>
      <p className="text-[10px] text-gray-400">
        Dejá las fechas vacías para que siempre esté visible (según el toggle de activación).
      </p>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-xs font-medium rounded-lg transition-all"
        >
          {isPending ? (
            <>
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </div>
    </div>
  );
}

// ── Formulario de nueva sección ───────────────────────────────────────────────

function NuevaSeccionForm({ onClose }: { onClose: () => void }) {
  const { mutateAsync: addCarouselImage, isPending } = useAddShopCarouselImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append('carruselImagenes', file);
    fd.append('tipo', 'CARRUSEL');
    fd.append('orden', '0');
    try {
      await addCarouselImage(fd);
      onClose();
    } catch {
      // el hook ya muestra el toast de error
    }
  };

  return (
    <div className="px-5 py-5 border-t border-gray-100 bg-gray-50/30 space-y-4">
      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Nueva imagen</p>

      {/* Zona de imagen */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full h-36 rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-all flex items-center justify-center ${
          preview ? 'border-gray-300' : 'border-gray-200 hover:border-gray-400 bg-white'
        }`}
      >
        {preview ? (
          <>
            <img src={preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-semibold">Cambiar imagen</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            <span className="text-xs">Tocá para elegir una imagen</span>
          </div>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <p className="text-[10px] text-gray-400">
        El tiempo entre imágenes lo controlás con el slider de arriba. Recomendamos imágenes en formato 16:9 (ej: 1280×720px).
      </p>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button onClick={onClose} className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending || !file}
          className="flex items-center gap-2 px-4 py-1.5 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white text-xs font-medium rounded-lg transition-all"
        >
          {isPending ? (
            <>
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Subiendo...
            </>
          ) : (
            'Agregar imagen'
          )}
        </button>
      </div>
    </div>
  );
}

// ── Configuración global del carrusel (intervalo) ────────────────────────────

function IntervaloCarruselEditor({ temaConfig }: { temaConfig?: { intervaloCarrusel?: number } }) {
  const queryClient = useQueryClient();
  const valorInicial = temaConfig?.intervaloCarrusel ?? 5000;
  const [segundos, setSegundos] = useState(Math.round(valorInicial / 1000));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setSegundos(Math.round((temaConfig?.intervaloCarrusel ?? 5000) / 1000));
    setDirty(false);
  }, [temaConfig?.intervaloCarrusel]);

  const mutation = useMutation({
    mutationFn: putUpdateShopVisualFn,
    onSuccess: () => {
      toast.success('Intervalo actualizado');
      queryClient.invalidateQueries({ queryKey: ['myShop'] });
      setDirty(false);
    },
    onError: () => toast.error('Error al guardar'),
  });

  const handleChange = (val: number) => {
    setSegundos(val);
    setDirty(true);
  };

  const handleGuardar = () => {
    mutation.mutate({ intervaloCarrusel: segundos * 1000 } as any);
  };

  return (
    <div className="px-5 py-4 border-b border-gray-50">
      <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Tiempo entre imágenes
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={2}
          max={15}
          step={1}
          value={segundos}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="flex-1 accent-gray-800"
        />
        <span className="text-sm font-semibold text-gray-700 w-14 text-center">
          {segundos}s
        </span>
        {dirty && (
          <button
            onClick={handleGuardar}
            disabled={mutation.isPending}
            className="px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-all"
          >
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </button>
        )}
      </div>
      <p className="text-[10px] text-gray-400 mt-1">
        Cada imagen se mostrará {segundos} segundo{segundos !== 1 ? 's' : ''} antes de pasar a la siguiente.
      </p>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

const ImageHeroHandlers = ({ temaConfig }: { temaConfig?: { intervaloCarrusel?: number } }) => {
  const { data: secciones = [], isLoading } = useCarruselAdmin();
  const { mutate: deleteSeccion } = useDeleteShopCarouselImage();
  const { mutate: actualizar } = useActualizarSeccion();
  const { confirm, ConfirmModal } = useConfirm();

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const handleToggle = (s: CarruselSeccion) => {
    actualizar({ id: s.id, datos: { activa: !s.activa } });
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm({
      titulo: '¿Eliminar sección?',
      descripcion: 'Esta acción no se puede deshacer.',
      textoCancelar: 'Cancelar',
      textoConfirmar: 'Eliminar',
      variant: 'danger',
    });
    if (ok) deleteSeccion(id);
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
          Imágenes del carrusel
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Subí las fotos que van a rotar en el hero. Podés activar o pausar cada una individualmente.
        </p>
      </div>

      {ConfirmModal}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">

        {/* Configuración de velocidad */}
        <IntervaloCarruselEditor temaConfig={temaConfig} />

        {/* Lista de secciones */}
        {isLoading ? (
          <div className="px-6 py-8 text-center text-xs text-gray-400">Cargando secciones...</div>
        ) : secciones.length === 0 ? (
          <div className="px-6 py-8 text-center text-xs text-gray-400">
            Todavía no hay secciones. Creá la primera abajo.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {secciones.map((s) => {
              const estado = estadoSeccion(s);
              const tipoInfo = TIPOS.find((t) => t.value === s.tipo);
              const isEditing = editandoId === s.id;

              return (
                <div key={s.id}>
                  <div className="flex items-center gap-3 px-5 py-3.5 group">
                    {/* Thumbnail */}
                    <img
                      src={s.url}
                      alt=""
                      className="w-12 h-10 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-gray-800 truncate">
                          {s.etiqueta || s.titulo || `Sección #${s.id}`}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${estado.color}`}>
                          {estado.label}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {tipoInfo?.icon} {tipoInfo?.label}
                        </span>
                      </div>
                      {(s.fechaDesde || s.fechaHasta) && (
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {s.fechaDesde && `Desde: ${new Date(s.fechaDesde).toLocaleDateString('es-AR')}`}
                          {s.fechaDesde && s.fechaHasta && ' · '}
                          {s.fechaHasta && `Hasta: ${new Date(s.fechaHasta).toLocaleDateString('es-AR')}`}
                        </p>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Toggle activa */}
                      <button
                        onClick={() => handleToggle(s)}
                        title={s.activa ? 'Pausar' : 'Activar'}
                        className={`relative w-8 h-4.5 rounded-full transition-colors ${
                          s.activa ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={{ width: 32, height: 18 }}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${
                            s.activa ? 'translate-x-3.5' : 'translate-x-0'
                          }`}
                          style={{ width: 14, height: 14 }}
                        />
                      </button>

                      {/* Editar */}
                      <button
                        onClick={() => setEditandoId(isEditing ? null : s.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-800 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Eliminar */}
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Panel de edición expandible */}
                  {isEditing && (
                    <SeccionEditForm seccion={s} onClose={() => setEditandoId(null)} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Formulario nueva sección */}
        {showNewForm ? (
          <NuevaSeccionForm onClose={() => setShowNewForm(false)} />
        ) : (
          <div className="px-5 py-4 border-t border-gray-50">
            <button
              onClick={() => setShowNewForm(true)}
              className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors group"
            >
              <span className="w-7 h-7 rounded-lg bg-gray-50 group-hover:bg-gray-100 border border-dashed border-gray-200 group-hover:border-gray-400 flex items-center justify-center transition-all text-sm">
                +
              </span>
              Agregar imagen al carrusel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageHeroHandlers;
