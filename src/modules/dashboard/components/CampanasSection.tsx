import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getConfigEmailFn,
  getDestinatariosCampanaFn,
  listarCampanasFn,
  crearCampanaFn,
  enviarCampanaFn,
  postBannerPromoImagenFn,
  type SegmentoCampana,
  type EstadoCampana,
  type Campana,
} from '../api/shop.api';
import MI from './MaterialIcon';

const SEGMENTOS: { id: SegmentoCampana; label: string }[] = [
  { id: 'CLIENTES_REGISTRADOS', label: 'Clientes registrados' },
  { id: 'COMPRADORES', label: 'Compradores' },
  { id: 'AMBOS', label: 'Todos' },
];

const ESTADO_BADGE: Record<EstadoCampana, { label: string; clase: string }> = {
  BORRADOR: { label: 'Borrador', clase: 'bg-slate-100 text-slate-600' },
  ENCOLADA: { label: 'En cola', clase: 'bg-blue-100 text-blue-700' },
  ENVIANDO: { label: 'Enviando…', clase: 'bg-amber-100 text-amber-700' },
  ENVIADA: { label: 'Enviada', clase: 'bg-green-100 text-green-700' },
  FALLIDA: { label: 'Fallida', clase: 'bg-red-100 text-red-700' },
};

// Arma el HTML final del email a partir del texto plano + imagen opcional.
// Simple y seguro: respeta saltos de línea y centra la imagen arriba.
function construirHtml(texto: string, imagenUrl?: string): string {
  const cuerpo = texto
    .split('\n')
    .map((l) => `<p style="margin:0 0 12px;font-size:15px;color:#333;line-height:1.6;">${escapar(l) || '&nbsp;'}</p>`)
    .join('');
  const img = imagenUrl
    ? `<img src="${imagenUrl}" alt="" style="width:100%;max-width:560px;border-radius:12px;margin:0 0 20px;display:block;" />`
    : '';
  return `<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;padding:24px;">${img}${cuerpo}</div>`;
}

