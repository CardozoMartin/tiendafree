import { useState, useRef } from 'react';
import {
  usePopups,
  useCrearPopup,
  useActualizarPopup,
  useSubirImagenPopup,
  useEliminarPopup,
} from '../../hooks/usePopups';
import type { Popup, TipoPopup, FrecuenciaPopup } from '../../api/popups.api';

// ─── Labels ──────────────────────────────────────────────────────────────────

const TIPO_LABELS: Record<TipoPopup, string> = {
  OFERTA: '🏷️ Oferta / Descuento',
  NEWSLETTER: '📧 Newsletter',
  INFO: 'ℹ️ Info / Aviso',
  IMAGEN_CTA: '🖼️ Imagen + CTA',
};

const FRECUENCIA_LABELS: Record<FrecuenciaPopup, string> = {
  SIEMPRE: 'Siempre',
  UNA_VEZ_SESION: 'Una vez por sesión',
  UNA_VEZ_DIA: 'Una vez por día',
};

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
      await subirImagen.mutateAsync({ id: popupId, file: imageFile });
    }
  };

  return (
    <div className="space-y-4">
      {/* Tipo */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo de popup</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {(Object.keys(TIPO_LABELS) as TipoPopup[]).map((t) => (
            <button
              key={t}
              onClick={() => set('tipo', t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                form.tipo === t
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
              }`}
            >
              {TIPO_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Título */}
      <div>
        <label className="text-xs font-semibold text-gray-500">Título *</label>
        <input
          className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-400"
          value={form.titulo}
          onChange={(e) => set('titulo', e.target.value)}
          placeholder="Ej: ¡20% OFF en tu primera compra!"
        />
      </div>

      {/* Mensaje */}
      <div>
        <label className="text-xs font-semibold text-gray-500">Mensaje</label>
        <textarea
          className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-400 resize-none"
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
            <label className="text-xs font-semibold text-gray-500">Código de descuento</label>
            <input
              className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-400 uppercase"
              value={form.codigoDesc ?? ''}
              onChange={(e) => set('codigoDesc', e.target.value.toUpperCase())}
              placeholder="VERANO20"
            />
          </div>
          <div className="w-28">
            <label className="text-xs font-semibold text-gray-500">% descuento</label>
            <input
              type="number"
              min={1}
              max={100}
              className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-400"
              value={form.porcentajeDesc ?? ''}
              onChange={(e) => set('porcentajeDesc', Number(e.target.value) || undefined)}
              placeholder="20"
            />
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500">Texto del botón</label>
          <input
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-400"
            value={form.ctaTexto ?? ''}
            onChange={(e) => set('ctaTexto', e.target.value)}
            placeholder="Ver ofertas"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500">URL del botón</label>
          <input
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-400"
            value={form.ctaUrl ?? ''}
            onChange={(e) => set('ctaUrl', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Imagen */}
      <div>
        <label className="text-xs font-semibold text-gray-500">Imagen</label>
        <div className="mt-1 flex items-center gap-3">
          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-2 text-xs rounded-lg border border-dashed border-gray-400 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            {imageFile ? imageFile.name : 'Seleccionar imagen'}
          </button>
          {(form.imagenUrl || imageFile) && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : form.imagenUrl}
              alt="preview"
              className="h-12 w-12 object-cover rounded-lg border"
            />
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
      </div>

      {/* Configuración */}
      <div className="flex gap-3 flex-wrap">
        <div>
          <label className="text-xs font-semibold text-gray-500">Delay (segundos)</label>
          <input
            type="number"
            min={0}
            max={60}
            className="w-24 mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-400"
            value={form.delay}
            onChange={(e) => set('delay', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500">Frecuencia</label>
          <select
            className="mt-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-400"
            value={form.frecuencia}
            onChange={(e) => set('frecuencia', e.target.value as FrecuenciaPopup)}
          >
            {(Object.keys(FRECUENCIA_LABELS) as FrecuenciaPopup[]).map((f) => (
              <option key={f} value={f}>{FRECUENCIA_LABELS[f]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500">Color de fondo</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="color"
              className="w-10 h-9 rounded cursor-pointer border border-gray-300"
              value={form.colorFondo ?? '#ffffff'}
              onChange={(e) => set('colorFondo', e.target.value)}
            />
            <span className="text-xs text-gray-500">{form.colorFondo}</span>
          </div>
        </div>
      </div>

      {/* Activo */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => set('activo', !form.activo)}
          className={`w-10 h-6 rounded-full transition-colors relative ${form.activo ? 'bg-indigo-600' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.activo ? 'left-5' : 'left-1'}`} />
        </div>
        <span className="text-sm text-gray-700">Popup activo</span>
      </label>

      {/* Acciones */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSave}
          disabled={isSaving || !form.titulo}
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Popups de la tienda</h3>
          <p className="text-xs text-gray-500 mt-0.5">Configurá mensajes que aparecen al cargar la tienda</p>
        </div>
        {!creando && (
          <button
            onClick={() => setCreando(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            + Nuevo popup
          </button>
        )}
      </div>

      {/* Formulario de creación */}
      {creando && (
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
          <p className="text-xs font-semibold text-indigo-700 mb-3">Nuevo popup</p>
          <PopupForm
            initial={emptyForm()}
            onSave={handleCrear}
            onCancel={() => setCreando(false)}
            isSaving={crear.isPending}
          />
        </div>
      )}

      {/* Lista de popups */}
      {isLoading ? (
        <p className="text-sm text-gray-400">Cargando...</p>
      ) : popups.length === 0 && !creando ? (
        <p className="text-sm text-gray-400">No hay popups configurados.</p>
      ) : (
        <div className="space-y-3">
          {popups.map((popup) => (
            <div key={popup.id} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              {editandoId === popup.id ? (
                <PopupForm
                  initial={{
                    tipo: popup.tipo,
                    activo: popup.activo,
                    titulo: popup.titulo,
                    mensaje: popup.mensaje ?? '',
                    imagenUrl: popup.imagenUrl,
                    ctaTexto: popup.ctaTexto ?? '',
                    ctaUrl: popup.ctaUrl ?? '',
                    colorFondo: popup.colorFondo ?? '#ffffff',
                    delay: popup.delay,
                    frecuencia: popup.frecuencia,
                    codigoDesc: popup.codigoDesc ?? '',
                    porcentajeDesc: popup.porcentajeDesc ?? undefined,
                  }}
                  onSave={(form) => handleActualizar(popup.id, form)}
                  onCancel={() => setEditandoId(null)}
                  isSaving={actualizar.isPending}
                  popupId={popup.id}
                />
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {popup.imagenUrl && (
                      <img src={popup.imagenUrl} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                          {TIPO_LABELS[popup.tipo]}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${popup.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {popup.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 mt-1">{popup.titulo}</p>
                      {popup.mensaje && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{popup.mensaje}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        Delay: {popup.delay}s · {FRECUENCIA_LABELS[popup.frecuencia]}
                        {popup.codigoDesc && ` · Código: ${popup.codigoDesc}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Toggle activo */}
                    <div
                      onClick={() => handleToggle(popup)}
                      className={`w-9 h-5 rounded-full cursor-pointer transition-colors relative ${popup.activo ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${popup.activo ? 'left-4' : 'left-0.5'}`} />
                    </div>
                    <button
                      onClick={() => setEditandoId(popup.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={() => { if (confirm('¿Eliminar este popup?')) eliminar.mutate(popup.id); }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
