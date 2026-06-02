import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useMisProductos } from '../hooks/useProduct';
import { postGeneratePostFn, type GeneratedMarketingKit } from '../api/ai.api';
import MI from './MaterialIcon';
import DashboardHelp from './DashboardHelp';

interface CmAiSectionProps {
  accent: string;
  tienda: any;
}

const REDES = ['Instagram', 'Facebook', 'TikTok', 'WhatsApp'];

const TONOS = [
  { id: 'profesional', label: 'Profesional' },
  { id: 'cercano', label: 'Cercano' },
  { id: 'divertido', label: 'Divertido' },
  { id: 'urgente', label: 'Urgente' },
  { id: 'emocional', label: 'Emocional' },
];

const OBJETIVOS = [
  { id: 'venta', label: 'Vender', icon: 'sell' },
  { id: 'oferta', label: 'Oferta', icon: 'local_offer' },
  { id: 'nuevo_ingreso', label: 'Nuevo ingreso', icon: 'fiber_new' },
  { id: 'bajo_stock', label: 'Bajo stock', icon: 'inventory_2' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'chat' },
  { id: 'recuperar_interes', label: 'Recuperar interes', icon: 'autorenew' },
];

function formatPrice(value?: number | string) {
  const numberValue = Number(value ?? 0);
  if (Number.isNaN(numberValue)) return '$0';
  return `$${numberValue.toLocaleString('es-AR')}`;
}

