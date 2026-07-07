import { useState, useRef } from 'react';
import { Tag, Mail, Info, Image as ImageIcon, Upload, Pencil, Trash2, Plus, Clock, Repeat, Palette } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { comprimirImagen } from '../../utils/comprimirImagen';
import {
  usePopups,
  useCrearPopup,
  useActualizarPopup,
  useSubirImagenPopup,
  useEliminarPopup,
} from '../../hooks/usePopups';
import type { Popup, TipoPopup, FrecuenciaPopup } from '../../api/popups.api';

// ─── Labels e iconos ──────────────────────────────────────────────────────────

const TIPO_META: Record<TipoPopup, { label: string; icon: LucideIcon }> = {
  OFERTA: { label: 'Oferta / Descuento', icon: Tag },
  NEWSLETTER: { label: 'Newsletter', icon: Mail },
  INFO: { label: 'Info / Aviso', icon: Info },
  IMAGEN_CTA: { label: 'Imagen + CTA', icon: ImageIcon },
};

const FRECUENCIA_LABELS: Record<FrecuenciaPopup, string> = {
  SIEMPRE: 'Siempre',
  UNA_VEZ_SESION: 'Una vez por sesión',
  UNA_VEZ_DIA: 'Una vez por día',
};

// ─── Estilos compartidos (mismos que Banner promo) ────────────────────────────

const INPUT = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-slate-400 transition-colors';
const LABEL = 'text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const emptyForm = (): Omit<Popup, 'id' | 'tiendaId' | 'creadoEn'> => ({
  tipo: 'INFO',
  activo: false,
  titulo: '',
  mensaje: '',
  ctaTexto: '',
  ctaUrl: '',
  colorFondo: '#ffffff',
  delay: 2,
  frecuencia: 'UNA_VEZ_SESION',
  codigoDesc: '',
  porcentajeDesc: undefined,
});