function escapar(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const CampanasSection = ({ accent = '#6366f1' }: { accent?: string }) => {
  const qc = useQueryClient();
  const [vista, setVista] = useState<'lista' | 'nueva'>('lista');

  const { data: config } = useQuery({ queryKey: ['configEmail'], queryFn: getConfigEmailFn });
  const { data: campanas = [], isLoading } = useQuery({ queryKey: ['campanas'], queryFn: listarCampanasFn });
  const { data: conteos } = useQuery({ queryKey: ['destinatariosCampana'], queryFn: getDestinatariosCampanaFn });

  const listoParaEnviar = config?.listoParaEnviar ?? false;

  // ── Estado del compositor ──
  const [asunto, setAsunto] = useState('');
  const [texto, setTexto] = useState('');
  const [segmento, setSegmento] = useState<SegmentoCampana>('AMBOS');
  const [imagenUrl, setImagenUrl] = useState<string | undefined>();
  const [subiendo, setSubiendo] = useState(false);

  const resetForm = () => {
    setAsunto(''); setTexto(''); setSegmento('AMBOS'); setImagenUrl(undefined);
  };

  const subirImagen = async (file: File) => {
    setSubiendo(true);
    try {
      const r = await postBannerPromoImagenFn(file);
      setImagenUrl(r.bannerPromoImagenUrl);
      toast.success('Imagen subida');
    } catch {
      toast.error('No se pudo subir la imagen');
    } finally {
      setSubiendo(false);
    }
  };

  // Crear + enviar en un paso (crea el borrador y lo encola).
  const crearYEnviar = useMutation({
    mutationFn: async () => {
      const campana = await crearCampanaFn({
        asunto: asunto.trim(),
        cuerpoHtml: construirHtml(texto, imagenUrl),
        imagenUrl,
        segmento,
      });
      return enviarCampanaFn(campana.id);
    },
    onSuccess: (r) => {
      toast.success(r.mensaje ?? 'Campaña encolada');
      resetForm();
      setVista('lista');
      qc.invalidateQueries({ queryKey: ['campanas'] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.mensaje ?? 'No se pudo enviar la campaña'),
  });

  if (isLoading) return <div className="p-6 text-slate-400 text-sm">Cargando…</div>;

  // ── COMPOSITOR ──
  if (vista === 'nueva') {
    const totalSegmento = conteos?.[segmento] ?? 0;
    const puedeEnviar = asunto.trim().length >= 3 && texto.trim().length > 0 && totalSegmento > 0 && listoParaEnviar;

    return (
      <div className="space-y-5 max-w-2xl">
        <button
          onClick={() => setVista('lista')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-bold hover:bg-slate-200 transition"
        >
          <MI name="arrow_back" className="!text-base" /> Volver
        </button>

        <h1 className="text-2xl font-black text-slate-900">Nueva campaña</h1>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          {/* Asunto */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Asunto</label>
            <input
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              placeholder="Ej: 🎁 Ofertas por el Día del Padre"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {/* Imagen */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Imagen (opcional)</label>
            {imagenUrl ? (
              <div className="relative">
                <img src={imagenUrl} alt="" className="w-full rounded-xl border border-slate-100" />
                <button
                  onClick={() => setImagenUrl(undefined)}
                  className="absolute top-2 right-2 rounded-lg bg-black/60 text-white p-1.5 hover:bg-black/80"
                  title="Quitar"
                >
                  <MI name="close" className="!text-sm" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-6 text-sm text-slate-400 cursor-pointer hover:border-slate-300">
                <MI name="add_photo_alternate" />
                {subiendo ? 'Subiendo…' : 'Subir imagen de la oferta'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={subiendo}
                  onChange={(e) => e.target.files?.[0] && subirImagen(e.target.files[0])}
                />
              </label>
            )}
          </div>

          {/* Cuerpo */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Mensaje</label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={6}
              placeholder={'Hola!\n\nEste finde tenemos 20% off en toda la tienda. ¡No te lo pierdas!'}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400 resize-y"
            />
          </div>

          {/* Segmento */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600">Enviar a</label>
            <div className="grid grid-cols-3 gap-2">
              {SEGMENTOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSegmento(s.id)}
                  className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                    segmento === s.id ? 'border-transparent text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                  style={segmento === s.id ? { backgroundColor: accent } : undefined}
                >
                  {s.label}
                  <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                    {conteos?.[s.id] ?? 0} contacto(s)
                  </span>
                </button>
              ))}
            </div>
          </div>

          {!listoParaEnviar && (
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-700">
              Configurá y verificá tu <b>servicio de email</b> antes de enviar campañas.
            </div>
          )}

          <button
            onClick={() => crearYEnviar.mutate()}
            disabled={!puedeEnviar || crearYEnviar.isPending}
            className="w-full rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: accent }}
          >
            {crearYEnviar.isPending ? 'Enviando…' : `Enviar a ${totalSegmento} contacto(s)`}
          </button>
        </div>
      </div>
    );
  }

  // ── LISTA ──
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Campañas de email</h1>
          <p className="text-sm text-slate-500 mt-1">Enviá promociones y novedades a tus clientes.</p>
        </div>
        <button
          onClick={() => setVista('nueva')}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white shrink-0"
          style={{ backgroundColor: accent }}
        >
          <MI name="add" className="!text-base" /> Nueva campaña
        </button>
      </div>

      {campanas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-slate-400 text-sm">
          Todavía no enviaste ninguna campaña.
        </div>
      ) : (
        <div className="space-y-3">
          {campanas.map((c: Campana) => {
            const badge = ESTADO_BADGE[c.estado];
            const progreso = c.totalDestinatarios > 0
              ? Math.round(((c.enviados + c.fallidos) / c.totalDestinatarios) * 100)
              : 0;
            return (
              <div key={c.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{c.asunto}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {SEGMENTOS.find((s) => s.id === c.segmento)?.label} · {c.totalDestinatarios} destinatario(s)
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${badge.clase}`}>
                    {badge.label}
                  </span>
                </div>

                {(c.estado === 'ENVIANDO' || c.estado === 'ENCOLADA' || c.estado === 'ENVIADA') && c.totalDestinatarios > 0 && (
                  <div className="mt-3">
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${progreso}%`, backgroundColor: accent }} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {c.enviados} enviados{c.fallidos > 0 ? ` · ${c.fallidos} fallidos` : ''} de {c.totalDestinatarios}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampanasSection;