function joinKitForCopy(kit: GeneratedMarketingKit) {
  return [
    kit.caption,
    kit.hashtags.length ? kit.hashtags.join(' ') : '',
    '',
    `WhatsApp: ${kit.whatsapp}`,
    '',
    `Historia: ${kit.historia}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function CopyButton({
  accent,
  value,
  label = 'Copiar',
}: {
  accent: string;
  value: string;
  label?: string;
}) {
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
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition hover:opacity-80"
      style={
        copied
          ? { backgroundColor: '#dcfce7', color: '#16a34a' }
          : { backgroundColor: `${accent}18`, color: accent }
      }
    >
      <MI name={copied ? 'check' : 'content_copy'} className="!text-[14px]" />
      {copied ? 'Copiado' : label}
    </button>
  );
}

function ResultCard({
  title,
  icon,
  accent,
  value,
  children,
}: {
  title: string;
  icon: string;
  accent: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50 px-4 py-3">
        <h3 className="flex items-center gap-2 text-sm font-black text-zinc-900">
          <MI name={icon} className="!text-[18px] text-zinc-400" />
          {title}
        </h3>
        {value && <CopyButton accent={accent} value={value} />}
      </div>
      <div className="p-4 text-sm leading-relaxed text-zinc-700">{children}</div>
    </section>
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
    () => productos.find((product) => product.id === selectedProductId),
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
    generate({
      productoId: selectedProductId,
      tiendaId: tienda?.id,
      redSocial,
      tono,
      objetivo,
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 custom-scrollbar">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accent}1A`, color: accent }}
          >
            <MI name="auto_awesome" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Community Manager IA
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-zinc-500 max-w-2xl">
            Genera un kit completo para vender un producto: caption, WhatsApp, historia,
            hashtags, ideas visuales y variantes listas para copiar.
          </p>
          <DashboardHelp activeSection="cm-ai" accent={accent} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <aside className="xl:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <MI name="tune" className="!text-[18px] text-zinc-400" />
              Configuracion
            </h3>

            <div className="space-y-5">
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
                    onChange={(event) => setSelectedProductId(Number(event.target.value))}
                  >
                    <option value="" disabled>
                      Elegi un producto
                    </option>
                    {productos.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.nombre} ({formatPrice(product.precioOferta || product.precio)})
                      </option>
                    ))}
                  </select>
                )}
              </div>

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
                  </div>
                </div>
              )}

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
                        <MI
                          name={item.icon}
                          className="!text-[18px] mb-1"
                          style={{ color: active ? accent : '#a1a1aa' }}
                        />
                        <span className="block text-xs font-bold text-zinc-800">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wide">
                  Red social
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {REDES.map((red) => {
                    const active = redSocial === red;
                    return (
                      <button
                        key={red}
                        type="button"
                        onClick={() => setRedSocial(red)}
                        className="rounded-xl border px-2 py-3 text-xs font-bold transition hover:bg-zinc-50"
                        style={active ? { borderColor: accent, color: accent } : {}}
                      >
                        {red}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 uppercase tracking-wide">
                  Tono
                </label>
                <select
                  className="w-full text-sm p-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 bg-zinc-50 text-zinc-800"
                  value={tono}
                  onChange={(event) => setTono(event.target.value)}
                >
                  {TONOS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

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
                    Generar kit de publicacion
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>

        <main className="xl:col-span-8">
          {isPending ? (
            <div className="rounded-2xl border border-zinc-200 bg-white min-h-[520px] flex flex-col items-center justify-center text-zinc-400 gap-3">
              <div className="relative flex justify-center items-center">
                <div
                  className="absolute animate-ping w-12 h-12 rounded-full opacity-20"
                  style={{ backgroundColor: accent }}
                />
                <MI name="auto_awesome" className="text-4xl animate-pulse" style={{ color: accent }} />
              </div>
              <p className="text-sm font-medium">La IA esta armando tu kit...</p>
            </div>
          ) : kit ? (
            <div className="space-y-5">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-950 text-white p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400 mb-2">
                      Resumen
                    </p>
                    <h2 className="text-xl font-black">{kit.resumen}</h2>
                    <p className="mt-3 text-sm text-zinc-300">
                      Hook sugerido: <span className="font-bold text-white">{kit.hook}</span>
                    </p>
                  </div>
                  <CopyButton accent={accent} value={joinKitForCopy(kit)} label="Copiar todo" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ResultCard title="Caption" icon="edit_document" accent={accent} value={kit.caption}>
                  <pre className="whitespace-pre-wrap font-sans">{kit.caption}</pre>
                  {kit.hashtags.length > 0 && (
                    <p className="mt-4 text-xs font-semibold" style={{ color: accent }}>
                      {kit.hashtags.join(' ')}
                    </p>
                  )}
                </ResultCard>

                <ResultCard title="WhatsApp" icon="chat" accent={accent} value={kit.whatsapp}>
                  <pre className="whitespace-pre-wrap font-sans">{kit.whatsapp}</pre>
                </ResultCard>

                <ResultCard title="Historia" icon="auto_stories" accent={accent} value={kit.historia}>
                  <pre className="whitespace-pre-wrap font-sans">{kit.historia}</pre>
                </ResultCard>

                <ResultCard title="CTA" icon="ads_click" accent={accent} value={kit.cta}>
                  <p>{kit.cta}</p>
                </ResultCard>
              </div>

              <ResultCard title="Variantes listas" icon="dynamic_feed" accent={accent}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {kit.variantes.map((variant) => (
                    <div key={variant.titulo} className="rounded-xl border border-zinc-200 p-3">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-xs font-black uppercase text-zinc-500">
                          {variant.titulo}
                        </p>
                        <CopyButton accent={accent} value={variant.texto} />
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{variant.texto}</p>
                    </div>
                  ))}
                </div>
              </ResultCard>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ResultCard title="Ideas visuales" icon="photo_camera" accent={accent}>
                  <ul className="space-y-2">
                    {kit.ideasVisuales.map((idea) => (
                      <li key={idea} className="flex gap-2">
                        <span style={{ color: accent }}>•</span>
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </ResultCard>

                <ResultCard title="Recomendaciones" icon="tips_and_updates" accent={accent}>
                  <ul className="space-y-2">
                    {kit.recomendaciones.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span style={{ color: accent }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </ResultCard>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white min-h-[520px] flex flex-col items-center justify-center text-zinc-300 gap-3 px-6 text-center">
              <MI name="edit_note" className="text-5xl" />
              <p className="text-sm font-medium max-w-sm">
                Elegi un producto y un objetivo. Aca vas a recibir un kit completo listo para
                publicar o enviar por WhatsApp.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