// Toggle reutilizable con la forma prolija (bolita siempre dentro).
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-full transition-colors flex-shrink-0 ${on ? 'bg-slate-900' : 'bg-slate-300'}`}
      style={{ width: 36, height: 20 }}
    >
      <span
        className="absolute bg-white rounded-full shadow-sm transition-transform"
        style={{ width: 14, height: 14, top: 3, left: 3, transform: on ? 'translateX(16px)' : 'translateX(0)' }}
      />
    </button>
  );
}

// ─── Sub-componente: formulario ───────────────────────────────────────────────

function PopupForm({
  initial,
  onSave,
  onCancel,
  isSaving,
  popupId,
}: {
  initial: ReturnType<typeof emptyForm>;
  onSave: (data: ReturnType<typeof emptyForm>) => void;
  onCancel: () => void;
  isSaving: boolean;
  popupId?: number;
}) {
  const [form, setForm] = useState(initial);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const subirImagen = useSubirImagenPopup();

  const set = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    onSave(form);
    if (imageFile && popupId) {
      const comprimido = await comprimirImagen(imageFile);
      await subirImagen.mutateAsync({ id: popupId, file: comprimido });
    }
  };

  return (
    <div className="space-y-5">
      {/* Tipo */}
      <div>
        <label className={LABEL}>Tipo de popup</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(TIPO_META) as TipoPopup[]).map((t) => {
            const { label, icon: Icon } = TIPO_META[t];
            const activo = form.tipo === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => set('tipo', t)}
                className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                  activo ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-slate-200 text-slate-500 hover:border-slate-400'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.8} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Título */}
      <div>
        <label className={LABEL}>Título *</label>
        <input
          className={INPUT}
          value={form.titulo}
          onChange={(e) => set('titulo', e.target.value)}
          placeholder="Ej: ¡20% OFF en tu primera compra!"
        />
      </div>

      {/* Mensaje */}
      <div>
        <label className={LABEL}>Mensaje</label>
        <textarea
          className={`${INPUT} resize-none`}
          rows={3}
          value={form.mensaje}
          onChange={(e) => set('mensaje', e.target.value)}
          placeholder="Descripción del popup..."
        />
      </div>

      {/* Código descuento (solo OFERTA) */}
      {form.tipo === 'OFERTA' && (
        <div className="flex gap-3">
          <div className="flex-1">
            <label className={LABEL}>Código de descuento</label>
            <input
              className={`${INPUT} uppercase`}
              value={form.codigoDesc ?? ''}
              onChange={(e) => set('codigoDesc', e.target.value.toUpperCase())}
              placeholder="VERANO20"
            />
          </div>
          <div className="w-28">
            <label className={LABEL}>% descuento</label>
            <input
              type="number"
              min={1}
              max={100}
              className={INPUT}
              value={form.porcentajeDesc ?? ''}
              onChange={(e) => set('porcentajeDesc', Number(e.target.value) || undefined)}
              placeholder="20"
            />
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Texto del botón</label>
          <input
            className={INPUT}
            value={form.ctaTexto ?? ''}
            onChange={(e) => set('ctaTexto', e.target.value)}
            placeholder="Ver ofertas"
          />
        </div>
        <div>
          <label className={LABEL}>URL del botón</label>
          <input
            className={INPUT}
            value={form.ctaUrl ?? ''}
            onChange={(e) => set('ctaUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Imagen */}
      <div>
        <label className={LABEL}>Imagen</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            {imageFile ? 'Cambiar imagen' : form.imagenUrl ? 'Cambiar imagen' : 'Subir imagen'}
          </button>
          {(form.imagenUrl || imageFile) && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : form.imagenUrl}
              alt="preview"
              className="h-12 w-12 object-cover rounded-lg border border-slate-200"
            />
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
      </div>

      {/* Configuración */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className={LABEL}><Clock className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />Delay (seg)</label>
          <input
            type="number"
            min={0}
            max={60}
            className={INPUT}
            value={form.delay}
            onChange={(e) => set('delay', Number(e.target.value))}
          />
        </div>
        <div>
          <label className={LABEL}><Repeat className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />Frecuencia</label>
          <select
            className={INPUT}
            value={form.frecuencia}
            onChange={(e) => set('frecuencia', e.target.value as FrecuenciaPopup)}
          >
            {(Object.keys(FRECUENCIA_LABELS) as FrecuenciaPopup[]).map((f) => (
              <option key={f} value={f}>{FRECUENCIA_LABELS[f]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}><Palette className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />Color de fondo</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              className="w-11 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
              value={form.colorFondo ?? '#ffffff'}
              onChange={(e) => set('colorFondo', e.target.value)}
            />
            <span className="text-xs text-slate-500">{form.colorFondo}</span>
          </div>
        </div>
      </div>

      {/* Activo */}
      <div className="flex items-center gap-3">
        <Toggle on={!!form.activo} onClick={() => set('activo', !form.activo)} />
        <span className="text-sm font-medium text-slate-700">Popup activo</span>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !form.titulo}
          className="flex-1 py-2.5 text-sm font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 transition-all"
        >
          {isSaving ? 'Guardando...' : 'Guardar popup'}
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function PopupManager() {
  const { data: popups = [], isLoading } = usePopups();
  const crear = useCrearPopup();
  const actualizar = useActualizarPopup();
  const eliminar = useEliminarPopup();

  const [creando, setCreando] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  // Mientras se crea o edita, se oculta la lista (mismo flujo que Categorías).
  const editando = creando || editandoId !== null;

  const handleCrear = async (form: ReturnType<typeof emptyForm>) => {
    await crear.mutateAsync(form as any);
    setCreando(false);
  };

  const handleActualizar = async (id: number, form: ReturnType<typeof emptyForm>) => {
    await actualizar.mutateAsync({ id, payload: form as any });
    setEditandoId(null);
  };

  const handleToggle = (popup: Popup) => {
    actualizar.mutate({ id: popup.id, payload: { activo: !popup.activo } });
  };

  const popupEditando = popups.find((p) => p.id === editandoId);

  return (
    <div className="space-y-5">
      {/* ── VISTA FORMULARIO (crear o editar): oculta la lista ── */}
      {editando ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-bold text-slate-800">{creando ? 'Nuevo popup' : 'Editar popup'}</p>
              <p className="text-xs text-slate-400 mt-0.5">Configurá el mensaje, su aspecto y cuándo aparece.</p>
            </div>
            <button
              type="button"
              onClick={() => { setCreando(false); setEditandoId(null); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Volver
            </button>
          </div>

          {creando ? (
            <PopupForm
              initial={emptyForm()}
              onSave={handleCrear}
              onCancel={() => setCreando(false)}
              isSaving={crear.isPending}
            />
          ) : popupEditando ? (
            <PopupForm
              initial={{
                tipo: popupEditando.tipo,
                activo: popupEditando.activo,
                titulo: popupEditando.titulo,
                mensaje: popupEditando.mensaje ?? '',
                imagenUrl: popupEditando.imagenUrl,
                ctaTexto: popupEditando.ctaTexto ?? '',
                ctaUrl: popupEditando.ctaUrl ?? '',
                colorFondo: popupEditando.colorFondo ?? '#ffffff',
                delay: popupEditando.delay,
                frecuencia: popupEditando.frecuencia,
                codigoDesc: popupEditando.codigoDesc ?? '',
                porcentajeDesc: popupEditando.porcentajeDesc ?? undefined,
              }}
              onSave={(form) => handleActualizar(popupEditando.id, form)}
              onCancel={() => setEditandoId(null)}
              isSaving={actualizar.isPending}
              popupId={popupEditando.id}
            />
          ) : null}
        </div>
      ) : (
        /* ── VISTA LISTA: cards de popups + botón para crear ── */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-slate-800">Popups de la tienda</p>
              <p className="text-xs text-slate-400 mt-0.5">Mensajes que aparecen al cargar la tienda.</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-sm text-slate-400 py-8 text-center">Cargando…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {popups.map((popup) => {
                const { label, icon: Icon } = TIPO_META[popup.tipo];
                return (
                  <div key={popup.id} className="rounded-xl border border-slate-100 p-4 flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      {popup.imagenUrl ? (
                        <img src={popup.imagenUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-100 flex-shrink-0" />
                      ) : (
                        <span className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                          <Icon className="w-5 h-5" strokeWidth={1.8} />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                          <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                          {label}
                        </div>
                        <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">{popup.titulo}</p>
                        {popup.mensaje && <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{popup.mensaje}</p>}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400">
                      Delay: {popup.delay}s · {FRECUENCIA_LABELS[popup.frecuencia]}
                      {popup.codigoDesc && ` · ${popup.codigoDesc}`}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                      <div className="flex items-center gap-2">
                        <Toggle on={popup.activo} onClick={() => handleToggle(popup)} />
                        <span className={`text-xs font-semibold ${popup.activo ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {popup.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditandoId(popup.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" strokeWidth={1.8} />
                        </button>
                        <button
                          onClick={() => { if (confirm('¿Eliminar este popup?')) eliminar.mutate(popup.id); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Card "Nuevo popup" */}
              <button
                type="button"
                onClick={() => setCreando(true)}
                className="rounded-xl border-2 border-dashed border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-slate-900 min-h-[140px] group"
              >
                <span className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-all">
                  <Plus className="w-5 h-5" strokeWidth={2} />
                </span>
                <span className="text-sm font-semibold">Nuevo popup</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
