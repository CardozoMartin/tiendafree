import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useMisProductos } from '../hooks/useProduct';
import { postGeneratePostFn, type GeneratedMarketingKit, type MarketingBlock } from '../api/ai.api';
import MI from './MaterialIcon';
import DashboardHelp from './DashboardHelp';

interface CmAiSectionProps {
  accent: string;
  tienda: any;
}

const REDES: Array<{ id: string; label: string; icon: React.ReactNode }> = [
  {
    id: 'Instagram',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: 'Facebook',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'TikTok',
    label: 'TikTok',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    id: 'WhatsApp',
    label: 'WhatsApp',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

const TONOS = [
  { id: 'profesional', label: 'Profesional' },
  { id: 'cercano',     label: 'Cercano' },
  { id: 'divertido',   label: 'Divertido' },
  { id: 'urgente',     label: 'Urgente' },
  { id: 'emocional',   label: 'Emocional' },
];

const OBJETIVOS = [
  { id: 'venta',             label: 'Vender',            icon: 'sell' },
  { id: 'oferta',            label: 'Oferta',            icon: 'local_offer' },
  { id: 'nuevo_ingreso',     label: 'Nuevo ingreso',     icon: 'fiber_new' },
  { id: 'bajo_stock',        label: 'Bajo stock',        icon: 'inventory_2' },
  { id: 'whatsapp',          label: 'WhatsApp',          icon: 'chat' },
  { id: 'recuperar_interes', label: 'Recuperar interes', icon: 'autorenew' },
];

const BLOQUES: Array<{ key: keyof Pick<GeneratedMarketingKit, 'venta' | 'promocion' | 'organico'>; label: string; icon: string; color: string }> = [
  { key: 'venta',    label: 'Venta directa', icon: 'sell',         color: '#ef4444' },
  { key: 'promocion',label: 'Promocion',     icon: 'local_offer',  color: '#f59e0b' },
  { key: 'organico', label: 'Organico',      icon: 'eco',          color: '#10b981' },
];

function formatPrice(value?: number | string) {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return '$0';
  return `$${n.toLocaleString('es-AR')}`;
}

function CopyButton({ accent, value, label = 'Copiar' }: { accent: string; value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (!value.trim()) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition hover:opacity-80 shrink-0"
      style={copied ? { backgroundColor: '#dcfce7', color: '#16a34a' } : { backgroundColor: `${accent}18`, color: accent }}
    >
      <MI name={copied ? 'check' : 'content_copy'} className="!text-[14px]" />
      {copied ? 'Copiado' : label}
    </button>
  );
}

function BlockCard({ block, accent, defaultOpen = false }: { block: MarketingBlock; accent: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  const fullCopy = [block.caption, block.hashtags.join(' '), '', `WhatsApp: ${block.whatsapp}`, '', `Historia: ${block.historia}`]
    .filter(Boolean)
    .join('\n');

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-zinc-50 transition"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">{block.descripcion}</p>
          <h3 className="text-sm font-black text-zinc-900">{block.titulo}</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CopyButton accent={accent} value={fullCopy} label="Copiar todo" />
          <MI name={open ? 'expand_less' : 'expand_more'} className="!text-[20px] text-zinc-400" />
        </div>
      </button>

      {open && (
        <div className="border-t border-zinc-100 divide-y divide-zinc-100">
          {/* Caption */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 flex items-center gap-1.5">
                <MI name="edit_document" className="!text-[14px]" /> Caption
              </p>
              <CopyButton accent={accent} value={block.caption} />
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-800">{block.caption}</pre>
            {block.hashtags.length > 0 && (
              <p className="mt-3 text-xs font-semibold" style={{ color: accent }}>{block.hashtags.join(' ')}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 flex items-center gap-1.5">
                <MI name="chat" className="!text-[14px]" /> WhatsApp
              </p>
              <CopyButton accent={accent} value={block.whatsapp} />
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-800">{block.whatsapp}</pre>
          </div>

          {/* Historia */}
          <div className="px-5 py-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 flex items-center gap-1.5">
                <MI name="auto_stories" className="!text-[14px]" /> Historia
              </p>
              <CopyButton accent={accent} value={block.historia} />
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-800">{block.historia}</pre>
          </div>

          {/* CTA */}
          <div className="px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 flex items-center gap-1.5 mb-2">
              <MI name="ads_click" className="!text-[14px]" /> CTA
            </p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-zinc-800">{block.cta}</p>
              <CopyButton accent={accent} value={block.cta} />
            </div>
          </div>

          {/* Ideas visuales */}
          {block.ideasVisuales.length > 0 && (
            <div className="px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-500 flex items-center gap-1.5 mb-3">
                <MI name="photo_camera" className="!text-[14px]" /> Ideas visuales
              </p>
              <ul className="space-y-2">
                {block.ideasVisuales.map((idea, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-700">
                    <span style={{ color: accent }} className="mt-0.5 shrink-0">•</span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function KitResult({ kit, accent }: { kit: GeneratedMarketingKit; accent: string }) {
  const [activeBloque, setActiveBloque] = useState<'venta' | 'promocion' | 'organico'>('venta');

  return (
    <div className="space-y-5">
      {/* Resumen y hook */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-950 text-white p-5 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-2">Kit generado</p>
        <h2 className="text-xl font-black leading-snug">{kit.resumen}</h2>
        <p className="mt-3 text-sm text-zinc-300">
          Hook: <span className="font-bold text-white">"{kit.hook}"</span>
        </p>
      </div>

      {/* Selector de bloque */}
      <div className="grid grid-cols-3 gap-3">
        {BLOQUES.map((b) => {
          const active = activeBloque === b.key;
          return (
            <button
              key={b.key}
              type="button"
              onClick={() => setActiveBloque(b.key)}
              className="rounded-2xl border p-4 text-left transition hover:shadow-md"
              style={active ? { borderColor: b.color, backgroundColor: `${b.color}10` } : { borderColor: '#e4e4e7' }}
            >
              <MI name={b.icon} className="!text-[22px] mb-2" style={{ color: active ? b.color : '#a1a1aa' }} />
              <p className="text-xs font-black text-zinc-900">{b.label}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">
                {b.key === 'venta' && 'Cierra la venta hoy'}
                {b.key === 'promocion' && 'Destaca precio u oferta'}
                {b.key === 'organico' && 'Genera engagement'}
              </p>
            </button>
          );
        })}
      </div>

      {/* Bloque activo */}
      <BlockCard block={kit[activeBloque]} accent={accent} defaultOpen />

      {/* Recomendaciones */}
      {kit.recomendaciones.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-black text-amber-900 flex items-center gap-2 mb-3">
            <MI name="tips_and_updates" className="!text-[18px] text-amber-500" />
            Consejos para mejorar tus publicaciones
          </p>
          <ul className="space-y-2">
            {kit.recomendaciones.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-amber-800">
                <span className="text-amber-500 shrink-0 mt-0.5">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function CmAiSection({ accent, tienda }: CmAiSectionProps) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [redSocial, setRedSocial] = useState('Instagram');
  const [tono, setTono] = useState('profesional');
  const [objetivo, setObjetivo] = useState('venta');
  const [kit, setKit] = useState<GeneratedMarketingKit | null>(null);

  const { data: qProductos, isLoading: isProductosLoading } = useMisProductos({ limite: 100 });
  const productos = useMemo(() => qProductos?.datos || [], [qProductos?.datos]);
  const selectedProduct = useMemo(
    () => productos.find((p) => p.id === selectedProductId),
    [productos, selectedProductId]
  );

  const { mutate: generate, isPending } = useMutation({
    mutationFn: postGeneratePostFn,
    onSuccess: (res) => {
      if (res.success && res.data) {
        setKit(res.data);
        toast.success('Kit de publicacion generado');
        return;
      }
      toast.error(res.message ?? 'No se pudo generar el kit');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Error generando el kit');
    },
  });

  const handleGenerate = () => {
    if (!selectedProductId) {
      toast.error('Elegi un producto primero');
      return;
    }
    setKit(null);
    generate({ productoId: selectedProductId, tiendaId: tienda?.id, redSocial, tono, objetivo });
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 custom-scrollbar">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accent}1A`, color: accent }}
          >
            <MI name="auto_awesome" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Community Manager IA</h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 max-w-2xl">
            Genera 3 kits de publicacion listos para usar: venta directa, promocion y contenido organico.
            La IA usa los datos reales de tu producto (ventas, calificaciones, stock) para escribir copy que funciona.
          </p>
          <DashboardHelp activeSection="cm-ai" accent={accent} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Panel lateral de configuracion */}
        <aside className="xl:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <MI name="tune" className="!text-[18px] text-zinc-400" />
              Configuracion
            </h3>

            <div className="space-y-5">
              {/* Selector de producto */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Producto
                </label>
                {isProductosLoading ? (
                  <div className="animate-pulse h-11 bg-zinc-100 rounded-xl w-full" />
                ) : (
                  <select
                    className="w-full text-sm p-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 bg-zinc-50 text-zinc-800"
                    value={selectedProductId || ''}
                    onChange={(e) => { setSelectedProductId(Number(e.target.value)); setKit(null); }}
                  >
                    <option value="" disabled>Elegi un producto</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} ({formatPrice(p.precioOferta || p.precio)})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Preview del producto seleccionado */}
              {selectedProduct && (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <p className="text-sm font-black text-zinc-900">{selectedProduct.nombre}</p>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                    {selectedProduct.descripcion || 'Sin descripcion cargada'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-zinc-500">
                    <span className="rounded-full bg-white border border-zinc-200 px-2 py-1">
                      Stock {selectedProduct.stock ?? 0}
                    </span>
                    {selectedProduct.categoria?.nombre && (
                      <span className="rounded-full bg-white border border-zinc-200 px-2 py-1">
                        {selectedProduct.categoria.nombre}
                      </span>
                    )}
                    {selectedProduct.precioOferta && (
                      <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1">
                        Oferta activa
                      </span>
                    )}
                    {selectedProduct.destacado && (
                      <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1">
                        Destacado
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Objetivo */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                  Objetivo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {OBJETIVOS.map((item) => {
                    const active = objetivo === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setObjetivo(item.id)}
                        className="rounded-xl border p-3 text-left transition hover:bg-zinc-50"
                        style={active ? { borderColor: accent, backgroundColor: `${accent}12` } : {}}
                      >
                        <MI name={item.icon} className="!text-[18px] mb-1" style={{ color: active ? accent : '#a1a1aa' }} />
                        <span className="block text-xs font-bold text-zinc-800">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Red social */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                  Red social
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {REDES.map((red) => {
                    const active = redSocial === red.id;
                    return (
                      <button
                        key={red.id}
                        type="button"
                        onClick={() => setRedSocial(red.id)}
                        title={red.label}
                        className="rounded-xl border py-3 flex items-center justify-center transition hover:bg-zinc-50"
                        style={active ? { borderColor: accent, color: accent, backgroundColor: `${accent}10` } : { color: '#a1a1aa' }}
                      >
                        {red.icon}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tono */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Tono
                </label>
                <select
                  className="w-full text-sm p-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 bg-zinc-50 text-zinc-800"
                  value={tono}
                  onChange={(e) => setTono(e.target.value)}
                >
                  {TONOS.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Boton generar */}
              <button
                onClick={handleGenerate}
                disabled={isPending || !selectedProductId}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl text-sm font-bold text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98] shadow-md"
                style={{ backgroundColor: accent }}
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generando kit...
                  </>
                ) : (
                  <>
                    <MI name="magic_button" className="!text-[18px]" />
                    {kit ? 'Regenerar kit' : 'Generar kit de publicacion'}
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>

        {/* Panel principal de resultados */}
        <main className="xl:col-span-8">
          {isPending ? (
            <div className="rounded-2xl border border-zinc-200 bg-white min-h-[520px] flex flex-col items-center justify-center text-zinc-400 gap-4">
              <div className="relative flex justify-center items-center">
                <div className="absolute animate-ping w-14 h-14 rounded-full opacity-20" style={{ backgroundColor: accent }} />
                <MI name="auto_awesome" className="text-5xl animate-pulse" style={{ color: accent }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-zinc-700">Armando tu kit...</p>
                <p className="text-xs text-zinc-400 mt-1">La IA esta analizando el producto y generando 3 bloques.</p>
              </div>
            </div>
          ) : kit ? (
            <KitResult kit={kit} accent={accent} />
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white min-h-[520px] flex flex-col items-center justify-center text-zinc-300 gap-4 px-6 text-center">
              <MI name="edit_note" className="text-5xl" />
              <div>
                <p className="text-sm font-bold text-zinc-400 max-w-sm">
                  Elegi un producto, configura el objetivo y la red social.
                </p>
                <p className="text-xs text-zinc-300 mt-1 max-w-xs">
                  Vas a recibir 3 kits distintos: para vender, para promocionar y para generar engagement.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
