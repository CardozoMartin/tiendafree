import { useEffect, useState } from 'react';
import { STATUS_META } from '../constant/constants';
import MI from './MaterialIcon';
import { getMisProductosFn } from '../api/product.api';
import { getOrdersFn } from '../api/orders.api';
import { useMyShop } from '../hooks/useShop';

// ── Tipos de resultado que puede devolver una consulta ──────────────────────
type ResultKind = 'productos' | 'pedidos';

interface AsistenteMensaje {
  id: number;
  autor: 'user' | 'bot';
  texto: string;
  kind?: ResultKind;
  filas?: any[];
  animar?: boolean;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Texto que se tipea letra por letra, como un modelo de IA respondiendo ──
const TypedText = ({ texto, onDone }: { texto: string; onDone?: () => void }) => {
  const [visible, setVisible] = useState('');

  useEffect(() => {
    setVisible('');
    let i = 0;
    const step = () => {
      i += 1;
      setVisible(texto.slice(0, i));
      if (i < texto.length) {
        timer = window.setTimeout(step, 14 + Math.random() * 18);
      } else {
        onDone?.();
      }
    };
    let timer = window.setTimeout(step, 14);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto]);

  return <>{visible}</>;
};

// ── Consultas predefinidas (reglas, sin LLM) ────────────────────────────────
interface Consulta {
  id: string;
  label: string;
  icon: string;
  respuestaVacia: string;
  respuestaTexto: (n: number) => string;
  run: (tiendaId?: number) => Promise<any[]>;
  kind: ResultKind;
}

const CONSULTAS: Consulta[] = [
  {
    id: 'stock-bajo',
    label: 'Stock bajo',
    icon: 'warning',
    kind: 'productos',
    respuestaVacia: 'Ningún producto tiene el stock bajo por ahora.',
    respuestaTexto: (n) => `Encontré ${n} producto${n === 1 ? '' : 's'} con stock bajo:`,
    run: async () => {
      const { datos } = await getMisProductosFn({ bajoStock: true, orden: 'nombre', direccion: 'asc', limite: 100 });
      return datos;
    },
  },
  {
    id: 'sin-stock',
    label: 'Sin stock',
    icon: 'remove_shopping_cart',
    kind: 'productos',
    respuestaVacia: 'No hay productos sin stock. ',
    respuestaTexto: (n) => `Hay ${n} producto${n === 1 ? '' : 's'} sin stock:`,
    run: async () => {
      const { datos } = await getMisProductosFn({ limite: 1000 });
      return (datos || []).filter((p: any) => Number(p.stock) === 0);
    },
  },
  {
    id: 'pedidos-pendientes',
    label: 'Pedidos pendientes',
    icon: 'schedule',
    kind: 'pedidos',
    respuestaVacia: 'No tenés pedidos pendientes en este momento.',
    respuestaTexto: (n) => `Tenés ${n} pedido${n === 1 ? '' : 's'} pendiente${n === 1 ? '' : 's'}:`,
    run: async (tiendaId) => {
      const res = await getOrdersFn({ tiendaId, estado: 'PENDIENTE', pagina: 1, limite: 100 });
      return res?.datos || [];
    },
  },
  {
    id: 'pedidos-cancelados',
    label: 'Pedidos cancelados',
    icon: 'cancel',
    kind: 'pedidos',
    respuestaVacia: 'No tenés pedidos cancelados.',
    respuestaTexto: (n) => `Encontré ${n} pedido${n === 1 ? '' : 's'} cancelado${n === 1 ? '' : 's'}:`,
    run: async (tiendaId) => {
      const res = await getOrdersFn({ tiendaId, estado: 'CANCELADO', pagina: 1, limite: 100 });
      return res?.datos || [];
    },
  },
];

// Palabras clave para interpretar texto libre y mapearlo a una consulta.
const KEYWORDS: { test: (t: string) => boolean; id: string }[] = [
  { id: 'sin-stock', test: (t) => t.includes('sin stock') || t.includes('agotado') || t.includes('no queda') },
  { id: 'stock-bajo', test: (t) => t.includes('stock') && (t.includes('bajo') || t.includes('poco') || t.includes('menos')) },
  { id: 'pedidos-cancelados', test: (t) => t.includes('pedido') && t.includes('cancel') },
  { id: 'pedidos-pendientes', test: (t) => t.includes('pedido') && (t.includes('pendient') || t.includes('sin procesar') || t.includes('sin confirmar')) },
];

const matchConsulta = (texto: string): Consulta | null => {
  const t = texto.toLowerCase();
  const hit = KEYWORDS.find((k) => k.test(t));
  return hit ? CONSULTAS.find((c) => c.id === hit.id) || null : null;
};

// ── Badge de estado de pedido (mismo criterio que OrdersSection) ────────────
const Badge = ({ status }: { status: string }) => {
  const m = STATUS_META[status] || { label: status, bg: 'bg-slate-100', text: 'text-slate-700' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-wider ${m.bg} ${m.text}`}>
      {m.label}
    </span>
  );
};

// ── Tabla de resultados ──────────────────────────────────────────────────────
const ResultTable = ({ kind, filas }: { kind: ResultKind; filas: any[] }) => {
  if (kind === 'productos') {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-2.5 text-[.62rem] font-black text-slate-400 uppercase tracking-widest">Producto</th>
                <th className="px-4 py-2.5 text-[.62rem] font-black text-slate-400 uppercase tracking-widest text-center">Stock</th>
                <th className="px-4 py-2.5 text-[.62rem] font-black text-slate-400 uppercase tracking-widest text-right">Precio</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((p: any) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                        {p.imagenPrincipalUrl ? (
                          <img src={p.imagenPrincipalUrl} alt={p.nombre} className="w-full h-full object-contain p-0.5" />
                        ) : (
                          <MI name="inventory_2" className="!text-sm text-slate-300" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-800 line-clamp-1">{p.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-black text-sm ${Number(p.stock) === 0 ? 'text-red-500' : 'text-amber-500'}`}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-slate-700 whitespace-nowrap">
                    ${Number(p.precio).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[520px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-4 py-2.5 text-[.62rem] font-black text-slate-400 uppercase tracking-widest">Pedido</th>
              <th className="px-4 py-2.5 text-[.62rem] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
              <th className="px-4 py-2.5 text-[.62rem] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
              <th className="px-4 py-2.5 text-[.62rem] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
              <th className="px-4 py-2.5 text-[.62rem] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((o: any) => (
              <tr key={o.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3 font-black text-slate-900 text-sm">#{o.id}</td>
                <td className="px-4 py-3 text-sm font-bold text-slate-700">{o.compradorNombre}</td>
                <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                  {new Date(o.creadoEn).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3 text-right font-black text-slate-900 text-sm whitespace-nowrap">${Number(o.total).toLocaleString()}</td>
                <td className="px-4 py-3 text-center"><Badge status={o.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AsistenteSection = ({ accent }: { accent: string }) => {
  const { data: myShop } = useMyShop();
  const tiendaId = myShop?.id ?? myShop?.datos?.id;

  const [mensajes, setMensajes] = useState<AsistenteMensaje[]>([
    { id: 0, autor: 'bot', texto: 'Hola 👋 Preguntame por stock bajo, productos sin stock, pedidos pendientes o cancelados.' },
  ]);
  const [input, setInput] = useState('');
  const [pensando, setPensando] = useState(false);
  const [escritos, setEscritos] = useState<Set<number>>(new Set());
  const loading = pensando;

  const marcarEscrito = (id: number) => setEscritos((prev) => new Set(prev).add(id));

  const ejecutar = async (consulta: Consulta, textoUsuario: string) => {
    setMensajes((prev) => [...prev, { id: Date.now(), autor: 'user', texto: textoUsuario }]);
    setPensando(true);
    try {
      const [filas] = await Promise.all([consulta.run(tiendaId), sleep(650 + Math.random() * 500)]);
      const texto = filas.length === 0 ? consulta.respuestaVacia : consulta.respuestaTexto(filas.length);
      setPensando(false);
      setMensajes((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          autor: 'bot',
          texto,
          kind: filas.length > 0 ? consulta.kind : undefined,
          filas: filas.length > 0 ? filas : undefined,
          animar: true,
        },
      ]);
    } catch {
      setPensando(false);
      setMensajes((prev) => [
        ...prev,
        { id: Date.now() + 1, autor: 'bot', texto: 'Tuve un problema para traer esos datos, probá de nuevo en un momento.', animar: true },
      ]);
    }
  };

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || loading) return;
    setInput('');
    const consulta = matchConsulta(texto);
    if (!consulta) {
      setMensajes((prev) => [...prev, { id: Date.now(), autor: 'user', texto }]);
      setPensando(true);
      await sleep(500 + Math.random() * 400);
      setPensando(false);
      setMensajes((prev) => [
        ...prev,
        { id: Date.now() + 1, autor: 'bot', texto: 'No entendí bien esa consulta. Probá con alguno de estos atajos:', animar: true },
      ]);
      return;
    }
    ejecutar(consulta, texto);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-slate-900">Asistente</h1>
      </div>

      {/* Chips de atajos */}
      <div className="flex gap-2 flex-wrap">
        {CONSULTAS.map((c) => (
          <button
            key={c.id}
            onClick={() => ejecutar(c, c.label)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold bg-slate-100 text-slate-600 border-none cursor-pointer hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            <MI name={c.icon} className="!text-sm" style={{ color: accent }} />
            {c.label}
          </button>
        ))}
      </div>

      {/* Historial de mensajes */}
      <div className="space-y-4">
        {mensajes.map((m) => (
          <div key={m.id} className={`flex ${m.autor === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] space-y-3 ${m.autor === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div
                className={
                  m.autor === 'user'
                    ? 'rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm font-medium text-white'
                    : 'rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm font-medium bg-white border border-slate-100 shadow-sm text-slate-700'
                }
                style={m.autor === 'user' ? { backgroundColor: accent } : undefined}
              >
                {m.autor === 'bot' && m.animar && !escritos.has(m.id) ? (
                  <TypedText texto={m.texto} onDone={() => marcarEscrito(m.id)} />
                ) : (
                  m.texto
                )}
              </div>
              {m.filas && m.kind && (!m.animar || escritos.has(m.id)) && (
                <div className="w-full min-w-[280px] animate-fade-in">
                  <ResultTable kind={m.kind} filas={m.filas} />
                </div>
              )}
            </div>
          </div>
        ))}
        {pensando && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 bg-white border border-slate-100 shadow-sm">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.3s]" />
                <span className="size-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:-0.15s]" />
                <span className="size-1.5 rounded-full bg-slate-300 animate-bounce" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-gradient-to-t from-slate-50 pt-4">
        <div className="flex gap-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviar()}
            placeholder="Preguntá algo, ej: qué productos tienen stock bajo"
            className="flex-1 px-3 py-2 text-sm outline-none bg-transparent text-slate-800"
            disabled={loading}
          />
          <button
            onClick={enviar}
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center size-10 rounded-xl border-none cursor-pointer text-white disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: accent }}
          >
            <MI name="send" className="!text-lg" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.25s ease-out; }
      `}</style>
    </div>
  );
};

export default AsistenteSection;
